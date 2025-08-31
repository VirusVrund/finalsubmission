import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import AuthForm from './AuthForm';
import { supabase } from './supabaseClient';
import VerifierDashboard from './VerifierDashboard';
import GovernmentDashboard from './GovernmentDashboard';
import ReporterPoints from './ReporterPoints';

function ReporterIncidentForm({ token, onLogout }) {
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');
    const [photo, setPhoto] = useState(null);
    const [status, setStatus] = useState('');
    const [loading, setLoading] = useState(false);

    // Try to get geolocation
    const getLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    setLatitude(pos.coords.latitude);
                    setLongitude(pos.coords.longitude);
                },
                () => setStatus('Could not get location')
            );
        } else {
            setStatus('Geolocation not supported');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('');
        setLoading(true);
        const formData = new FormData();
        formData.append('description', description);
        formData.append('category', category);
        formData.append('latitude', latitude);
        formData.append('longitude', longitude);
        formData.append('photo', photo);
        try {
            const res = await fetch('http://localhost:5000/api/incidents', {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
                body: formData
            });
            const result = await res.json();
            setLoading(false);
            if (res.ok && result.success) {
                setStatus('🌱 Thank you for making a difference! Incident reported successfully!');
                setDescription('');
                setCategory('');
                setLatitude('');
                setLongitude('');
                setPhoto(null);
            } else {
                setStatus(result.error || 'Failed to report incident');
            }
        } catch (err) {
            setLoading(false);
            setStatus('Failed to report incident');
        }
    };

    return (
        <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 via-yellow-50 to-pink-100 overflow-hidden">
            {/* Logout Button */}
            <div className="absolute top-6 right-8 z-30">
                <button
                    onClick={onLogout}
                    className="px-5 py-2 rounded-lg font-bold bg-gradient-to-r from-green-700 to-yellow-500 text-white shadow hover:from-green-800 hover:to-yellow-600 border-2 border-green-400 focus:outline-none focus:ring-2 focus:ring-green-600"
                >
                    Logout
                </button>
            </div>
            {/* Motivational background illustration */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none animate-pulse-slow" viewBox="0 0 1440 900" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <linearGradient id="motivate" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#bbf7d0"/>
                        <stop offset="100%" stopColor="#fef9c3"/>
                    </linearGradient>
                </defs>
                <ellipse cx="720" cy="850" rx="700" ry="80" fill="url(#motivate)" opacity="0.3"/>
                <circle cx="200" cy="200" r="60" fill="#a7f3d0" opacity="0.12"/>
                <circle cx="1240" cy="300" r="80" fill="#fbbf24" opacity="0.10"/>
            </svg>
            <form className="relative z-10 max-w-lg w-full mx-auto p-10 bg-white/80 backdrop-blur-2xl rounded-3xl shadow-2xl border-4 border-green-200 flex flex-col items-center" onSubmit={handleSubmit}>
                <div className="mb-6 text-center">
                    <div className="flex justify-center mb-2">
                        <svg width="48" height="48" fill="none" viewBox="0 0 48 48"><circle cx="24" cy="24" r="24" fill="#bbf7d0"/><path d="M24 34c-6-4-10-8-10-13a10 10 0 1120 0c0 5-4 9-10 13z" fill="#22c55e"/></svg>
                    </div>
                    <h2 className="text-3xl font-extrabold text-green-700 mb-1">Be a Mangrove Hero!</h2>
                    <p className="text-lg text-green-800 font-semibold">Every report helps protect our environment 🌍</p>
                    <p className="mt-2 text-yellow-700 font-medium italic">“The best way to find yourself is to lose yourself in the service of others.”</p>
                </div>
                <input className="w-full mb-3 p-3 border-2 border-green-200 rounded-lg focus:ring-2 focus:ring-green-400" type="text" placeholder="Describe what you saw..." value={description} onChange={e => setDescription(e.target.value)} required />
                <select className="w-full mb-3 p-3 border-2 border-green-200 rounded-lg focus:ring-2 focus:ring-green-400" value={category} onChange={e => setCategory(e.target.value)} required>
                    <option value="">Select Category</option>
                    <option value="Illegal Cutting">Illegal Cutting</option>
                    <option value="Land Reclamation">Land Reclamation</option>
                    <option value="Pollution">Pollution</option>
                    <option value="Other">Other</option>
                </select>
                <div className="flex gap-2 mb-3 w-full">
                    <input className="w-1/2 p-3 border-2 border-green-200 rounded-lg" type="number" step="any" placeholder="Latitude" value={latitude} onChange={e => setLatitude(e.target.value)} required />
                    <input className="w-1/2 p-3 border-2 border-green-200 rounded-lg" type="number" step="any" placeholder="Longitude" value={longitude} onChange={e => setLongitude(e.target.value)} required />
                    <button type="button" className="bg-green-400 text-white px-3 rounded-lg font-bold shadow hover:bg-green-500 transition" onClick={getLocation}>Auto</button>
                </div>
                <input className="w-full mb-3" type="file" accept="image/*" onChange={e => setPhoto(e.target.files[0])} required />
                <button className="w-full bg-gradient-to-r from-green-500 to-yellow-400 hover:from-green-600 hover:to-yellow-500 text-white p-3 rounded-xl font-bold text-lg shadow-lg transition mb-2" type="submit" disabled={loading}>{loading ? 'Submitting...' : 'Submit Incident'}</button>
                {status && <div className="mt-2 text-center text-md text-green-700 font-semibold animate-pulse">{status}</div>}
                <div className="mt-6 text-green-800/90 text-base font-medium text-center">Your action inspires others. Thank you for being a changemaker! 💚</div>
            </form>
            {/* Custom animations */}
            <style>{`
                @keyframes pulse-slow { 0%,100%{opacity:1;} 50%{opacity:0.7;} }
                .animate-pulse-slow { animation: pulse-slow 8s infinite; }
            `}</style>
        </div>
    );
}

function ReporterDashboard({ token, onLogout }) {
    return <ReporterIncidentForm token={token} onLogout={onLogout} />;
}

function App() {
    const [user, setUser] = useState(null);
    const [role, setRole] = useState(null);
    const [token, setToken] = useState(null);
    const [showPoints, setShowPoints] = useState(false);

    // Restore auth state from localStorage on mount
    useEffect(() => {
        const savedToken = localStorage.getItem('token');
        const savedUser = localStorage.getItem('user');
        const savedRole = localStorage.getItem('role');
        if (savedToken && savedUser && savedRole) {
            setToken(savedToken);
            setUser(JSON.parse(savedUser));
            setRole(savedRole);
        }
    }, []);

    const handleAuth = async (userObj, session) => {
        setUser(userObj);
        setToken(session.access_token);
        // Fetch user from backend to get full metadata (role)
        const res = await fetch('http://localhost:5000/api/auth/me', {
            headers: { 'Authorization': `Bearer ${session.access_token}` }
        });
        const data = await res.json();
        setRole(data.user.user_metadata?.role);
        // Persist to localStorage
        localStorage.setItem('token', session.access_token);
        localStorage.setItem('user', JSON.stringify(userObj));
        localStorage.setItem('role', data.user.user_metadata?.role || '');
    };

    const handleLogout = () => {
        setUser(null);
        setToken(null);
        setRole(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('role');
    };

    if (!user || !role) {
        return <AuthForm onAuth={handleAuth} />;
    }

    return (
        <div>
            <button className="fixed top-4 right-6 z-50 bg-gradient-to-r from-green-400 to-green-600 text-white font-bold px-5 py-2 rounded-xl shadow-lg border-2 border-green-500 hover:from-green-500 hover:to-green-700 transition" onClick={handleLogout}>Logout</button>
            {role === 'Reporter' && (
                <>
                    <button
                        className="fixed top-4 left-6 z-50 bg-gradient-to-r from-green-400 to-yellow-300 text-green-900 font-bold px-5 py-2 rounded-xl shadow-lg border-2 border-green-300 hover:from-green-500 hover:to-yellow-400 transition"
                        onClick={() => setShowPoints((v) => !v)}
                    >
                        {showPoints ? 'Back to Dashboard' : 'View My Points'}
                    </button>
                    {showPoints ? (
                        <ReporterPoints user={user} />
                    ) : (
                        <ReporterDashboard token={token} />
                    )}
                </>
            )}
            {role === 'Verifier' && <VerifierDashboard token={token} />}
            {role === 'Government' && <GovernmentDashboard token={token} onLogout={handleLogout} />}
            {!['Reporter', 'Verifier', 'Government'].includes(role) && <div>Unknown role</div>}
        </div>
    );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
