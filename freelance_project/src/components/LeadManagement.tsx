import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import toast from 'react-hot-toast';
import './LeadManagement.css';
import { 
  Users, TrendingUp, Clock, Target, Plus, Check, X, Phone, 
  Mail, MessageSquare, FileText
} from 'lucide-react';

const STAGES = ['New', 'Contacted', 'Interested', 'Site Visit', 'Negotiation', 'Won', 'Lost'];
const COL: any = { 'New': '#64748B', 'Contacted': '#2563EB', 'Interested': '#7C3AED', 'Site Visit': '#D97706', 'Negotiation': '#EA580C', 'Won': '#15803D', 'Lost': '#B91C1C' };
const SRC = ['Website', 'Referral', 'Walk-in', 'Ads', 'Import'];
const LOSS = ['Price', 'Not interested', 'Chose competitor', 'No response'];
const TABS = ['Pipeline', 'All leads'];

const dd = (n: number) => {
  const x = new Date();
  x.setDate(x.getDate() + n);
  return x.toISOString().slice(0, 10);
};

const TODAY = dd(0);

const mk = (name: string, phone: string, source: string, project: string, budget: number, stage: string, fu: number, who: string, city: string) => ({
  id: Math.floor(Math.random() * 100000),
  name, phone, email: name.split(' ')[0].toLowerCase() + '@example.com', city, source, project, budget, stage, fu: dd(fu), who, conv: false, loss: stage === 'Lost' ? 'Price' : '',
  tl: [{ t: 'Lead added', w: 'Source: ' + source, i: 'plus' }]
});

const seed = () => [
  mk('Rahul Mehta', '9810011101', 'Website', 'Green Villas', 45, 'New', 1, 'Neha Sharma', 'Bengaluru'),
  mk('Anita Rao', '9810011102', 'Ads', 'Skyline 2BHK', 62, 'New', 0, 'Arun Nair', 'Mysuru'),
  mk('Imran Khan', '9810011103', 'Walk-in', 'Green Villas', 55, 'New', 3, 'Neha Sharma', 'Bengaluru'),
  mk('Suresh Kumar', '9810011104', 'Referral', 'Green Villas', 50, 'Contacted', -2, 'Arun Nair', 'Hosur'),
  mk('Priya Nair', '9810011106', 'Referral', 'Skyline 3BHK', 85, 'Interested', 0, 'Neha Sharma', 'Bengaluru'),
  mk('Meena Joshi', '9810011109', 'Website', 'Skyline 2BHK', 58, 'Negotiation', 1, 'Arun Nair', 'Bengaluru'),
  mk('Arjun Patel', '9810011110', 'Referral', 'Skyline 3BHK', 88, 'Won', 5, 'Neha Sharma', 'Ahmedabad'),
];

export const LeadManagement = () => {
  const [leads, setLeads] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem('lm_demo_v3');
      return saved ? JSON.parse(saved) : seed();
    } catch (e) { return seed(); }
  });

  const [tab, setTab] = useState('Pipeline');
  const [q, setQ] = useState('');
  const [fsrc, setFsrc] = useState('');
  const [fown, setFown] = useState('');
  const [sel, setSel] = useState<number | null>(null);
  const [dtab, setDtab] = useState('Overview');
  const [modal, setModal] = useState<string | null>(null);
  
  const [newLead, setNewLead] = useState({ name: '', phone: '', source: 'Website', project: '', budget: '', who: 'Neha Sharma' });
  const [lossReason, setLossReason] = useState(LOSS[0]);
  const [noteTxt, setNoteTxt] = useState('');

  useEffect(() => {
    localStorage.setItem('lm_demo_v3', JSON.stringify(leads));
  }, [leads]);

  const fv = (v: number) => v >= 100 ? `₹${(v / 100).toFixed(2).replace(/\.?0+$/, '')} Cr` : `₹${v} L`;
  const ini = (n: string) => n.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  const fd = (s: string) => s ? new Date(s + 'T00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : 'Not set';
  
  const owners = [...new Set(leads.map(l => l.who))];
  const activeLead = leads.find(l => l.id === sel);

  // Active Lead Progress bar Logic
  const flow = STAGES.filter(s => s !== 'Lost');
  const ci = activeLead ? flow.indexOf(activeLead.stage) : -1;

  const logEvent = (id: number, title: string, subtitle: string, icon: string) => {
    setLeads(prev => prev.map(l => {
      if (l.id === id) {
        return { ...l, tl: [{ t: title, w: subtitle || new Date().toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }), i: icon }, ...l.tl] };
      }
      return l;
    }));
  };

  const updateLead = (id: number, field: string, value: any) => {
    setLeads(prev => prev.map(l => l.id === id ? { ...l, [field]: value } : l));
    toast.success('Saved');
  };

  const moveLead = (id: number, stage: string) => {
    const l = leads.find(x => x.id === id);
    if (!l || l.stage === stage) return;
    if (stage === 'Lost') {
      setSel(id);
      setModal('lost');
      return;
    }
    setLeads(prev => prev.map(x => x.id === id ? { ...x, stage, loss: '' } : x));
    logEvent(id, 'Moved to ' + stage, '', 'swap');
    toast.success(`${l.name} moved to ${stage}`);
  };

  const handleDrop = (e: React.DragEvent, stage: string) => {
    e.preventDefault();
    const id = parseInt(e.dataTransfer.getData('leadId'));
    moveLead(id, stage);
  };

  const filtered = leads.filter(l => 
    (!fsrc || l.source === fsrc) && 
    (!fown || l.who === fown) && 
    (!q || (l.name + l.phone + l.project + l.city).toLowerCase().includes(q.toLowerCase()))
  );

  const open = leads.filter(l => l.stage !== 'Won' && l.stage !== 'Lost');
  const w = leads.filter(l => l.stage === 'Won').length;

  return (
    <div className="lm-wrapper" style={{ position: 'relative', height: '100%', padding: '28px 32px 48px' }}>
      <div className="ph">
        <div>
          <h1>Lead Management</h1>
          <div className="sub">Capture, track and convert leads into clients.</div>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          {/* <button className="btn" onClick={() => setModal('reset')}>Reset demo data</button> */}
          <button className="btn p" onClick={() => setModal('add')}><Plus size={16} /> Add lead</button>
        </div>
      </div>

      <div className="kpis">
        <div className="card2 kpi"><div className="ki" style={{ background: '#EEF3FE', color: '#1F4FD8' }}><Users size={20} /></div><div><small>Open leads</small><div className="v">{open.length}</div><em>{leads.filter(l => l.stage === 'New').length} new</em></div></div>
        <div className="card2 kpi"><div className="ki" style={{ background: '#ECFDF3', color: '#067647' }}><TrendingUp size={20} /></div><div><small>Open pipeline value</small><div className="v">{fv(open.reduce((s, l) => s + l.budget, 0))}</div><em>Across active stages</em></div></div>
        <div className="card2 kpi"><div className="ki" style={{ background: '#FFFAEB', color: '#B54708' }}><Clock size={20} /></div><div><small>Follow-ups due</small><div className="v">{open.filter(l => l.fu <= TODAY).length}</div><em>Due today or overdue</em></div></div>
        <div className="card2 kpi"><div className="ki" style={{ background: '#F4EBFF', color: '#6941C6' }}><Target size={20} /></div><div><small>Conversion rate</small><div className="v">{Math.round((w / (leads.length || 1)) * 100)}%</div><em>{w} won</em></div></div>
      </div>

      <div className="bar">
        <div className="tabs">
          {TABS.map(t => <button key={t} className={tab === t ? 'on' : ''} onClick={() => setTab(t)}>{t}</button>)}
        </div>
        <div className="flt">
          <input placeholder="Search by name, phone..." value={q} onChange={e => setQ(e.target.value)} style={{ width: '230px' }} />
          <select value={fsrc} onChange={e => setFsrc(e.target.value)}>
            <option value="">All sources</option>
            {SRC.map(s => <option key={s}>{s}</option>)}
          </select>
          <select value={fown} onChange={e => setFown(e.target.value)}>
            <option value="">All owners</option>
            {owners.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {tab === 'Pipeline' && (
        <div className="board">
          {STAGES.map(s => {
            const colLeads = filtered.filter(l => l.stage === s);
            return (
              <div key={s} className="col" onDragOver={e => e.preventDefault()} onDrop={e => handleDrop(e, s)}>
                <div className="ch">
                  <span className="dot" style={{ background: COL[s] }}></span><b>{s}</b><span className="cnt">{colLeads.length}</span>
                </div>
                <div style={{ padding: '0 4px 10px 21px', fontSize: '12px', color: '#475467' }}>{fv(colLeads.reduce((t, l) => t + l.budget, 0))}</div>
                {colLeads.map(l => (
                  <div key={l.id} className="card" draggable onDragStart={e => e.dataTransfer.setData('leadId', l.id.toString())} onClick={() => setSel(l.id)}>
                    <div className="c1"><b>{l.name}</b><span className="av sm" title={l.who}>{ini(l.who)}</span></div>
                    <div className="c2">{l.project}</div>
                    <div className="c3"><span className="val">{fv(l.budget)}</span><span className="chip pri">{l.source}</span></div>
                    <div className="c4">
                      {l.stage === 'Won' ? <span className="chip ok"><Check size={12}/> Won</span> : l.stage === 'Lost' ? <span className="chip bad"><X size={12}/> {l.loss}</span> : <span className={`chip ${l.fu < TODAY ? 'bad' : l.fu === TODAY ? 'warn' : ''}`}><Clock size={12}/> {l.fu === TODAY ? 'Today' : fd(l.fu)}</span>}
                      {l.conv && <span className="chip ok"><Check size={12}/> Client</span>}
                    </div>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      )}

      {tab === 'All leads' && (
        <div className="card2" style={{ overflow: 'hidden' }}>
          <table>
            <thead><tr><th>Lead</th><th>Project</th><th>Source</th><th>Value</th><th>Stage</th><th>Owner</th></tr></thead>
            <tbody>
              {filtered.map(l => (
                <tr key={l.id} onClick={() => setSel(l.id)}>
                  <td><div className="pc"><span className="av">{ini(l.name)}</span><div><b>{l.name}</b><small style={{display:'block', color:'#98A2B3'}}>{l.phone}</small></div></div></td>
                  <td>{l.project}</td><td>{l.source}</td><td><b>{fv(l.budget)}</b></td>
                  <td><span className="chip" style={{ color: COL[l.stage], background: `${COL[l.stage]}15` }}>{l.stage}</span></td>
                  <td>{l.who}</td>
                </tr>
              ))}
              {filtered.length === 0 && <tr><td colSpan={6} style={{ textAlign: 'center', padding: '40px', color: '#98A2B3' }}>No leads found</td></tr>}
            </tbody>
          </table>
        </div>
      )}

      {/* 🔴 DRAWER WITH CSS WRAPPER 🔴 */}
      {sel && activeLead && typeof document !== 'undefined' && createPortal(
        <div className="lm-wrapper">
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(16,24,40,.4)', zIndex: 99998 }} onClick={() => setSel(null)}></div>
          <div style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: '540px', maxWidth: '100%', background: '#fff', zIndex: 99999, display: 'flex', flexDirection: 'column', boxShadow: '0 12px 32px rgba(16,24,40,.16)' }}>
            
            <div className="dh">
              <span className="av lg">{ini(activeLead.name)}</span>
              <div style={{ flex: 1 }}>
                <h2>{activeLead.name}</h2>
                <p>{activeLead.project} &middot; {fv(activeLead.budget)} &middot; {activeLead.city || 'City not set'}</p>
                <div style={{ marginTop: '6px', display: 'flex', gap: '6px' }}>
                  {activeLead.conv && <span className="chip ok"><Check size={12}/> Client</span>}
                  {activeLead.stage === 'Lost' && <span className="chip bad">Lost: {activeLead.loss}</span>}
                  <span className="chip pri">{activeLead.source}</span>
                </div>
              </div>
              <button style={{ background: 'none', border: 0, color: '#475467', cursor: 'pointer' }} onClick={() => setSel(null)}><X size={20}/></button>
            </div>

            {/* 🔴 CHEVRON PROGRESS BAR ADDED HERE 🔴 */}
            <div className="path">
              {flow.map((s, i) => (
                <button 
                  key={s} 
                  className={`ps ${activeLead.stage === 'Lost' ? '' : i < ci ? 'done' : i === ci ? 'cur' : ''}`} 
                  onClick={() => moveLead(activeLead.id, s)}
                >
                  {s}
                </button>
              ))}
            </div>

            <div className="qa">
              <button className="btn s" onClick={() => { logEvent(activeLead.id, 'Call logged', '', 'phone'); toast.success('Call logged'); }}><Phone size={14}/> Call</button>
              <button className="btn s" onClick={() => { logEvent(activeLead.id, 'WhatsApp sent', '', 'msg'); toast.success('WhatsApp sent'); }}><MessageSquare size={14}/> WhatsApp</button>
              <button className="btn s" onClick={() => { logEvent(activeLead.id, 'Email sent', '', 'mail'); toast.success('Email sent'); }}><Mail size={14}/> Email</button>
            </div>

            <div className="dt">
              {['Overview', 'Activity'].map(t => (
                <button key={t} className={dtab === t ? 'on' : ''} onClick={() => setDtab(t)}>{t}</button>
              ))}
            </div>

            <div className="db">
              {dtab === 'Overview' ? (
                <div className="fg">
                  <div><label>Full name</label><input value={activeLead.name} onChange={e => updateLead(activeLead.id, 'name', e.target.value)} /></div>
                  <div><label>Phone</label><input value={activeLead.phone} onChange={e => updateLead(activeLead.id, 'phone', e.target.value)} /></div>
                  <div><label>Email</label><input value={activeLead.email} onChange={e => updateLead(activeLead.id, 'email', e.target.value)} /></div>
                  <div><label>City</label><input value={activeLead.city} onChange={e => updateLead(activeLead.id, 'city', e.target.value)} /></div>
                  <div><label>Source</label>
                    <select value={activeLead.source} onChange={e => updateLead(activeLead.id, 'source', e.target.value)}>
                      {SRC.map(s => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                  <div><label>Project</label><input value={activeLead.project} onChange={e => updateLead(activeLead.id, 'project', e.target.value)} /></div>
                  <div><label>Budget (₹ lakh)</label><input type="number" value={activeLead.budget} onChange={e => updateLead(activeLead.id, 'budget', Number(e.target.value))} /></div>
                  <div><label>Next follow-up</label><input type="date" value={activeLead.fu} onChange={e => updateLead(activeLead.id, 'fu', e.target.value)} /></div>
                </div>
              ) : (
                <div>
                  <textarea rows={3} placeholder="Add a note about this lead..." value={noteTxt} onChange={e => setNoteTxt(e.target.value)}></textarea>
                  <button className="btn s" style={{ marginTop: '10px' }} onClick={() => { if(noteTxt){ logEvent(activeLead.id, noteTxt, '', 'note'); setNoteTxt(''); toast.success('Note saved'); }}}>Save note</button>
                  <div className="tl">
                    {activeLead.tl.map((t: any, i: number) => (
                      <div key={i} className="it">
                        <span className="ic"><FileText size={12}/></span>
                        <div><b>{t.t}</b><small>{t.w}</small></div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="df">
              <button 
               style={{ color:'#000', }}  className="btn d" disabled={activeLead.stage === 'Lost'} onClick={() => setModal('lost')}>Mark as lost</button>
              <button className="btn p" disabled={activeLead.conv} onClick={() => { updateLead(activeLead.id, 'conv', true); moveLead(activeLead.id, 'Won'); }}>
                {activeLead.conv ? 'Converted to client' : 'Convert to client'}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* 🔴 MODALS WITH CSS WRAPPER 🔴 */}
      {modal && typeof document !== 'undefined' && createPortal(
        <div className="lm-wrapper">
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(16,24,40,.5)', zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ background: '#fff', padding: '26px', borderRadius: '14px', width: '480px', maxWidth: '94%', boxShadow: '0 12px 32px rgba(16,24,40,.16)' }}>
              
              {modal === 'add' && (
                <>
                  <h3 style={{ margin: '0 0 6px', fontSize: '18px' }}>Add lead</h3>
                  <p style={{ color: '#475467', margin: '0 0 18px', fontSize: '14px' }}>Enter basic details to create a new lead.</p>
                  <div className="fg">
                    <div style={{ gridColumn: 'span 2' }}><label>Full Name</label><input value={newLead.name} onChange={e => setNewLead({...newLead, name: e.target.value})} /></div>
                    <div style={{ gridColumn: 'span 2' }}><label>Phone</label><input value={newLead.phone} onChange={e => setNewLead({...newLead, phone: e.target.value})} /></div>
                    <div><label>Source</label><select value={newLead.source} onChange={e => setNewLead({...newLead, source: e.target.value})}>{SRC.map(s => <option key={s}>{s}</option>)}</select></div>
                    <div><label>Project</label><input value={newLead.project} onChange={e => setNewLead({...newLead, project: e.target.value})} /></div>
                    <div><label>Budget (Lakhs)</label><input type="number" value={newLead.budget} onChange={e => setNewLead({...newLead, budget: e.target.value})} /></div>
                    <div><label>Owner</label><input value={newLead.who} onChange={e => setNewLead({...newLead, who: e.target.value})} /></div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                    <button className="btn" onClick={() => setModal(null)}>Cancel</button>
                    <button className="btn p" onClick={() => {
                      if (!newLead.name || !newLead.phone) return toast.error("Name and Phone required");
                      const l = mk(newLead.name, newLead.phone, newLead.source, newLead.project || 'Unspecified', Number(newLead.budget) || 0, 'New', 1, newLead.who, '');
                      setLeads([l, ...leads]); setModal(null); setSel(l.id); setNewLead({ name: '', phone: '', source: 'Website', project: '', budget: '', who: 'Neha Sharma' }); toast.success("Lead created!");
                    }}>Save Lead</button>
                  </div>
                </>
              )}

              {modal === 'lost' && (
                <>
                  <h3 style={{ margin: '0 0 6px', fontSize: '18px' }}>Mark as lost</h3>
                  <p style={{ color: '#475467', margin: '0 0 18px', fontSize: '14px' }}>Record why this lead was lost for reporting.</p>
                  <label>Reason</label>
                  <select value={lossReason} onChange={e => setLossReason(e.target.value)} style={{ marginBottom: '20px' }}>
                    {LOSS.map(r => <option key={r}>{r}</option>)}
                  </select>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                    <button className="btn" onClick={() => setModal(null)}>Cancel</button>
                    <button className="btn p d" onClick={() => {
                      if(sel) {
                        setLeads(prev => prev.map(x => x.id === sel ? { ...x, stage: 'Lost', loss: lossReason, conv: false } : x));
                        logEvent(sel, 'Marked as lost', 'Reason: ' + lossReason, 'x');
                        toast.success("Marked as lost");
                      }
                      setModal(null);
                    }}>Confirm Lost</button>
                  </div>
                </>
              )}

              {modal === 'reset' && (
                <>
                  {/* <h3 style={{ margin: '0 0 6px', fontSize: '18px' }}>Reset demo data</h3> */}
                  <p style={{ color: '#475467', margin: '0 0 18px', fontSize: '14px' }}>This will remove all your changes and restore the sample leads.</p>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                    <button className="btn" onClick={() => setModal(null)}>Cancel</button>
                    <button className="btn p d" onClick={() => {
                      setLeads(seed()); setSel(null); setQ(''); setModal(null); toast.success("Demo data reset");
                    }}>Yes, Reset</button>
                  </div>
                </>
              )}

            </div>
          </div>
        </div>,
        document.body
      )}

    </div>
  );
};