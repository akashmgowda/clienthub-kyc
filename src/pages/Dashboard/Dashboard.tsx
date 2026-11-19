import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import './Dashboard.css';

type Status = 'Draft' | 'Pending Review' | 'Approved' | 'Needs Changes';
type Client = { id: string; name: string; email: string; company: string; status: Status; updated: string };

const clients: Client[] = [
  { id: 'CH-1001', name: 'Aarav Sharma', email: 'aarav@example.com', company: 'Northstar Capital', status: 'Pending Review', updated: '2026-11-12' },
  { id: 'CH-1002', name: 'Meera Rao', email: 'meera@example.com', company: 'BluePeak Technologies', status: 'Approved', updated: '2026-11-11' },
  { id: 'CH-1003', name: 'Rohan Patel', email: 'rohan@example.com', company: 'Summit Ventures', status: 'Draft', updated: '2026-11-10' },
  { id: 'CH-1004', name: 'Ananya Iyer', email: 'ananya@example.com', company: 'Cedar Financial', status: 'Needs Changes', updated: '2026-11-09' },
  { id: 'CH-1005', name: 'Vikram Singh', email: 'vikram@example.com', company: 'Horizon Holdings', status: 'Pending Review', updated: '2026-11-08' },
  { id: 'CH-1006', name: 'Priya Nair', email: 'priya@example.com', company: 'Riverstone Partners', status: 'Approved', updated: '2026-11-07' },
];

const statuses: Array<Status | 'All'> = ['All', 'Draft', 'Pending Review', 'Approved', 'Needs Changes'];

export default function Dashboard() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<Status | 'All'>('All');
  const [selected, setSelected] = useState<Client | null>(null);

  const filtered = useMemo(() => clients.filter(client => {
    const matchesSearch = [client.name, client.email, client.company, client.id].some(value =>
      value.toLowerCase().includes(search.trim().toLowerCase())
    );
    return matchesSearch && (filter === 'All' || client.status === filter);
  }), [search, filter]);

  const count = (status: Status) => clients.filter(client => client.status === status).length;

  return (
    <div className="dashboard-shell">
      <aside className="dashboard-sidebar">
        <a href="/" className="dashboard-brand"><span>C</span> ClientHub</a>
        <nav aria-label="Main navigation">
          <span className="nav-active">▦ &nbsp; Overview</span>
          <span className="nav-disabled">♙ &nbsp; Clients · coming soon</span>
          <span className="nav-disabled">▤ &nbsp; KYC Applications · coming soon</span>
        </nav>
        <div className="sidebar-foot">DEMO MODE<br /><small>No backend connection</small></div>
      </aside>
      <main className="dashboard-main">
        <header className="dashboard-topbar">
          <div><span className="dashboard-eyebrow">CLIENT OPERATIONS</span><h1>Overview</h1><p>Track onboarding and KYC reviews in one place.</p></div>
          <a href="/" className="back-link">← Back to login</a>
        </header>
        <div className="demo-notice" role="note"><strong>Preview only:</strong> All client records are fictional sample data. No information is saved or sent to a server.</div>
        <section className="stats-grid" aria-label="KYC status summary">
          <article className="stat-card"><span>Total clients</span><strong>{clients.length}</strong><small>Sample records</small></article>
          <article className="stat-card"><span>Pending review</span><strong>{count('Pending Review')}</strong><small>Awaiting approval</small></article>
          <article className="stat-card"><span>Approved</span><strong>{count('Approved')}</strong><small>Completed reviews</small></article>
          <article className="stat-card"><span>Needs changes</span><strong>{count('Needs Changes')}</strong><small>Action required</small></article>
        </section>
        <section className="clients-panel" aria-labelledby="clients-title">
          <div className="panel-heading"><div><h2 id="clients-title">Client applications</h2><p>Search and filter onboarding records.</p></div><div style={{display:"flex",alignItems:"center",gap:16}}><span className="results-count">{filtered.length} results</span><Link to="/kyc/new" style={{background:"#1d4ed8",color:"white",borderRadius:8,padding:"11px 15px",fontSize:13,fontWeight:700,textDecoration:"none"}}>+ New KYC application</Link></div></div>
          <div className="table-controls">
            <label className="search-label">Search clients<input type="search" value={search} onChange={event => setSearch(event.target.value)} placeholder="Name, email, company or ID" /></label>
            <label className="filter-label">Status<select value={filter} onChange={event => setFilter(event.target.value as Status | 'All')}>{statuses.map(status => <option key={status} value={status}>{status === 'All' ? 'All statuses' : status}</option>)}</select></label>
          </div>
          <div className="table-scroll"><table><thead><tr><th>Client</th><th>Company</th><th>Application ID</th><th>Status</th><th>Updated</th><th>Action</th></tr></thead>
            <tbody>{filtered.map(client => <tr key={client.id}><td><strong>{client.name}</strong><small>{client.email}</small></td><td>{client.company}</td><td>{client.id}</td><td><span className={`status-pill status-${client.status.toLowerCase().replace(/ /g, '-')}`}>{client.status}</span></td><td>{client.updated}</td><td><button type="button" className="view-button" onClick={() => setSelected(client)}>View</button></td></tr>)}</tbody>
          </table></div>
          {filtered.length === 0 && <div className="empty-state">No clients match your search. Try another keyword or status.</div>}
        </section>
        {selected && <div className="modal-backdrop" onClick={() => setSelected(null)}>
          <section className="client-modal" role="dialog" aria-modal="true" aria-labelledby="client-detail-title" onClick={event => event.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelected(null)} aria-label="Close client details">×</button>
            <span className="dashboard-eyebrow">APPLICATION DETAILS</span><h2 id="client-detail-title">{selected.name}</h2>
            <dl><dt>Application ID</dt><dd>{selected.id}</dd><dt>Email</dt><dd>{selected.email}</dd><dt>Company</dt><dd>{selected.company}</dd><dt>Status</dt><dd>{selected.status}</dd><dt>Last updated</dt><dd>{selected.updated}</dd></dl>
            <p>This is a read-only preview. Editing and KYC forms will be implemented in the next milestone.</p>
            <button className="modal-done" onClick={() => setSelected(null)}>Close</button>
          </section>
        </div>}
      </main>
    </div>
  );
}
