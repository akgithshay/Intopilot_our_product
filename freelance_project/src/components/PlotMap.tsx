// src/components/PlotMap.tsx
import React, { useEffect } from 'react';
import './PlotMap.css';

export const PlotMap: React.FC = () => {

  useEffect(() => {
    const abortController = new AbortController();
    const { signal } = abortController;

    const $ = (i: string) => document.getElementById(i) as any;
    const KEY = 'intopilot-plotmap-v6', VW = 1000, VH = 760, PDFJS = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/';
    const svg = $('map');
    if(!svg) return;

    const IC = {
      pencil: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>',
      pin: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21Z"/><circle cx="12" cy="9.5" r="2.5"/></svg>',
      cursor: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m5 3 14 7-6 2-2 6Z"/></svg>',
      draw: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 5l14 3-2 11-12-2Z"/><circle cx="5" cy="5" r="1.4" fill="currentColor"/><circle cx="19" cy="8" r="1.4" fill="currentColor"/><circle cx="17" cy="19" r="1.4" fill="currentColor"/><circle cx="5" cy="17" r="1.4" fill="currentColor"/></svg>',
      upload: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 16V4M7 9l5-5 5 5"/><path d="M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3"/></svg>',
      ruler: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m3 17 14-14 4 4L7 21Z"/><path d="m7 13 2 2M10 10l2 2M13 7l2 2"/></svg>',
      back: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m15 18-6-6 6-6"/></svg>'
    };

    function rng(seed: number) { let s = seed >>> 0; return function () { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; } }
    const AGENTS0 = ['Rohit Hegde', 'Meenakshi Rao', 'Faisal Khan', 'Sandeep Nair', 'Divya Prabhu', 'Karthik Shetty'];
    const BUYERS = ['Ramesh Gowda', 'Anita Sharma', 'Vikram Rao', 'Priya Nair', 'Suresh Reddy', 'Kavitha Iyer', 'Mohammed Irfan', 'Deepa Menon', 'Arjun Patel', 'Lakshmi Narayan', 'Sanjay Kulkarni', 'Neha Verma', 'Rahul Bhat', 'Shalini Das', 'Manoj Kumar', 'Farah Khan', 'Girish Hegde', 'Sunita Joshi'];
    const SPECS = [
      { id: 'j1', name: 'Ascent Greens', where: 'Devanahalli', seed: 11, rate: 2650, sold: .56, warp: { amp: 26, freq: 1.3, ph: 0, shear: .045 }, blocks: [[10, 3], [10, 3], [10, 2]] },
      { id: 'j2', name: 'Lakeview Enclave', where: 'Hoskote', seed: 23, rate: 2900, sold: .44, warp: { amp: 22, freq: 1.1, ph: 1.2, shear: -.04 }, blocks: [[10, 3], [10, 2], [10, 2]] },
      { id: 'j3', name: 'Palm Meadows', where: 'Anekal', seed: 37, rate: 2350, sold: .68, warp: { amp: 28, freq: 1.6, ph: 2.1, shear: .03 }, blocks: [[10, 2], [10, 2], [10, 2]] },
      { id: 'j4', name: 'Sunrise Valley', where: 'Doddaballapur', seed: 41, rate: 2500, sold: .3, warp: { amp: 24, freq: 1.0, ph: .6, shear: -.05 }, blocks: [[9, 2], [9, 2], [8, 2]] },
      { id: 'j5', name: 'Orchard Heights', where: 'Kanakapura', seed: 59, rate: 3100, sold: .5, warp: { amp: 28, freq: 1.4, ph: 3, shear: .05 }, blocks: [[8, 2], [8, 2], [9, 2]] }
    ];
    const Y0 = [44, 280, 516], BH = 170, X0 = 50, BW = 900, ROADY = [247, 483], K0 = .14;
    
    function warp(w: any, x: any, y: any) { return [x + w.shear * (y - 372), y + w.amp * Math.sin(x / 1000 * Math.PI * w.freq + w.ph)] }
    function build(sp: any) {
      let r = rng(sp.seed), plots: any = [], num = 1, ni = 0;
      sp.blocks.forEach(function (b: any, bi: any) {
        let cols = b[0], rows = b[1], ws: any = [], tot = 0, fr = [0], c, ri;
        for (c = 0; c < cols; c++) { ws[c] = .75 + .5 * r(); tot += ws[c] }
        for (c = 0; c < cols; c++) fr[c + 1] = fr[c] + ws[c] / tot;
        let tl = (r() - .5) * 70, tr = (r() - .5) * 70, V: any = [];
        for (ri = 0; ri <= rows; ri++) {
          V[ri] = []; for (c = 0; c <= cols; c++) {
            let sideX = (c === 0 || c === cols), capY = (ri === 0 || ri === rows);
            let jx = (r() - .5) * 2 * (sideX ? 2 : 12), jy = (r() - .5) * 2 * (capY ? 2 : 11), t = ri / rows - .5;
            let x = X0 + BW * fr[c] + jx + tl * t * (1 - c / cols) + tr * t * (c / cols), y = Y0[bi] + BH * ri / rows + jy, q = warp(sp.warp, x, y);
            V[ri][c] = [Math.round(q[0]), Math.round(q[1])];
          }
        }
        for (ri = 0; ri < rows; ri++) for (c = 0; c < cols; c++) {
          let pts = [V[ri][c], V[ri][c + 1], V[ri + 1][c + 1], V[ri + 1][c]];
          let area = Math.round(polyArea(pts) * K0 / 10) * 10, sold = r() < sp.sold;
          let ag = sold ? (1 + Math.floor(r() * AGENTS0.length)) : 0;
          plots.push({
            id: sp.id + '-' + num, label: String(num), pts: pts, status: sold ? 'sold' : 'open', agent: ag ? 'a' + ag : '',
            buyer: sold ? BUYERS[(ni++ * 7 + num) % BUYERS.length] : '', area: area, value: Math.round(area * sp.rate * (.94 + .12 * r()) / 1e4) * 1e4
          });
          num++;
        }
      });
      return { id: sp.id, name: sp.name, where: sp.where, k: K0, bg: null, sample: true, warp: sp.warp, plots: plots };
    }
    
    function freshAgents() { return AGENTS0.map(function (n, i) { return { id: 'a' + (i + 1), name: n } }) }
    function freshProjects() { return SPECS.map(build) }
    function load() {
      try {
        let d = JSON.parse(localStorage.getItem(KEY) || '');
        if (d && d.agents && d.projects && d.projects.length && d.projects.every(function (p: any) { return p && p.plots })) return d
      } catch (e) { } return null
    }
    let warned = false;
    function save() {
      try { localStorage.setItem(KEY, JSON.stringify({ agents: agents, projects: projects })) } catch (e) {
        if (!warned) { warned = true; toast('This browser cannot store all of it, so changes may not be remembered.') }
      }
    }

    let D0 = load();
    let agents = D0 ? D0.agents : freshAgents(), projects = D0 ? D0.projects : freshProjects();
    let v = { x: 0, y: 0, w: VW, h: VH };
    let st: any = {
      pi: 0, sel: null, off: {}, agent: 'all', q: '', mode: 'view', draft: [], scaleP: [], cursor: null, snapped: false,
      panel: 'overview', edit: false, isNew: false, w: null, pending: null, modal: null, confirm: {}
    };

    function cur() { return projects[st.pi] }
    function byId(id: any) { let a = cur().plots; for (let i = 0; i < a.length; i++) if (a[i].id === id) return a[i] }
    function agentName(id: any) { for (let i = 0; i < agents.length; i++) if (agents[i].id === id) return agents[i].name; return '' }
    function initials(n: any) { return n.split(/\s+/).map(function (w: any) { return w.charAt(0) }).join('').slice(0, 2).toUpperCase() }
    function polyArea(p: any) { let a = 0; for (let i = 0; i < p.length; i++) { let q = p[(i + 1) % p.length]; a += p[i][0] * q[1] - q[0] * p[i][1] } return Math.abs(a / 2) }
    function cen(p: any) {
      let a = 0, x = 0, y = 0, n = p.length, i;
      for (i = 0; i < n; i++) { let j = (i + 1) % n, f = p[i][0] * p[j][1] - p[j][0] * p[i][1]; a += f; x += (p[i][0] + p[j][0]) * f; y += (p[i][1] + p[j][1]) * f }
      if (Math.abs(a) < 1e-6) { x = 0; y = 0; p.forEach(function (q: any) { x += q[0]; y += q[1] }); return [x / n, y / n] }
      return [x / (3 * a), y / (3 * a)]
    }
    function areaFor(P: any, pts: any) { return P.k ? Math.round(polyArea(pts) * P.k / 10) * 10 : 0 }
    function nextLabel(P: any) { let m = 0; P.plots.forEach(function (p: any) { let n = parseInt(p.label, 10); if (n > m) m = n }); return String(m + 1) }
    function inr(n: any) { return '₹' + Math.round(n || 0).toLocaleString('en-IN') }
    function short(n: any) { return n >= 1e7 ? '₹' + (n / 1e7).toFixed(2) + ' Cr' : '₹' + (n / 1e5).toFixed(1) + ' L' }
    function esc(s: any) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;') }
    function ptsStr(p: any) { return p.map(function (q: any) { return q[0] + ',' + q[1] }).join(' ') }
    
    let toastH: any;
    function toast(m: any) { let t = $('toast'); t.textContent = m; t.classList.add('on'); clearTimeout(toastH); toastH = setTimeout(function () { t.classList.remove('on') }, 2600) }
    function unitPx() { let r = svg.getBoundingClientRect(); return r.width ? v.w / r.width : 1 }
    function toSvg(e: any) { let pt = svg.createSVGPoint(); pt.x = e.clientX; pt.y = e.clientY; let m = svg.getScreenCTM(); if (!m) return { x: 0, y: 0 }; let q = pt.matrixTransform(m.inverse()); return { x: q.x, y: q.y } }
    function clamp(n: any, a: any, b: any) { return Math.max(a, Math.min(b, n)) }
    function copyPlot(p: any) { return { id: p.id, label: p.label, pts: p.pts, status: p.status, agent: p.agent || '', buyer: p.buyer || '', area: p.area || '', value: p.value || '' } }
    function av(name: any) { return name ? '<span class="av">' + esc(initials(name)) + '</span>' : '<span class="av empty0">—</span>' }
    function totals(P: any) {
      let t = { sold: 0, total: P.plots.length, sv: 0, ov: 0, sa: 0, ta: 0, open: 0 };
      P.plots.forEach(function (p: any) { t.ta += p.area || 0; if (p.status === 'sold') { t.sold++; t.sv += p.value || 0; t.sa += p.area || 0 } else { t.open++; t.ov += p.value || 0 } }); return t
    }

    function applyView() { svg.setAttribute('viewBox', v.x.toFixed(1) + ' ' + v.y.toFixed(1) + ' ' + v.w.toFixed(1) + ' ' + v.h.toFixed(1)); renderDraft() }
    function zoom(f: any, cx?: any, cy?: any) {
      let nw = clamp(v.w * f, 110, VW), nh = nw * VH / VW;
      if (cx == null) { cx = v.x + v.w / 2; cy = v.y + v.h / 2 }
      v.x = clamp(cx - (cx - v.x) * (nw / v.w), 0, VW - nw); v.y = clamp(cy - (cy - v.y) * (nh / v.h), 0, VH - nh); v.w = nw; v.h = nh; applyView();
    }
    function fit() { v = { x: 0, y: 0, w: VW, h: VH }; applyView() }
    function focusPlot(p: any) {
      let xs = p.pts.map(function (q: any) { return q[0] }), ys = p.pts.map(function (q: any) { return q[1] });
      let bw = Math.max.apply(null, xs) - Math.min.apply(null, xs), bh = Math.max.apply(null, ys) - Math.min.apply(null, ys);
      let nw = clamp(Math.max(bw * 3.2, bh * 3.2 * VW / VH, 260), 110, VW), nh = nw * VH / VW, c = cen(p.pts);
      v.w = nw; v.h = nh; v.x = clamp(c[0] - nw / 2, 0, VW - nw); v.y = clamp(c[1] - nh / 2, 0, VH - nh); applyView();
    }

    function renderChrome() {
      let P = cur(), t = totals(P), pct = t.total ? Math.round(t.sold / t.total * 100) : 0;
      $('crumb').innerHTML = 'Projects &amp; Clients <span>/</span> <b>Plot Map</b>';
      $('projects').innerHTML = projects.map(function (p: any, i: any) {
        let x = totals(p);
        return '<button type="button" class="ptab' + (i === st.pi ? ' on' : '') + '" data-i="' + i + '" aria-pressed="' + (i === st.pi) + '">' + esc(p.name) + '<i>' + x.sold + '/' + x.total + '</i></button>'
      }).join('') +
        '<button type="button" class="ptab add" data-act="newproj">+ New project</button>';
      let rate = t.sa ? t.sv / t.sa : 0, tv = t.sv + t.ov;
      function st4(l: any, val: any, sub: any) { return '<div class="ost"><span>' + l + '</span><b>' + val + '</b><small>' + sub + '</small></div>' }
      let strip = P.plots.map(function (p: any) { return '<i class="' + (p.status === 'sold' ? 's' : '') + '" data-tick="' + esc(p.id) + '" title="Plot ' + esc(p.label) + ' · ' + (p.status === 'sold' ? 'Sold' : 'Not yet booked') + '"></i>' }).join('');
      $('titlebar').innerHTML =
        '<div class="ov2"><div class="ovL">' +
        '<div class="ovname"><h1>' + esc(P.name) + '</h1><span>' + IC.pin + esc(P.where) + '</span><span>' + t.total + ' plots</span><span>' + (t.ta ? t.ta.toLocaleString('en-IN') + ' sq ft' : 'Area not set') + '</span></div>' +
        '<div class="bignum"><b>' + short(t.sv) + '</b><span>sold of <b>' + short(tv) + '</b> · <b>' + pct + '%</b> of plots</span></div>' +
        '<div class="strip" role="img" aria-label="' + t.sold + ' of ' + t.total + ' plots sold">' + strip + '</div>' +
        '<div class="stripcap"><span>Each bar is one plot</span><span><b>' + t.sold + '</b> sold · <b>' + t.open + '</b> not yet booked</span></div></div>' +
        '<div class="ovR">' +
        st4('Still to sell', short(t.ov), t.open + ' plots open') +
        st4('Area sold', t.sa ? t.sa.toLocaleString('en-IN') + ' sq ft' : '—', t.ta ? 'of ' + t.ta.toLocaleString('en-IN') + ' sq ft' : 'Set the scale') +
        st4('Average rate', rate ? inr(rate) + ' / sq ft' : '—', 'On sold plots') +
        '</div></div>';
    }
    function renderTools() {
      let P = cur(), t = totals(P), ag = st.agent !== 'all' ? agentName(st.agent) : '';
      $('mtools').innerHTML =
        '<div class="seg" role="group" aria-label="Mode"><button type="button" data-act="mview" aria-pressed="' + (st.mode === 'view') + '">' + IC.cursor + 'Select</button><button type="button" data-act="mdraw" aria-pressed="' + (st.mode === 'draw') + '">' + IC.draw + 'Draw plot</button></div>' +
        '<button type="button" class="btn sm" data-act="upload">' + IC.upload + 'Upload layout</button>' +
        '<button type="button" class="btn sm" data-act="scale"' + (st.mode === 'draw' ? ' disabled' : '') + '>' + IC.ruler + (P.k ? 'Scale set' : 'Set scale') + '</button>' +
        '<span class="sp"></span>' +
        (ag ? '<span class="fpill">Agent: ' + esc(ag) + '<button type="button" data-act="clearagent" aria-label="Clear agent filter">×</button></span>' : '') +
        '<button type="button" class="chip" data-k="sold" aria-pressed="' + !st.off.sold + '"><span class="sw sold"></span>Sold <i>' + t.sold + '</i></button>' +
        (P.bg ? '<button type="button" class="chip" data-k="lbl" aria-pressed="' + !!st.labels + '">Plot numbers</button>' : '') +
        '<button type="button" class="chip" data-k="open" aria-pressed="' + !st.off.open + '"><span class="sw"></span>Not yet booked <i>' + t.open + '</i></button>' +
        '<span class="seg" role="group" aria-label="Zoom"><button type="button" data-act="zout" aria-label="Zoom out">−</button><button type="button" data-act="fit">Fit</button><button type="button" data-act="zin" aria-label="Zoom in">+</button></span>';
      let f = $('float'), h = '';
      if (st.mode === 'draw') {
        if (st.pending) h = '<span><b>Plot ' + esc(nextLabel(P)) + '</b> drawn · add its details in the panel</span>';
        else h = '<span><b>Drawing plot ' + esc(nextLabel(P)) + '</b> · click each corner, then click the first point or press Enter · ' + st.draft.length + ' point' + (st.draft.length === 1 ? '' : 's') + '</span>' +
          '<button type="button" class="btn sm" data-act="undo"' + (st.draft.length ? '' : ' disabled') + '>Undo</button>' +
          '<button type="button" class="btn sm pri" data-act="finish"' + (st.draft.length >= 3 ? '' : ' disabled') + '>Finish plot</button>';
      } else if (st.mode === 'scale') {
        h = '<span><b>Set scale</b> · click two points a known distance apart · ' + st.scaleP.length + ' of 2</span><button type="button" class="btn sm" data-act="cancelscale">Cancel</button>';
      }
      f.innerHTML = h; f.hidden = !h;
      $('empty').hidden = !(P.plots.length === 0 && !P.bg && st.mode === 'view');
    }

    function isDim(p: any) {
      if (st.off[p.status]) return true;
      if (st.agent !== 'all' && !(p.status === 'sold' && p.agent === st.agent)) return true;
      if (st.q) { let q = st.q; if (!(p.label.toLowerCase().indexOf(q) >= 0 || (p.buyer || '').toLowerCase().indexOf(q) >= 0 || agentName(p.agent).toLowerCase().indexOf(q) >= 0)) return true }
      return false;
    }
    function renderBase() {
      let P = cur(), h = '', x, pts;
      mapClass();
      let im = $('bgimg');
      if (P.bg) { im.setAttribute('href', P.bg); im.setAttribute('visibility', 'visible') } else { im.removeAttribute('href'); im.setAttribute('visibility', 'hidden') }
      if (!P.bg && P.plots.length) {
        let minx = 1e9, miny = 1e9, maxx = -1e9, maxy = -1e9;
        P.plots.forEach(function (p: any) { p.pts.forEach(function (q: any) { minx = Math.min(minx, q[0]); maxx = Math.max(maxx, q[0]); miny = Math.min(miny, q[1]); maxy = Math.max(maxy, q[1]) }) });
        h += '<rect class="paper" x="' + (minx - 20) + '" y="' + (miny - 20) + '" width="' + (maxx - minx + 40) + '" height="' + (maxy - miny + 40) + '" rx="16"/>';
      }
      if (P.sample && !P.bg) {
        ROADY.forEach(function (ry) {
          pts = []; for (x = -30; x <= 1030; x += 20) { let q = warp(P.warp, x, ry); pts.push(q[0].toFixed(1) + ',' + q[1].toFixed(1)) }
          h += '<polyline class="road" points="' + pts.join(' ') + '"/><polyline class="roadc" points="' + pts.join(' ') + '"/>';
          let a = warp(P.warp, 470, ry), b = warp(P.warp, 530, ry), m = warp(P.warp, 500, ry), ang = Math.atan2(b[1] - a[1], b[0] - a[0]) * 180 / Math.PI;
          h += '<text class="rl" transform="translate(' + m[0].toFixed(1) + ' ' + m[1].toFixed(1) + ') rotate(' + ang.toFixed(1) + ')">20 FT ROAD</text>';
        });
        let g = warp(P.warp, 86, ROADY[0]);
        h += '<g class="gate" transform="translate(' + g[0].toFixed(1) + ' ' + g[1].toFixed(1) + ')"><rect x="-34" y="-10" width="68" height="20" rx="10"/><text>MAIN ENTRY</text></g>';
      }
      if (!P.bg && P.plots.length) {
        let minx = 1e9, miny = 1e9, maxx = -1e9, maxy = -1e9;
        P.plots.forEach(function (p: any) { p.pts.forEach(function (q: any) { minx = Math.min(minx, q[0]); maxx = Math.max(maxx, q[0]); miny = Math.min(miny, q[1]); maxy = Math.max(maxy, q[1]) }) });
        h += '<rect class="bound" x="' + (minx - 20) + '" y="' + (miny - 20) + '" width="' + (maxx - minx + 40) + '" height="' + (maxy - miny + 40) + '" rx="16"/>';
      }
      h += '<g transform="translate(956 722)"><path d="M0 -17 L8 9 L0 3 L-8 9Z" class="na"/><text y="24" class="nt">N</text></g>';
      if (P.k) {
        let ftu = Math.sqrt(P.k), cands = [10, 20, 25, 40, 50, 100, 200, 500], best = 0;
        cands.forEach(function (c) { let L = c / ftu; if (L >= 55 && L <= 190 && !best) best = c });
        if (best) { let L = best / ftu; h += '<g transform="translate(50 744)"><path d="M0 -6V0H' + L.toFixed(1) + 'V-6M' + (L / 2).toFixed(1) + ' 0V-4" class="sb"/><text class="sbt" x="0" y="-11">' + best + ' FT</text></g>' }
      }
      $('base').innerHTML = h;
    }
    function mapClass() { svg.setAttribute('class', 'map' + (cur().bg ? ' hasbg' : '') + (st.mode !== 'view' ? ' drawing' : '') + (st.labels ? ' lbls' : '')) }
    function renderPlots() {
      let P = cur(), h = '';
      P.plots.forEach(function (p: any) {
        let c = cen(p.pts), sold = p.status === 'sold', fs = clamp(Math.sqrt(polyArea(p.pts)) * .2, 6, 16), ag = p.area && fs >= 9 ? Number(p.area).toLocaleString('en-IN') + ' sf' : '';
        h += '<g class="plot ' + (sold ? 'sold' : 'open') + (isDim(p) ? ' dim' : '') + (p.id === st.sel ? ' sel' : '') + '" data-id="' + esc(p.id) + '" tabindex="0" role="button" aria-label="Plot ' + esc(p.label) + ', ' + (sold ? 'sold' : 'not yet booked') + '">' +
          '<polygon points="' + ptsStr(p.pts) + '"/>' +
          '<text class="n" font-size="' + fs.toFixed(1) + '" x="' + c[0].toFixed(1) + '" y="' + (c[1] - (ag ? fs * .45 : 0)).toFixed(1) + '">' + esc(p.label) + '</text>' +
          (ag ? '<text class="a" font-size="' + (fs * .62).toFixed(1) + '" x="' + c[0].toFixed(1) + '" y="' + (c[1] + fs * .72).toFixed(1) + '">' + esc(ag) + '</text>' : '') + '</g>';
      });
      $('plots').innerHTML = h;
    }
    function renderDraft() {
      let h = '', u = unitPx(), pts = st.mode === 'scale' ? st.scaleP : st.draft;
      if (st.pending) h += '<polygon class="pend" points="' + ptsStr(st.pending) + '"/>';
      if (st.mode === 'view') { $('draft').innerHTML = h; return }
      if (!st.pending) {
        let line = pts.slice(); if (st.cursor && pts.length) line.push(st.cursor);
        if (st.mode === 'draw' && pts.length >= 3) h += '<polygon class="drf" points="' + ptsStr(pts) + '"/>';
        if (line.length >= 2) h += '<polyline class="dr" stroke-width="' + (2 * u).toFixed(2) + '" points="' + ptsStr(line) + '"/>';
        pts.forEach(function (q: any) { h += '<circle class="dot" cx="' + q[0] + '" cy="' + q[1] + '" r="' + (4.5 * u).toFixed(2) + '" stroke-width="' + (1.5 * u).toFixed(2) + '"/>' });
        if (st.mode === 'draw' && pts.length >= 3) h += '<circle class="d0" cx="' + pts[0][0] + '" cy="' + pts[0][1] + '" r="' + (10 * u).toFixed(2) + '" stroke-width="' + (2 * u).toFixed(2) + '"/>';
        if (st.cursor && st.snapped) h += '<circle class="snap" cx="' + st.cursor[0] + '" cy="' + st.cursor[1] + '" r="' + (7 * u).toFixed(2) + '" stroke-width="' + (2 * u).toFixed(2) + '"/>';
      }
      $('draft').innerHTML = h;
    }

    function renderPanel() {
      let P = cur(), pn = $('panel'), h = '';
      let t = totals(P), rows = agents.map(function (a: any) { let n = 0, val = 0; P.plots.forEach(function (p: any) { if (p.status === 'sold' && p.agent === a.id) { n++; val += p.value || 0 } }); return { id: a.id, name: a.name, n: n, val: val } });
      let un = 0, unv = 0; P.plots.forEach(function (p: any) { if (p.status === 'sold' && !p.agent) { un++; unv += p.value || 0 } });
      if (un) rows.push({ id: '_', name: 'No agent assigned', n: un, val: unv });
      rows.sort(function (a: any, b: any) { return b.val - a.val }); let mx = rows.length ? Math.max(1, rows[0].val) : 1;
      h = '<div class="ph"><h3>Agents</h3><span class="note">' + t.sold + ' plots sold</span></div>' +
        '<p class="note">Select a plot on the map to see its details, or pick an agent to see only their plots.</p>' +
        rows.map(function (r: any) { return '<button type="button" class="agrow" data-pa="agent" data-id="' + r.id + '" aria-pressed="' + (st.agent === r.id) + '">' + av(r.id === '_' ? '' : r.name) + '<span class="tx"><b>' + esc(r.name) + '</b><small>' + r.n + ' plot' + (r.n === 1 ? '' : 's') + ' sold</small><span class="bar"><i style="width:' + Math.round(r.val / mx * 100) + '%"></i></span></span><span class="v">' + short(r.val) + '</span></button>' }).join('');
      pn.innerHTML = h;
      let d = $('plotdlg'), open = st.panel !== 'overview', was = !d.hidden;
      if (!open) { d.hidden = true; d.innerHTML = ''; return }
      d.hidden = false;
      d.innerHTML = '<div class="dlgbk" ' + ((st.edit || st.panel === 'new') ? '' : 'data-pa="close"') + '></div><div class="dlgcard" role="dialog" aria-modal="true" tabindex="-1" aria-label="Plot details">' + ((st.edit || st.panel === 'new') ? formHtml() : viewHtml()) + '</div>';
      if (!was) { let c = d.querySelector('.dlgcard') as any; if (c) c.focus() }
    }
    function shapeSvg(p: any) {
      let xs = p.pts.map(function (q: any) { return q[0] }), ys = p.pts.map(function (q: any) { return q[1] }), x0 = Math.min.apply(0, xs), x1 = Math.max.apply(0, xs), y0 = Math.min.apply(0, ys), y1 = Math.max.apply(0, ys);
      let w = x1 - x0 || 1, h = y1 - y0 || 1, pd = Math.max(w, h) * .14;
      return '<svg viewBox="' + (x0 - pd).toFixed(1) + ' ' + (y0 - pd).toFixed(1) + ' ' + (w + 2 * pd).toFixed(1) + ' ' + (h + 2 * pd).toFixed(1) + '" preserveAspectRatio="xMidYMid meet" aria-hidden="true"><polygon points="' + ptsStr(p.pts) + '" fill="' + (p.status === 'sold' ? '#C3D7C8' : '#FFFFFF') + '" stroke="#0D3613" stroke-width="' + (Math.max(w, h) * .012).toFixed(2) + '" stroke-linejoin="round"/></svg>';
    }
    let XIC = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>';
    function leftPane(label: any, status: any, pts: any) {
      let L = String(label || '–'), fs = L.length <= 3 ? 104 : L.length <= 5 ? 72 : 48, sold = status === 'sold';
      return '<aside class="dl-left"><div><span class="eyebrow">PLOT</span><div class="pbig" style="font-size:' + fs + 'px">' + esc(L) + '</div></div>' +
        '<div><span class="vbadge' + (sold ? ' sold' : '') + '">' + (sold ? 'Sold' : 'Not yet booked') + '</span><div class="pproj">' + esc(cur().name) + ' · ' + esc(cur().where) + '</div></div>' +
        '<div class="dl-shape">' + shapeSvg({ pts: pts, status: status }) + '</div></aside>';
    }
    function viewHtml() {
      let p = byId(st.sel), rate = p.area && p.value ? p.value / p.area : 0;
      function fact(k: any, v: any, av2?: any) { return '<div class="fact"><span class="eyebrow">' + k + '</span><div class="fv">' + (av2 || '') + '<b>' + v + '</b></div></div>' }
      return leftPane(p.label, p.status, p.pts) +
        '<section class="dl-right"><div class="dl-top"><span class="eyebrow" style="margin:0">PLOT OVERVIEW</span><span class="dl-btns"><button type="button" class="iconbtn" id="p_pencil" data-pa="edit" aria-label="Edit plot" title="Edit plot">' + IC.pencil + '</button><button type="button" class="iconbtn" data-pa="close" aria-label="Close" title="Close">' + XIC + '</button></span></div>' +
        '<div class="dl-hero"><span class="eyebrow">PLOT VALUE</span><b>' + (p.value ? inr(p.value) : '—') + '</b></div>' +
        '<div class="facts">' +
        fact('Area', p.area ? Number(p.area).toLocaleString('en-IN') + ' sq ft' : '—') +
        fact('Rate', rate ? inr(rate) + ' / sq ft' : '—') +
        fact('Agent', p.agent ? esc(agentName(p.agent)) : 'Not assigned', av(p.agent ? agentName(p.agent) : '')) +
        fact('Buyer', p.buyer ? esc(p.buyer) : 'No buyer yet', av(p.buyer)) +
        '</div></section>';
    }
    function agentOpts(sel: any) { return '<option value="">Select agent</option>' + agents.map(function (a: any) { return '<option value="' + a.id + '"' + (sel === a.id ? ' selected' : '') + '>' + esc(a.name) + '</option>' }).join('') }
    function saleHtml(w: any) {
      if (w.status !== 'sold') return '<div class="note" style="grid-column:1/-1">Agent and buyer are added once the plot is booked.</div>';
      return '<div class="f"><label for="p_agent"><span>Booked or sold by</span></label><select id="p_agent">' + agentOpts(w.agent) + '</select><button type="button" class="lnk" data-pa="newagent">+ New agent</button></div>' +
        '<label class="f"><span>Buyer name</span><input type="text" id="p_buyer" value="' + esc(w.buyer) + '" placeholder="Name of the buyer"></label>' +
        '<div class="addag" id="addag" hidden style="grid-column:1/-1"><input type="text" class="in" id="p_agname" placeholder="Agent name" aria-label="New agent name"><button type="button" class="btn" data-pa="addagent">Add</button></div>';
    }
    function formHtml() {
      let P = cur(), w = st.w, sold = w.status === 'sold';
      return leftPane(w.label, w.status, w.pts) +
        '<section class="dl-right"><div class="dl-top"><div><span class="eyebrow">' + (st.isNew ? 'NEW PLOT' : 'EDITING') + '</span><h3 class="dl-h">' + (st.isNew ? 'Add plot details' : 'Edit plot details') + '</h3></div><button type="button" class="iconbtn" data-pa="cancel" aria-label="Cancel" title="Cancel">' + XIC + '</button></div>' +
        '<div class="fgrid"><label class="f"><span>Plot no.</span><input type="text" id="p_label" value="' + esc(w.label) + '"></label>' +
        '<div class="f" role="group" aria-label="Status"><span class="lab">Status</span><div class="sseg"><button type="button" data-s="sold" aria-pressed="' + sold + '">Sold</button><button type="button" data-s="open" aria-pressed="' + !sold + '">Not yet booked</button></div></div>' +
        '<div id="sale">' + saleHtml(w) + '</div>' +
        '<label class="f"><span>Plot value (₹)</span><input type="number" id="p_value" inputmode="numeric" min="0" step="10000" value="' + esc(w.value) + '"><span class="vp" id="p_vp">' + (w.value ? inr(w.value) : '') + '</span></label>' +
        '<label class="f"><span>Area (sq ft)</span><input type="number" id="p_area" inputmode="numeric" min="0" value="' + esc(w.area) + '"><span class="vp">' + (P.k ? 'From the drawing' : 'Set the scale to calculate') + '</span></label></div>' +
        '<div class="err" id="p_err" hidden></div>' +
        '<div class="acts" style="margin-top:auto">' + (st.isNew ? '' : '<button type="button" class="btn danger sm" data-pa="del" id="p_del">Delete plot</button>') + '<span class="sp"></span><button type="button" class="btn" data-pa="cancel">Cancel</button><button type="button" class="btn pri" data-pa="save">Save plot</button></div></section>';
    }

    function selectPlot(id: any, zoomTo?: any) {
      st.sel = id; st.panel = 'plot'; st.edit = false; st.isNew = false; st.w = null; st.pending = null;
      renderPlots(); renderPanel(); renderDraft(); renderTools(); if (zoomTo) focusPlot(byId(id));
    }
    function closePanel() { st.sel = null; st.panel = 'overview'; st.edit = false; st.isNew = false; st.w = null; st.pending = null; renderPlots(); renderPanel(); renderDraft(); renderTools() }
    function beginNew(pts: any) {
      let P = cur();
      st.pending = pts; st.sel = null; st.panel = 'new'; st.isNew = true; st.edit = true;
      st.w = { label: nextLabel(P), pts: pts, status: 'open', agent: '', buyer: '', area: areaFor(P, pts) || '', value: '' };
      renderPlots(); renderPanel(); renderDraft(); renderTools();
      let f = $('p_label'); if (f) { f.focus(); f.select() }
    }
    function savePlot() {
      let P = cur(), w = st.w, err = $('p_err');
      w.label = $('p_label').value.trim();
      if (!w.label) { err.textContent = 'Enter a plot number.'; err.hidden = false; return }
      if (P.plots.some(function (p: any) { return p.label === w.label && p.id !== w.id })) { err.textContent = 'Plot ' + w.label + ' already exists in this project.'; err.hidden = false; return }
      w.value = parseFloat($('p_value').value) || 0; w.area = parseFloat($('p_area').value) || 0;
      if (w.status === 'sold') { w.agent = ($('p_agent') || {}).value || ''; w.buyer = ($('p_buyer') || { value: '' }).value.trim() } else { w.agent = ''; w.buyer = '' }
      let wasNew = st.isNew, p: any;
      if (wasNew) { let n = 0; P.plots.forEach(function (q: any) { let k = parseInt(q.id.split('-').pop(), 10); if (k > n) n = k }); p = { id: P.id + '-' + (n + 1) }; P.plots.push(p) } else p = byId(w.id);
      p.label = w.label; p.pts = w.pts; p.status = w.status; p.agent = w.agent; p.buyer = w.buyer; p.value = w.value; p.area = w.area;
      st.pending = null; save(); renderChrome(); renderBase(); selectPlot(p.id);
      toast(wasNew ? 'Plot ' + p.label + ' saved' + (st.mode === 'draw' ? '. Draw the next plot.' : '') : 'Plot ' + p.label + ' updated');
    }

    const panelClick = function (e: any) {
      let b = e.target.closest('[data-pa],[data-s]'); if (!b) return;
      if (b.hasAttribute('data-s')) {
        st.w.status = b.getAttribute('data-s');
        Array.prototype.forEach.call(b.parentNode.children, function (x: any) { x.setAttribute('aria-pressed', x === b) }); $('sale').innerHTML = saleHtml(st.w); let vb = document.querySelector('.dl-left .vbadge'); if (vb) { vb.className = 'vbadge' + (st.w.status === 'sold' ? ' sold' : ''); vb.textContent = st.w.status === 'sold' ? 'Sold' : 'Not yet booked' } return
      }
      let a = b.getAttribute('data-pa');
      if (a === 'agent') { let id = b.getAttribute('data-id'); st.agent = st.agent === id ? 'all' : id; renderPlots(); renderPanel(); renderTools() }
      else if (a === 'close') closePanel();
      else if (a === 'edit') { let p = byId(st.sel); st.w = copyPlot(p); st.edit = true; renderPanel(); let f = $('p_label'); if (f) { f.focus(); f.select() } }
      else if (a === 'cancel') {
        if (st.isNew) { closePanel() } else { st.edit = false; st.w = null; renderPanel(); let pe = $('p_pencil'); if (pe) pe.focus() }
      }
      else if (a === 'save') savePlot();
      else if (a === 'newagent') { $('addag').hidden = false; $('p_agname').focus() }
      else if (a === 'addagent') {
        let nm = $('p_agname').value.trim(); if (!nm) return; let mx = 0; agents.forEach(function (g: any) { let q = parseInt(g.id.slice(1), 10); if (q > mx) mx = q });
        let g = { id: 'a' + (mx + 1), name: nm }; agents.push(g); st.w.agent = g.id; let by = $('p_buyer'); if (by) st.w.buyer = by.value; $('sale').innerHTML = saleHtml(st.w); save(); toast(nm + ' added as an agent')
      }
      else if (a === 'del') {
        if (!st.confirm.del) { st.confirm.del = 1; b.textContent = 'Tap again to delete'; setTimeout(function () { st.confirm.del = 0; if ($('p_del')) $('p_del').textContent = 'Delete plot' }, 3000); return }
        st.confirm.del = 0; let Pr = cur(); Pr.plots = Pr.plots.filter(function (q: any) { return q.id !== st.w.id }); save(); renderChrome(); renderBase(); closePanel(); toast('Plot deleted')
      }
    };
    $('panel').addEventListener('click', panelClick);
    $('plotdlg').addEventListener('click', panelClick);

    const panelInput = function (e: any) {
      if (!st.w) return;
      if (e.target.id === 'p_label') { let pb = document.querySelector('.dl-left .pbig') as any; if (pb) { let L = e.target.value.trim() || '–'; pb.textContent = L; pb.style.fontSize = (L.length <= 3 ? 104 : L.length <= 5 ? 72 : 48) + 'px' } }
      if (e.target.id === 'p_value') { st.w.value = parseFloat(e.target.value) || 0; $('p_vp').textContent = st.w.value ? inr(st.w.value) : '' }
    };
    $('panel').addEventListener('input', panelInput);
    $('plotdlg').addEventListener('input', panelInput);

    const panelChange = function (e: any) { if (st.w && e.target.id === 'p_agent') st.w.agent = e.target.value };
    $('panel').addEventListener('change', panelChange);
    $('plotdlg').addEventListener('change', panelChange);

    const panelKeydown = function (e: any) {
      if (e.key === 'Enter' && e.target.tagName === 'INPUT' && st.w) {
        e.preventDefault();
        if (e.target.id === 'p_agname') $('plotdlg').querySelector('[data-pa=addagent]').click(); else savePlot()
      }
    };
    $('panel').addEventListener('keydown', panelKeydown);
    $('plotdlg').addEventListener('keydown', panelKeydown);

    function openModal(html: any, focusId?: any) {
      let m = $('modal'); m.innerHTML = '<div class="box" role="dialog" aria-modal="true">' + html + '</div>'; m.hidden = false;
      if (focusId) { let f = $(focusId); if (f) { f.focus(); if (f.select) f.select() } }
    }
    function closeModal() { $('modal').hidden = true; $('modal').innerHTML = ''; st.modal = null }
    function head(title: any, sub: any) { return '<div class="mhead"><div><h2>' + esc(title) + '</h2><div class="msub">' + sub + '</div></div><button type="button" class="x" data-m="close" aria-label="Close">×</button></div>' }
    
    $('modal').addEventListener('click', function (e: any) {
      if (e.target.id === 'modal') { closeModal(); return }
      let b = e.target.closest('[data-m]'); if (!b || !st.modal) return;
      let m = st.modal, k = b.getAttribute('data-m');
      if (k === 'close') { if (m.type === 'scale') setMode('view'); closeModal(); return }
      if (m.type === 'scale' && k === 'save') {
        let d = parseFloat($('s_dist').value); if (!(d > 0)) { $('s_err').hidden = false; return }
        let ft = $('s_unit').value === 'm' ? d * 3.28084 : d, du = Math.hypot(st.scaleP[0][0] - st.scaleP[1][0], st.scaleP[0][1] - st.scaleP[1][1]);
        if (du < 1) { $('s_err').textContent = 'The two points are too close. Pick points further apart.'; $('s_err').hidden = false; return }
        cur().k = Math.pow(ft / du, 2); setMode('view'); closeModal(); save(); renderAll(); toast('Scale saved. New plots get their area automatically.')
      }
      else if (m.type === 'dxf' && k === 'import') importDxf();
      else if (m.type === 'newproj' && k === 'create') {
        let nm = $('np_name').value.trim(); if (!nm) { $('np_err').hidden = false; return }
        projects.push({ id: 'n' + Date.now(), name: nm, where: $('np_where').value.trim() || 'Location not set', k: null, bg: null, sample: false, warp: { amp: 0, freq: 1, ph: 0, shear: 0 }, plots: [] });
        st.pi = projects.length - 1; resetUi(); closeModal(); fit(); save(); renderAll(); toast('Project created. Upload its layout to begin.')
      }
    });
    $('modal').addEventListener('change', function (e: any) { let m = st.modal; if (m && m.type === 'dxf' && e.target.id === 'x_unit') { m.unit = e.target.value; $('x_info').innerHTML = dxfInfo(m) } });
    $('modal').addEventListener('keydown', function (e: any) {
      if (e.key === 'Enter' && e.target.tagName === 'INPUT' && st.modal) { e.preventDefault(); let b = $('modal').querySelector('[data-m=save],[data-m=create]') as any; if (b) b.click() }
    });

    function snapPt(p: any) {
      let R = 12 * unitPx(), best: any = null, bd = R;
      function test(q: any) { let d = Math.hypot(q[0] - p.x, q[1] - p.y); if (d < bd) { bd = d; best = q } }
      cur().plots.forEach(function (pl: any) { pl.pts.forEach(test) }); st.draft.forEach(test);
      if (best) { st.snapped = true; return [best[0], best[1]] }
      st.snapped = false; return [Math.round(p.x * 10) / 10, Math.round(p.y * 10) / 10];
    }
    let down: any = null, tip = $('tip');
    function showTip(e: any, g: any) {
      let p = byId(g.getAttribute('data-id')); if (!p) { tip.hidden = true; return }
      tip.innerHTML = '<b>Plot ' + esc(p.label) + '</b> · ' + (p.status === 'sold' ? 'Sold' : 'Not yet booked') + '<div>' + (p.value ? inr(p.value) : 'No value yet') + (p.agent ? ' · ' + esc(agentName(p.agent)) : '') + '</div>' + (p.status === 'sold' && p.buyer ? '<div>Buyer: ' + esc(p.buyer) + '</div>' : '');
      tip.hidden = false; tip.style.left = Math.min(e.clientX + 14, window.innerWidth - 250) + 'px'; tip.style.top = (e.clientY + 16) + 'px';
    }
    
    svg.addEventListener('pointerdown', function (e: any) { if (e.button !== 0) return; down = { x: e.clientX, y: e.clientY, vx: v.x, vy: v.y, moved: false }; tip.hidden = true });
    svg.addEventListener('pointerleave', function () { tip.hidden = true });
    window.addEventListener('pointermove', function (e: any) {
      if (down) {
        let dx = e.clientX - down.x, dy = e.clientY - down.y;
        if (!down.moved && Math.hypot(dx, dy) > 6 && (e.pointerType !== 'touch' || st.mode !== 'view')) down.moved = true;
        if (down.moved) { let u = unitPx(); v.x = clamp(down.vx - dx * u, 0, VW - v.w); v.y = clamp(down.vy - dy * u, 0, VH - v.h); applyView() }
        return;
      }
      if (!svg.contains(e.target)) { tip.hidden = true; return }
      if (st.mode === 'view') { let g = e.target.closest && e.target.closest('.plot'); if (g && e.pointerType !== 'touch') showTip(e, g); else tip.hidden = true }
      else if (!st.pending) { st.cursor = snapPt(toSvg(e)); renderDraft() }
    }, { signal });
    window.addEventListener('pointerup', function (e: any) {
      if (!down) return; let d = down; down = null;
      if (d.moved || !svg.contains(e.target)) return;
      if (st.mode === 'draw') {
        if (st.pending) { toast('Save or cancel the new plot first.'); return }
        let p = snapPt(toSvg(e));
        if (st.draft.length >= 3 && Math.hypot(p[0] - st.draft[0][0], p[1] - st.draft[0][1]) < 12 * unitPx()) { finishDraw(); return }
        st.draft.push(p); st.cursor = null; renderDraft(); renderTools();
      } else if (st.mode === 'scale') {
        st.scaleP.push(snapPt(toSvg(e))); st.cursor = null; renderDraft(); renderTools();
        if (st.scaleP.length === 2) {
          st.modal = { type: 'scale' };
          openModal(head('Set scale', 'Enter the real distance between the two points') +
            '<div class="mbody"><div class="two"><label class="f"><span>Distance</span><input type="number" id="s_dist" min="0" step="any" inputmode="decimal"></label>' +
            '<label class="f"><span>Unit</span><select id="s_unit"><option value="ft">Feet</option><option value="m">Metres</option></select></label></div>' +
            '<div class="err" id="s_err" hidden>Enter a distance greater than zero.</div></div>' +
            '<div class="mfoot"><span class="sp"></span><button type="button" class="btn" data-m="close">Cancel</button><button type="button" class="btn pri" data-m="save">Save scale</button></div>', 's_dist');
        }
      } else {
        let g = e.target.closest && e.target.closest('.plot'); if (g) selectPlot(g.getAttribute('data-id'));
      }
    }, { signal });
    window.addEventListener('pointercancel', function () { down = null }, { signal });
    svg.addEventListener('keydown', function (e: any) {
      if ((e.key === 'Enter' || e.key === ' ') && st.mode === 'view') { let g = e.target.closest('.plot'); if (g) { e.preventDefault(); selectPlot(g.getAttribute('data-id')) } }
    });
    svg.addEventListener('wheel', function (e: any) { if (!(e.ctrlKey || e.metaKey)) return; e.preventDefault(); let p = toSvg(e); zoom(e.deltaY > 0 ? 1.2 : 1 / 1.2, p.x, p.y) }, { passive: false });
    
    function finishDraw() {
      if (st.draft.length < 3) { toast('Click at least three corners.'); return }
      let pts = st.draft.slice(); st.draft = []; st.cursor = null; beginNew(pts);
    }
    function setMode(m: any) {
      st.mode = m; st.draft = []; st.scaleP = []; st.cursor = null; st.snapped = false;
      if (m !== 'draw' && st.pending) { st.pending = null; if (st.panel === 'new') closePanel() }
      mapClass(); renderDraft(); renderTools();
    }
    $('titlebar').addEventListener('click', function (e: any) { let t = e.target.closest('[data-tick]'); if (t) selectPlot(t.getAttribute('data-tick'), true) });
    document.addEventListener('keydown', function (e: any) {
      if (!$('modal').hidden) { if (e.key === 'Escape') { if (st.modal && st.modal.type === 'scale') setMode('view'); closeModal() } return }
      let tag = (e.target.tagName || '').toLowerCase(); if (tag === 'input' || tag === 'select' || tag === 'textarea') return;
      if (st.mode === 'draw' && !st.pending) {
        if (e.key === 'Enter') { e.preventDefault(); finishDraw() }
        else if (e.key === 'Backspace') { e.preventDefault(); st.draft.pop(); renderDraft(); renderTools() }
        else if (e.key === 'Escape') { if (st.draft.length) { st.draft = []; renderDraft(); renderTools() } else setMode('view') }
      } else if (st.mode === 'scale' && e.key === 'Escape') setMode('view');
      else if (e.key === 'Escape' && st.panel === 'plot' && !st.edit) closePanel();
    }, { signal });

    function resetUi() { st.sel = null; st.panel = 'overview'; st.edit = false; st.isNew = false; st.w = null; st.pending = null; st.off = {}; st.agent = 'all'; st.q = ''; $('q').value = ''; setMode('view') }
    function renderAll() { renderChrome(); renderBase(); renderPlots(); renderTools(); renderPanel(); applyView() }
    
    document.addEventListener('click', function (e: any) {
      let pc = e.target.closest('.ptab[data-i]');
      if (pc) { let i = +pc.getAttribute('data-i'); if (i !== st.pi) { st.pi = i; resetUi(); fit(); renderAll() } return }
      let b = e.target.closest('[data-act]');
      if (b) {
        let a = b.getAttribute('data-act');
        if (a === 'upload') $('file').click();
        else if (a === 'mview') setMode('view');
        else if (a === 'mdraw' || a === 'draw') { if (st.mode !== 'draw') { setMode('draw'); toast('Click each corner of the plot. The details panel opens when you close the shape.') } else if (a === 'mdraw') setMode('draw') }
        else if (a === 'undo') { st.draft.pop(); renderDraft(); renderTools() }
        else if (a === 'finish') finishDraw();
        else if (a === 'scale') setMode('scale');
        else if (a === 'cancelscale') setMode('view');
        else if (a === 'clearagent') { st.agent = 'all'; renderPlots(); renderTools(); renderPanel() }
        else if (a === 'zin') zoom(1 / 1.4); else if (a === 'zout') zoom(1.4); else if (a === 'fit') fit();
        else if (a === 'newproj') {
          st.modal = { type: 'newproj' }; openModal(head('New project', 'Create it, then upload its layout') +
            '<div class="mbody"><label class="f"><span>Project name</span><input type="text" id="np_name" placeholder="e.g. Green Valley Phase 2"></label>' +
            '<label class="f"><span>Location</span><input type="text" id="np_where" placeholder="e.g. Hoskote"></label><div class="err" id="np_err" hidden>Enter a project name.</div></div>' +
            '<div class="mfoot"><span class="sp"></span><button type="button" class="btn" data-m="close">Cancel</button><button type="button" class="btn pri" data-m="create">Create project</button></div>', 'np_name')
        }
        else if (a === 'reset') {
          if (!st.confirm.reset) { st.confirm.reset = 1; b.textContent = 'Tap again to reset'; setTimeout(function () { st.confirm.reset = 0; b.textContent = 'Reset demo' }, 3000); return }
          st.confirm.reset = 0; b.textContent = 'Reset demo'; try { localStorage.removeItem(KEY) } catch (x) { }
          agents = freshAgents(); projects = freshProjects(); st.pi = 0; resetUi(); fit(); renderAll(); toast('Demo data restored')
        }
        return;
      }
      let c = e.target.closest('.chip[data-k]'); if (c) { let k = c.getAttribute('data-k'); if (k === 'lbl') { st.labels = !st.labels; mapClass(); renderTools(); return } st.off[k] = !st.off[k]; renderPlots(); renderTools() }
    }, { signal });

    $('q').addEventListener('input', function (e: any) { st.q = e.target.value.trim().toLowerCase(); renderPlots() });
    $('q').addEventListener('keydown', function (e: any) {
      if (e.key !== 'Enter') return; e.preventDefault();
      let m = cur().plots.filter(function (p: any) { return !isDim(p) });
      if (m.length) { selectPlot(m[0].id, true); toast(m.length > 1 ? m.length + ' plots match. Showing the first.' : 'Plot ' + m[0].label) } else toast('No plot matches that search.');
    });

    $('file').addEventListener('change', function (e: any) {
      let f = e.target.files && e.target.files[0]; e.target.value = ''; if (!f) return;
      let n = f.name.toLowerCase(), r = new FileReader();
      if (/\.dxf$/.test(n)) { r.onload = function () { readDxf(String(r.result), f.name) }; r.readAsText(f) }
      else if (/\.pdf$/.test(n) || f.type === 'application/pdf') { r.onload = function () { readPdf(r.result) }; r.readAsArrayBuffer(f) }
      else if (/\.dwg$/.test(n)) toast('DWG files must be saved as DXF first (in AutoCAD: Save As, DXF).');
      else if (/^image\//.test(f.type) || /\.(png|jpe?g|webp)$/.test(n)) { r.onload = function () { readImage(String(r.result)) }; r.readAsDataURL(f) }
      else toast('Upload an image, a PDF or a DXF file.');
    });

    function setBg(url: any) { cur().bg = url; save(); renderAll(); toast('Layout added. Set the scale, then draw the plots.') }
    function readImage(src: any) {
      let im = new Image();
      im.onload = function () {
        let s = Math.min(1, 1800 / Math.max(im.width, im.height)), c = document.createElement('canvas');
        c.width = Math.round(im.width * s); c.height = Math.round(im.height * s); 
        let x = c.getContext('2d') as CanvasRenderingContext2D; 
        x.fillStyle = '#fff'; x.fillRect(0, 0, c.width, c.height); x.drawImage(im, 0, 0, c.width, c.height);
        setBg(c.toDataURL('image/jpeg', .85))
      };
      im.onerror = function () { toast('That image could not be read.') }; im.src = src;
    }
    function loadPdfJs(cb: any) {
      if ((window as any).pdfjsLib) { cb(true); return }
      let s = document.createElement('script'); s.src = PDFJS + 'pdf.min.js';
      s.onload = function () { try { (window as any).pdfjsLib.GlobalWorkerOptions.workerSrc = PDFJS + 'pdf.worker.min.js'; cb(true) } catch (x) { cb(false) } };
      s.onerror = function () { cb(false) }; document.head.appendChild(s);
    }
    function readPdf(buf: any) {
      toast('Reading the PDF…');
      loadPdfJs(function (ok: any) {
        if (!ok) { toast('The PDF reader could not load. Save the layout as an image and upload that instead.'); return }
        (window as any).pdfjsLib.getDocument({ data: buf }).promise.then(function (pdf: any) { return pdf.getPage(1) }).then(function (page: any) {
          let vp1 = page.getViewport({ scale: 1 }), s = 1800 / Math.max(vp1.width, vp1.height), vp = page.getViewport({ scale: s }), c = document.createElement('canvas');
          c.width = Math.round(vp.width); c.height = Math.round(vp.height); 
          let x = c.getContext('2d') as CanvasRenderingContext2D; 
          x.fillStyle = '#fff'; x.fillRect(0, 0, c.width, c.height);
          return page.render({ canvasContext: x, viewport: vp }).promise.then(function () { setBg(c.toDataURL('image/jpeg', .85)) });
        }).catch(function () { toast('That PDF could not be read. Save the layout as an image and upload that instead.') });
      });
    }

    function parseDxf(text: any) {
      let L = text.split(/\r?\n/), pr: any = [], i, units: any = null, polys: any = [], texts: any = [], sec = '', ent: any = null, poly: any = null;
      for (i = 0; i + 1 < L.length; i += 2) pr.push([parseInt(L[i].trim(), 10), L[i + 1].trim()]);
      function addPoly(pts: any, flags: any) {
        pts = pts.filter(function (q: any) { return isFinite(q[0]) && isFinite(q[1]) });
        if (pts.length > 1) { let a = pts[0], b = pts[pts.length - 1]; if (Math.hypot(a[0] - b[0], a[1] - b[1]) < 1e-9 * Math.max(1, Math.abs(a[0]) + Math.abs(a[1]))) { pts = pts.slice(0, -1); flags |= 1 } }
        if ((flags & 1) && pts.length >= 3) polys.push(pts);
      }
      function fin() {
        if (!ent) return;
        if (ent.t === 'LWPOLYLINE') addPoly(ent.pts, ent.flags);
        else if ((ent.t === 'TEXT' || ent.t === 'MTEXT') && ent.s != null && ent.x != null) texts.push({ x: ent.x, y: ent.y, s: ent.s.replace(/\\[A-Za-z][^;]*;/g, '').replace(/[{}]/g, '').replace(/\\P/g, ' ').trim() });
        ent = null
      }
      for (i = 0; i < pr.length; i++) {
        let c = pr[i][0], val = pr[i][1];
        if (c === 9 && val === '$INSUNITS' && pr[i + 1] && pr[i + 1][0] === 70) units = parseInt(pr[i + 1][1], 10);
        if (c === 0 && val === 'SECTION' && pr[i + 1] && pr[i + 1][0] === 2) sec = pr[i + 1][1];
        if (c === 0 && val === 'ENDSEC') { fin(); sec = ''; continue }
        if (sec !== 'ENTITIES') continue;
        if (c === 0) {
          if (val === 'VERTEX') { fin(); ent = { t: 'VERTEX' }; if (poly) poly.pts.push([NaN, NaN]); continue }
          if (val === 'SEQEND') { fin(); if (poly) { addPoly(poly.pts, poly.flags); poly = null } continue }
          fin();
          if (val === 'POLYLINE') { poly = { pts: [], flags: 0 }; ent = { t: 'POLYLINE' } } else ent = { t: val, pts: [], flags: 0 };
          continue;
        }
        if (!ent) continue;
        if (ent.t === 'LWPOLYLINE') {
          if (c === 70) ent.flags = parseInt(val, 10) || 0;
          else if (c === 10) ent.pts.push([parseFloat(val), NaN]);
          else if (c === 20 && ent.pts.length) ent.pts[ent.pts.length - 1][1] = parseFloat(val);
        } else if (ent.t === 'POLYLINE') { if (c === 70 && poly) poly.flags = parseInt(val, 10) || 0 }
        else if (ent.t === 'VERTEX' && poly && poly.pts.length) { let q = poly.pts[poly.pts.length - 1]; if (c === 10) q[0] = parseFloat(val); else if (c === 20) q[1] = parseFloat(val) }
        else if (ent.t === 'TEXT' || ent.t === 'MTEXT') { if (c === 10) ent.x = parseFloat(val); else if (c === 20) ent.y = parseFloat(val); else if (c === 1) ent.s = val }
      }
      fin(); return { polys: polys, texts: texts, units: units };
    }
    const UNITS: any = { ft: { n: 'Feet', f: 1 }, m: { n: 'Metres', f: 3.28084 }, mm: { n: 'Millimetres', f: .00328084 }, cm: { n: 'Centimetres', f: .0328084 }, 'in': { n: 'Inches', f: 1 / 12 } };
    function guessUnit(ins: any, medArea: any) {
      if (ins === 1) return 'in'; if (ins === 2) return 'ft'; if (ins === 4) return 'mm'; if (ins === 5) return 'cm'; if (ins === 6) return 'm';
      if (medArea > 40000) return 'mm'; if (medArea >= 250) return 'ft'; if (medArea >= 12) return 'm'; return 'ft';
    }
    function inside(pt: any, poly: any) {
      let c = false; for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
        let a = poly[i], b = poly[j]; if ((a[1] > pt[1]) !== (b[1] > pt[1]) && pt[0] < (b[0] - a[0]) * (pt[1] - a[1]) / (b[1] - a[1]) + a[0]) c = !c
      } return c
    }
    function readDxf(text: any, name: any) {
      let d: any; try { d = parseDxf(text) } catch (x) { d = null }
      if (!d || !d.polys.length) { toast('No closed shapes found. Each plot must be a closed polyline in the DXF.'); return }
      let areas = d.polys.map(polyArea).filter(function (a: any) { return a > 0 }).sort(function (a: any, b: any) { return a - b }), med = areas[Math.floor(areas.length / 2)];
      let keep = d.polys.filter(function (p: any) { let a = polyArea(p); return a >= med / 8 && a <= med * 8 });
      if (keep.length < 2) { toast('Could not find plot-sized shapes in this DXF.'); return }
      st.modal = { type: 'dxf', name: name, keep: keep, all: d.polys.length, texts: d.texts, unit: guessUnit(d.units, polyArea(keep[Math.floor(keep.length / 2)])) };
      let P = cur();
      openModal(head('Import DXF', esc(name)) +
        '<div class="mbody"><div class="kv"><span>Closed shapes in the file</span><b>' + d.polys.length + '</b></div>' +
        '<div class="kv"><span>Shapes that look like plots</span><b>' + keep.length + '</b></div>' +
        '<label class="f"><span>Drawing units</span><select id="x_unit">' + Object.keys(UNITS).map(function (k) { return '<option value="' + k + '"' + (st.modal.unit === k ? ' selected' : '') + '>' + UNITS[k].n + '</option>' }).join('') + '</select></label>' +
        '<div class="note" id="x_info">' + dxfInfo(st.modal) + '</div>' +
        (P.plots.length ? '<div class="err">This replaces the ' + P.plots.length + ' plots already in ' + esc(P.name) + '.</div>' : '') + '</div>' +
        '<div class="mfoot"><span class="sp"></span><button type="button" class="btn" data-m="close">Cancel</button><button type="button" class="btn pri" data-m="import">Import ' + keep.length + ' plots</button></div>');
    }
    function dxfInfo(m: any) {
      let a = m.keep.map(polyArea).sort(function (x: any, y: any) { return x - y }), med = a[Math.floor(a.length / 2)], ft = UNITS[m.unit].f;
      return 'A typical plot comes to about <b>' + (Math.round(med * ft * ft / 10) * 10).toLocaleString('en-IN') + ' sq ft</b> in these units. If that looks wrong, change the unit.';
    }
    function importDxf() {
      let m = st.modal, P = cur(), keep = m.keep, minx = 1e18, miny = 1e18, maxx = -1e18, maxy = -1e18;
      keep.forEach(function (p: any) { p.forEach(function (q: any) { minx = Math.min(minx, q[0]); maxx = Math.max(maxx, q[0]); miny = Math.min(miny, q[1]); maxy = Math.max(maxy, q[1]) }) });
      let pad = 46, sc = Math.min((VW - 2 * pad) / (maxx - minx || 1), (VH - 2 * pad - 30) / (maxy - miny || 1)), ox = pad + ((VW - 2 * pad) - (maxx - minx) * sc) / 2, oy = pad + ((VH - 2 * pad - 30) - (maxy - miny) * sc) / 2;
      let shapes = keep.map(function (p: any) {
        let c = cen(p), lab = '';
        for (let i = 0; i < m.texts.length; i++) { let t = m.texts[i]; if (/^[A-Za-z]?\d{1,4}[A-Za-z]?$/.test(t.s) && inside([t.x, t.y], p)) { lab = t.s; break } }
        return { raw: p, cx: c[0], cy: c[1], label: lab, pts: p.map(function (q: any) { return [Math.round((ox + (q[0] - minx) * sc) * 10) / 10, Math.round((oy + (maxy - q[1]) * sc) * 10) / 10] }) };
      });
      let labelled = shapes.filter(function (s: any) { return s.label }).length;
      if (labelled < shapes.length * .5) shapes.forEach(function (s: any) { s.label = '' });
      let order = shapes.slice().sort(function (a: any, b: any) { return b.cy - a.cy }), rows: any = [], hs = shapes.map(function (s: any) { return Math.sqrt(polyArea(s.raw)) }).sort(function (a: any, b: any) { return a - b }), th = hs[Math.floor(hs.length / 2)] * .6;
      order.forEach(function (s: any) { let r = rows[rows.length - 1]; if (r && Math.abs(r.y - s.cy) < th) r.items.push(s); else rows.push({ y: s.cy, items: [s] }) });
      let seq: any = []; rows.forEach(function (r: any) { r.items.sort(function (a: any, b: any) { return a.cx - b.cx }).forEach(function (s: any) { seq.push(s) }) });
      let mx = 0; shapes.forEach(function (s: any) { let n = parseInt(s.label, 10); if (n > mx) mx = n });
      let ft = UNITS[m.unit].f, useLabels = labelled >= shapes.length * .5, next = mx;
      P.plots = seq.map(function (s: any, i: any) {
        let label = useLabels ? (s.label || String(++next)) : String(i + 1);
        return { id: P.id + '-' + (i + 1), label: label, pts: s.pts, status: 'open', agent: '', buyer: '', area: Math.round(polyArea(s.raw) * ft * ft / 10) * 10, value: 0 };
      });
      P.k = ft * ft / (sc * sc); P.sample = false;
      closeModal(); resetUi(); fit(); save(); renderAll(); toast(P.plots.length + ' plots imported. Open any plot to add its status, agent and value.');
    }

    renderAll();
    window.addEventListener('resize', renderDraft, { signal });

    return () => {
      abortController.abort();
    };
  }, []);

  return (
    <div className="plotmap-wrapper">
      <div className="app">
        <div className="main">
          <header className="top">
            <div className="crumb" id="crumb"></div>
            <div className="top-r">
              <label className="search" htmlFor="q">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" />
                </svg>
                <input id="q" type="search" placeholder="Search plot, buyer or agent" autoComplete="off" />
              </label>
              <button type="button" className="btn pri" data-act="newproj">+ New project</button>
            </div>
          </header>

          <section className="projects" id="projects" aria-label="Projects"></section>
          <section className="titlebar" id="titlebar"></section>

          <div className="stage">
            <section className="mapcard">
              <div className="mtools" id="mtools"></div>
              <div className="mapbox" id="mapbox">
                <svg className="map" id="map" viewBox="0 0 1000 760" role="group" aria-label="Plot layout">
                  <rect className="outside" width="1000" height="760" />
                  <image id="bgimg" x="0" y="0" width="1000" height="760" preserveAspectRatio="xMidYMid meet" opacity=".8" visibility="hidden" />
                  <g id="base"></g>
                  <g id="plots"></g>
                  <g id="draft" style={{ pointerEvents: 'none' }}></g>
                </svg>
                <div className="float" id="float" hidden></div>
                <div className="empty" id="empty" hidden></div>
              </div>
              <div className="mfoot2">
                <span>Hold Ctrl and scroll to zoom · drag to pan</span>
                <button type="button" class="linkbtn" data-act="reset" id="btnReset">Reset demo</button>
              </div>
            </section>
            <aside className="panel" id="panel" aria-live="polite"></aside>
          </div>
        </div>
      </div>

      <div className="dlg" id="plotdlg" hidden></div>
      <div className="ov" id="modal" hidden></div>
      <div className="tip" id="tip" hidden></div>
      <div className="toast" id="toast" role="status"></div>
      <input type="file" id="file" accept=".png,.jpg,.jpeg,.webp,.pdf,.dxf,image/*,application/pdf" hidden />
    </div>
  );
};