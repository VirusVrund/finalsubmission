import React, { useEffect, useState } from 'react';

export default function VerifierDashboard({ token }) {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionStatus, setActionStatus] = useState('');

  useEffect(() => {
    async function fetchIncidents() {
      setLoading(true);
      const res = await fetch('http://localhost:5000/api/incidents?status=pending', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setIncidents(data.incidents || []);
      setLoading(false);
    }
    fetchIncidents();
  }, [token, actionStatus]);

  async function handleAction(id, action) {
    const notes = prompt(`Add notes for this ${action}:`, '');
    setActionStatus('');
    const res = await fetch(`http://localhost:5000/api/incidents/${id}/${action}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ notes })
    });
    const result = await res.json();
    if (res.ok && result.success) {
      setActionStatus(`${action}d`);
    } else {
      setActionStatus(result.error || 'Failed');
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-orange-50 py-8">
  <div className="max-w-4xl mx-auto p-8 bg-white/90 rounded-2xl shadow-xl border-2 border-green-400">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-fuchsia-600 to-blue-700 drop-shadow-2xl">Mangrove Guardian</h1>
          <p className="mt-2 text-lg font-semibold text-purple-700 drop-shadow">Verifier Dashboard</p>
          <div className="mt-4 max-w-2xl mx-auto text-purple-900 bg-orange-100/80 rounded-2xl p-4 shadow-xl border-2 border-fuchsia-200">
            <p>
              Review and verify reported mangrove incidents. Your actions help ensure the integrity of our monitoring system and the protection of our coastal forests.
            </p>
          </div>
        </div>
        <h2 className="text-2xl font-bold mb-6 text-orange-700 text-center">Pending Incidents</h2>
        {loading ? <div className="text-center text-fuchsia-700">Loading...</div> : (
          <div className="overflow-x-auto">
            <table className="w-full border-2 border-fuchsia-200 rounded-xl shadow">
              <thead className="bg-gradient-to-r from-orange-100 via-fuchsia-100 to-blue-100">
                <tr>
                  <th className="p-3 text-left font-bold text-fuchsia-700">Description</th>
                  <th className="p-3 text-left font-bold text-fuchsia-700">Category</th>
                  <th className="p-3 text-left font-bold text-fuchsia-700">Location</th>
                  <th className="p-3 text-left font-bold text-fuchsia-700">Photo</th>
                  <th className="p-3 text-left font-bold text-fuchsia-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {incidents.length === 0 ? (
                  <tr><td colSpan={5} className="text-center p-4 text-fuchsia-700">No pending incidents</td></tr>
                ) : incidents.map(inc => (
                  <tr key={inc.id} className="border-t border-fuchsia-100 hover:bg-orange-50 transition">
                    <td className="p-3">{inc.description}</td>
                    <td className="p-3">{inc.category}</td>
                    <td className="p-3">{inc.latitude}, {inc.longitude}</td>
                    <td className="p-3"><a href={inc.photo_url} target="_blank" rel="noopener noreferrer" className="text-blue-700 underline">View</a></td>
                    <td className="p-3 flex gap-2">
                      <button className="bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-white px-4 py-1 rounded-lg font-bold shadow transition" onClick={() => handleAction(inc.id, 'verify')}>Verify</button>
                      <button className="bg-gradient-to-r from-red-400 to-red-600 hover:from-red-500 hover:to-red-700 text-white px-4 py-1 rounded-lg font-bold shadow transition" onClick={() => handleAction(inc.id, 'reject')}>Reject</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {actionStatus && <div className="mt-4 text-center text-blue-700 font-bold">{actionStatus}</div>}
      </div>
    </div>
  );
}
