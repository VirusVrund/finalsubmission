import React, { useEffect, useState } from 'react';

export default function ReporterPoints({ user }) {
    const [points, setPoints] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        async function fetchPoints() {
            setLoading(true);
            setError('');
            try {
                const res = await fetch(`http://localhost:5000/api/reporter/points?reporter_id=${user.id}`);
                const data = await res.json();
                if (res.ok && data.points !== undefined) {
                    setPoints(data.points);
                } else {
                    setError(data.error || 'Could not fetch points');
                }
            } catch (err) {
                setError('Network error');
            }
            setLoading(false);
        }
        if (user && user.user_metadata?.role === 'Reporter') fetchPoints();
    }, [user]);

    if (!user || user.user_metadata?.role !== 'Reporter') {
        return (
            <div className="p-8 text-center">
                Access denied.<br />
                <pre className="text-xs text-gray-500 bg-gray-100 p-2 mt-2 rounded">{JSON.stringify(user, null, 2)}</pre>
            </div>
        );
    }

    return (
        <div className="relative flex items-center justify-center min-h-screen overflow-hidden">
            {/* Animated SVG background */}
            <svg className="absolute inset-0 w-full h-full animate-pulse-slow" style={{zIndex:0}} viewBox="0 0 1440 900" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <linearGradient id="wave" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#fbbf24"/>
                        <stop offset="100%" stopColor="#f472b6"/>
                    </linearGradient>
                </defs>
                <path d="M0,800 Q360,700 720,800 T1440,800 V900 H0Z" fill="url(#wave)" opacity="0.3">
                    <animate attributeName="d" dur="8s" repeatCount="indefinite"
                        values="M0,800 Q360,700 720,800 T1440,800 V900 H0Z;M0,800 Q360,850 720,750 T1440,800 V900 H0Z;M0,800 Q360,700 720,800 T1440,800 V900 H0Z"/>
                </path>
                <circle cx="200" cy="200" r="60" fill="#a5b4fc" opacity="0.15">
                    <animate attributeName="cy" values="200;220;200" dur="6s" repeatCount="indefinite"/>
                </circle>
                <circle cx="1240" cy="300" r="80" fill="#f472b6" opacity="0.12">
                    <animate attributeName="cy" values="300;320;300" dur="7s" repeatCount="indefinite"/>
                </circle>
            </svg>
            {/* Glassmorphism card */}
            <div className="relative w-full max-w-md p-12 bg-white/90 rounded-2xl shadow-xl border-2 border-green-400 text-center z-10 flex flex-col items-center">
                <div className="flex flex-col items-center mb-4">
                    {/* Animated glowing badge */}
                    <div className="relative mb-2">
                        <svg width="90" height="90" viewBox="0 0 90 90" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <circle cx="45" cy="45" r="40" fill="#fbbf24" filter="url(#glow)"/>
                                                <defs>
                                                    <filter id="glow" x="-20" y="-20" width="130" height="130" filterUnits="userSpaceOnUse">
                                                        <feGaussianBlur stdDeviation="10" result="coloredBlur"/>
                                                        <feMerge>
                                                            <feMergeNode in="coloredBlur"/>
                                                            <feMergeNode in="SourceGraphic"/>
                                                        </feMerge>
                                                    </filter>
                                                </defs>
                                                <text x="50%" y="54%" textAnchor="middle" fontSize="2.2em" fontWeight="bold" fill="#fff" style={{filter:'drop-shadow(0 0 8px #f59e42)'}}>
                                                    ★
                                                </text>
                                            </svg>
                                            {/* Confetti burst */}
                                            {!loading && !error && (
                                                <svg className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" width="120" height="120" viewBox="0 0 120 120">
                                                    <g>
                                                        <circle cx="60" cy="20" r="4" fill="#f59e42">
                                                            <animate attributeName="cy" values="20;10;20" dur="1.2s" repeatCount="indefinite"/>
                                                        </circle>
                                                        <circle cx="100" cy="60" r="4" fill="#a5b4fc">
                                                            <animate attributeName="cx" values="100;110;100" dur="1.4s" repeatCount="indefinite"/>
                                                        </circle>
                                                        <circle cx="60" cy="100" r="4" fill="#f472b6">
                                                            <animate attributeName="cy" values="100;110;100" dur="1.1s" repeatCount="indefinite"/>
                                                        </circle>
                                                        <circle cx="20" cy="60" r="4" fill="#fbbf24">
                                                            <animate attributeName="cx" values="20;10;20" dur="1.3s" repeatCount="indefinite"/>
                                                        </circle>
                                                    </g>
                                                </svg>
                                            )}
                                        </div>
                                        <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-fuchsia-600 to-blue-700 drop-shadow-2xl mt-2 tracking-wide">Your Reward Points</h2>
                                    </div>
                                    {loading ? (
                                            <div className="text-fuchsia-700 text-xl animate-pulse">Loading...</div>
                                    ) : error ? (
                                            <div className="text-red-600 font-bold text-lg">{error}</div>
                                    ) : (
                                            <div className="text-7xl font-extrabold text-orange-500 mb-2 drop-shadow animate-glow-pulse">{points}</div>
                                    )}
                                    <div className="mt-6 text-fuchsia-700/80 text-lg font-semibold">Keep reporting to earn more points and badges!</div>
                                </div>
                                {/* Extra animated leaves */}
                                <svg className="absolute left-0 bottom-0 w-32 h-32 animate-float-slow" viewBox="0 0 100 100" fill="none">
                                    <ellipse cx="50" cy="80" rx="40" ry="10" fill="#34d399" opacity="0.2"/>
                                    <ellipse cx="30" cy="60" rx="10" ry="4" fill="#4ade80"/>
                                    <ellipse cx="70" cy="70" rx="12" ry="5" fill="#a7f3d0"/>
                                </svg>
                                <svg className="absolute right-0 top-0 w-32 h-32 animate-float-slow" viewBox="0 0 100 100" fill="none">
                                    <ellipse cx="50" cy="20" rx="40" ry="10" fill="#818cf8" opacity="0.18"/>
                                    <ellipse cx="70" cy="40" rx="10" ry="4" fill="#f472b6"/>
                                    <ellipse cx="30" cy="30" rx="12" ry="5" fill="#fbbf24"/>
                                </svg>
                                {/* Custom animations */}
                                <style>{`
                                    @keyframes pulse-slow { 0%,100%{opacity:1;} 50%{opacity:0.7;} }
                                    .animate-pulse-slow { animation: pulse-slow 8s infinite; }
                                    @keyframes float-slow { 0%,100%{transform:translateY(0);} 50%{transform:translateY(-12px);} }
                                    .animate-float-slow { animation: float-slow 6s infinite; }
                                    @keyframes glow-pulse { 0%,100%{text-shadow:0 0 24px #fbbf24;} 50%{text-shadow:0 0 48px #f59e42;} }
                                    .animate-glow-pulse { animation: glow-pulse 2.2s infinite; }
                                `}</style>
                        </div>
                );
}
