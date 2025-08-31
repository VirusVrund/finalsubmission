
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { saveAs } from 'file-saver';

function csvFromIncidents(incidents) {
  if (!incidents.length) return '';
  const header = Object.keys(incidents[0]).join(',');
  const rows = incidents.map(obj => Object.values(obj).map(v => `"${v ?? ''}"`).join(','));
  return [header, ...rows].join('\n');
}


export default function GovernmentDashboard({ token, onLogout }) {
  const [incidents, setIncidents] = useState([]);
  const [status, setStatus] = useState('verified');
  const [category, setCategory] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [selected, setSelected] = useState(null);
  // For animated mangrove floating effect
  const [float, setFloat] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => setFloat(f => (f + 1) % 360), 40);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    async function fetchIncidents() {
      let url = `http://localhost:5000/api/incidents?status=${status}`;
      if (category) url += `&category=${category}`;
      if (from) url += `&from=${from}`;
      if (to) url += `&to=${to}`;
      const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      setIncidents(data.incidents || []);
    }
    fetchIncidents();
  }, [status, category, from, to, token]);

  // For heatmap, collect [lat, lng, weight]
  const heatmapPoints = incidents.map(i => [i.latitude, i.longitude, 1]);

  function handleExport() {
    const csv = csvFromIncidents(incidents);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'incidents.csv');
  }

  const defaultCenter = incidents.length > 0
    ? [incidents[0].latitude, incidents[0].longitude]
    : [19.1, 72.9];

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-gradient-to-br from-blue-100 via-green-100 to-orange-50">
      {/* Logout Button */}
      <div className="absolute top-6 right-8 z-30">
        <button
          onClick={onLogout}
          className="px-5 py-2 rounded-lg font-bold bg-gradient-to-r from-gray-700 to-gray-500 text-white shadow hover:from-gray-800 hover:to-gray-600 border-2 border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-600"
        >
          Logout
        </button>
      </div>
      {/* Animated Parallax Mangrove Hero */}
      <div className="relative h-[340px] md:h-[420px] overflow-hidden flex items-center justify-center">
        {/* Foggy/uncertainty animated overlay */}
        <div className="pointer-events-none absolute inset-0 z-20">
          <svg className="w-full h-full" viewBox="0 0 1440 400" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ opacity: 0.45 }}>
            <defs>
              <linearGradient id="fog1" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#e0e7ef" stopOpacity="0.7" />
                <stop offset="100%" stopColor="#cbd5e1" stopOpacity="0.2" />
              </linearGradient>
              <linearGradient id="fog2" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#b6bbc7" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#64748b" stopOpacity="0.1" />
              </linearGradient>
            </defs>
            <ellipse cx="720" cy="120" rx="700" ry="80" fill="url(#fog1)">
              <animate attributeName="cy" values="120;140;120" dur="7s" repeatCount="indefinite" />
            </ellipse>
            <ellipse cx="900" cy="200" rx="600" ry="60" fill="url(#fog2)">
              <animate attributeName="cy" values="200;220;200" dur="9s" repeatCount="indefinite" />
            </ellipse>
          </svg>
        </div>
        {/* Parallax SVG background */}
        <svg className="absolute top-0 left-0 w-full h-full animate-pulse" viewBox="0 0 1440 400" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="mangrove1" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#a7f3d0" />
              <stop offset="100%" stopColor="#fcd34d" />
            </linearGradient>
            <linearGradient id="mangrove2" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#f472b6" />
              <stop offset="100%" stopColor="#60a5fa" />
            </linearGradient>
          </defs>
          <path d="M0,320 Q360,200 720,320 T1440,320 V400 H0Z" fill="url(#mangrove1)" opacity="0.7" />
          <path d="M0,360 Q400,260 900,360 T1440,360 V400 H0Z" fill="url(#mangrove2)" opacity="0.5" />
        </svg>
        {/* Floating mangrove SVGs */}
        <svg style={{ position: 'absolute', left: '10%', top: `${180 + 10 * Math.sin(float / 30)}px`, zIndex: 2, transition: 'top 0.2s' }} width="80" height="120" viewBox="0 0 80 120" fill="none">
          <ellipse cx="40" cy="110" rx="30" ry="10" fill="#a7f3d0" />
          <rect x="35" y="60" width="10" height="50" rx="5" fill="#047857" />
          <circle cx="40" cy="60" r="25" fill="#22d3ee" />
          <ellipse cx="40" cy="60" rx="18" ry="10" fill="#bbf7d0" />
        </svg>
        <svg style={{ position: 'absolute', left: '70%', top: `${200 + 12 * Math.cos(float / 40)}px`, zIndex: 2, transition: 'top 0.2s' }} width="90" height="130" viewBox="0 0 90 130" fill="none">
          <ellipse cx="45" cy="120" rx="35" ry="12" fill="#fcd34d" />
          <rect x="40" y="70" width="10" height="50" rx="5" fill="#b91c1c" />
          <circle cx="45" cy="70" r="28" fill="#f472b6" />
          <ellipse cx="45" cy="70" rx="20" ry="12" fill="#fef9c3" />
        </svg>
        <div className="relative z-10 text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-700 via-gray-500 to-gray-900 drop-shadow-2xl animate-fade-in">Mangrove Guardian</h1>
          <p className="mt-4 text-2xl md:text-3xl font-bold text-gray-800 drop-shadow animate-fade-in delay-200">Government Dashboard</p>
          <div className="mt-6 mx-auto max-w-2xl text-gray-800 bg-white/30 backdrop-blur-md rounded-2xl p-4 shadow-xl border-2 border-gray-300 animate-fade-in delay-400">
            <p>
              <span className="font-bold text-gray-700">Explore, filter, and export</span> verified mangrove incidents.<br />
              Use the interactive map and table to monitor and analyze incident trends for better policy and action.
            </p>
          </div>
          {/* Add margin below hero text to prevent overlay on map */}
          <div className="mb-16 md:mb-24"></div>
        </div>
      </div>
      {/* Dashboard Card with Glassmorphism */}
      <div className="max-w-6xl mx-auto -mt-8 md:-mt-16 p-8 bg-white/90 rounded-2xl shadow-xl border-2 border-green-400">
        <h2 className="text-2xl font-bold mb-6 text-gray-700 text-center animate-fade-in delay-700">Verified Incidents Map</h2>
        <div className="flex flex-wrap gap-4 mb-6 justify-center animate-fade-in delay-1000">
          <select value={status} onChange={e => setStatus(e.target.value)} className="p-2 border-2 border-gray-300 rounded-lg bg-gray-100/80 text-gray-900 font-semibold shadow-md">
            <option value="verified">Verified</option>
            <option value="pending">Pending</option>
            <option value="rejected">Rejected</option>
          </select>
          <select value={category} onChange={e => setCategory(e.target.value)} className="p-2 border-2 border-gray-300 rounded-lg bg-gray-100/80 text-gray-900 font-semibold shadow-md">
            <option value="">All Categories</option>
            <option value="Illegal Cutting">Illegal Cutting</option>
            <option value="Land Reclamation">Land Reclamation</option>
            <option value="Pollution">Pollution</option>
            <option value="Other">Other</option>
          </select>
          <input type="date" value={from} onChange={e => setFrom(e.target.value)} className="p-2 border-2 border-gray-300 rounded-lg bg-gray-100/80 text-gray-900 font-semibold shadow-md" />
          <input type="date" value={to} onChange={e => setTo(e.target.value)} className="p-2 border-2 border-gray-300 rounded-lg bg-gray-100/80 text-gray-900 font-semibold shadow-md" />
          <button onClick={handleExport} className="bg-gradient-to-r from-gray-700 to-gray-500 hover:from-gray-800 hover:to-gray-600 text-white px-6 py-2 rounded-lg font-bold shadow-xl animate-glow">Export CSV</button>
        </div>
        <div className="mb-8 rounded-xl overflow-hidden border-2 border-gray-300 animate-fade-in delay-1200 shadow-xl">
          <MapContainer center={defaultCenter} zoom={10} style={{ height: '400px', width: '100%' }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {incidents.map(inc => (
              <Marker key={inc.id} position={[inc.latitude, inc.longitude]} eventHandlers={{ click: () => setSelected(inc) }}>
                <Popup>
                  <div>
                    <strong>{inc.category}</strong><br />
                    {inc.description}<br />
                    <a href={inc.photo_url} target="_blank" rel="noopener noreferrer" className="text-green-700 underline">Photo</a>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
        {selected && (
          <div className="fixed right-0 top-0 w-96 h-full bg-white/80 backdrop-blur-lg shadow-2xl p-6 overflow-y-auto z-50 border-l-4 border-gray-300 animate-fade-in">
            <button className="float-right text-2xl text-green-700 hover:text-fuchsia-600" onClick={() => setSelected(null)}>×</button>
            <h3 className="text-xl font-extrabold mb-3 text-green-800">Incident Details</h3>
            <div className="mb-2"><b>Category:</b> {selected.category}</div>
            <div className="mb-2"><b>Description:</b> {selected.description}</div>
            <div className="mb-2"><b>Status:</b> {selected.status}</div>
            <div className="mb-2"><b>Date:</b> {selected.created_at}</div>
            <div className="mb-2"><b>Location:</b> {selected.latitude}, {selected.longitude}</div>
            <div className="mb-2"><b>Photo:</b> <a href={selected.photo_url} target="_blank" rel="noopener noreferrer" className="text-green-700 underline">View</a></div>
            <div className="mb-2"><b>Verifier Notes:</b> {selected.verifier_notes}</div>
          </div>
        )}
        <div className="mt-8 animate-fade-in delay-1400">
          <h3 className="font-bold mb-2 text-gray-800 text-xl">Incidents Table</h3>
          <div className="overflow-x-auto rounded-2xl shadow-xl border-2 border-gray-300 bg-white/70 backdrop-blur-md">
            <table className="w-full border border-green-200 rounded-lg">
              <thead className="bg-green-50">
                <tr>
                  <th className="p-3 text-left">Description</th>
                  <th className="p-3 text-left">Category</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-left">Date</th>
                  <th className="p-3 text-left">Location</th>
                  <th className="p-3 text-left">Photo</th>
                </tr>
              </thead>
              <tbody>
                {incidents.map(inc => (
                  <tr key={inc.id} className="border-t hover:bg-green-50/60 transition-all">
                    <td className="p-3">{inc.description}</td>
                    <td className="p-3">{inc.category}</td>
                    <td className="p-3">{inc.status}</td>
                    <td className="p-3">{inc.created_at}</td>
                    <td className="p-3">{inc.latitude}, {inc.longitude}</td>
                    <td className="p-3"><a href={inc.photo_url} target="_blank" rel="noopener noreferrer" className="text-green-700 underline">View</a></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {/* Custom Animations */}
      <style>{`
        @keyframes fade-in { from { opacity: 0; transform: translateY(40px);} to { opacity: 1; transform: none; } }
        .animate-fade-in { animation: fade-in 1.1s cubic-bezier(.4,0,.2,1) both; }
        .animate-fade-in.delay-200 { animation-delay: .2s; }
        .animate-fade-in.delay-400 { animation-delay: .4s; }
        .animate-fade-in.delay-700 { animation-delay: .7s; }
        .animate-fade-in.delay-1000 { animation-delay: 1s; }
        .animate-fade-in.delay-1200 { animation-delay: 1.2s; }
        .animate-fade-in.delay-1400 { animation-delay: 1.4s; }
        @keyframes dashboard-float { 0%,100% { transform: translateY(0px);} 50% { transform: translateY(-12px);} }
        .animate-dashboard-float { animation: dashboard-float 5s ease-in-out infinite; }
        @keyframes glow { 0%,100% { box-shadow: 0 0 16px 4px #f472b6, 0 0 8px 2px #60a5fa; } 50% { box-shadow: 0 0 32px 8px #fcd34d, 0 0 16px 4px #a7f3d0; } }
        .animate-glow { animation: glow 2.5s ease-in-out infinite; }

  `}</style>
    </div>
  );
}
