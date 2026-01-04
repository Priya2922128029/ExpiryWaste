import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { ArrowRight, AlertOctagon, CheckCircle, Clock } from 'lucide-react';

export default function Dashboard() {
    const [stats, setStats] = useState({
        total: 0,
        expired: 0,
        expiringSoon: 0,
        safe: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // In a real app, I'd create a dedicated stats endpoint for efficiency
        // But reusing the products endpoint works for small data
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/products');
            const products = res.data;

            const expired = products.filter(p => p.status === 'Expired').length;
            const expiringSoon = products.filter(p => p.status === 'Expiring Soon').length;
            const safe = products.filter(p => p.status === 'Safe').length;

            setStats({
                total: products.length,
                expired,
                expiringSoon,
                safe
            });
        } catch (error) {
            console.error("Failed to fetch dashboard data");
        } finally {
            setLoading(false);
        }
    };

    const data = [
        { name: 'Safe', value: stats.safe, color: '#10b981' },
        { name: 'Expiring Soon', value: stats.expiringSoon, color: '#f59e0b' },
        { name: 'Expired', value: stats.expired, color: '#ef4444' },
    ].filter(d => d.value > 0);

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                    Dashboard Overview
                </h1>
                <p className="text-slate-500">Welcome back! Here's your inventory status.</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="glass-panel p-6 border-l-4 border-l-emerald-500 flex items-center justify-between">
                    <div>
                        <p className="text-slate-500 font-medium text-sm">Safe Products</p>
                        <h2 className="text-3xl font-bold text-slate-800">{stats.safe}</h2>
                    </div>
                    <div className="p-3 bg-emerald-100 text-emerald-600 rounded-full">
                        <CheckCircle size={24} />
                    </div>
                </div>

                <div className="glass-panel p-6 border-l-4 border-l-amber-500 flex items-center justify-between">
                    <div>
                        <p className="text-slate-500 font-medium text-sm">Expiring Soon</p>
                        <h2 className="text-3xl font-bold text-slate-800">{stats.expiringSoon}</h2>
                    </div>
                    <div className="p-3 bg-amber-100 text-amber-600 rounded-full">
                        <Clock size={24} />
                    </div>
                </div>

                <div className="glass-panel p-6 border-l-4 border-l-red-500 flex items-center justify-between">
                    <div>
                        <p className="text-slate-500 font-medium text-sm">Expired</p>
                        <h2 className="text-3xl font-bold text-slate-800">{stats.expired}</h2>
                    </div>
                    <div className="p-3 bg-red-100 text-red-600 rounded-full">
                        <AlertOctagon size={24} />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Chart Section */}
                <div className="glass-panel p-6">
                    <h3 className="text-lg font-bold text-slate-700 mb-6">Inventory Distribution</h3>
                    <div className="h-64 flex items-center justify-center">
                        {data.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={data}
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {data.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <p className="text-slate-400">No data available</p>
                        )}
                    </div>
                    <div className="flex justify-center gap-6 mt-4">
                        {data.map((d) => (
                            <div key={d.name} className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }}></div>
                                <span className="text-sm text-slate-600">{d.name}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Quick Actions / Recent */}
                <div className="glass-panel p-6">
                    <h3 className="text-lg font-bold text-slate-700 mb-6">Quick Actions</h3>
                    <div className="space-y-4">
                        <Link to="/add-product" className="block group">
                            <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-between group-hover:bg-indigo-100 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-indigo-200 flex items-center justify-center text-indigo-700 font-bold">+</div>
                                    <div>
                                        <h4 className="font-semibold text-slate-800">Add New Product</h4>
                                        <p className="text-xs text-slate-500">Track a new item in your inventory</p>
                                    </div>
                                </div>
                                <ArrowRight size={18} className="text-indigo-400 group-hover:translate-x-1 transition-transform" />
                            </div>
                        </Link>

                        <Link to="/products" className="block group">
                            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between group-hover:bg-slate-100 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-700 font-bold">#</div>
                                    <div>
                                        <h4 className="font-semibold text-slate-800">View All Products</h4>
                                        <p className="text-xs text-slate-500">Manage your existing tracking list</p>
                                    </div>
                                </div>
                                <ArrowRight size={18} className="text-slate-400 group-hover:translate-x-1 transition-transform" />
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
