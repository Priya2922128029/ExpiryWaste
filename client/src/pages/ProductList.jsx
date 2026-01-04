import { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Filter, Trash2, Calendar, AlertTriangle } from 'lucide-react';
import clsx from 'clsx';

export default function ProductList() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('All');
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/products');
            setProducts(res.data);
        } catch (error) {
            console.error("Failed to fetch products", error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Expired': return 'bg-red-100 text-red-700 border-red-200';
            case 'Expiring Soon': return 'bg-amber-100 text-amber-700 border-amber-200';
            default: return 'bg-emerald-100 text-emerald-700 border-emerald-200';
        }
    };

    const filteredProducts = products.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
        const matchesFilter = filter === 'All' || p.category === filter || p.status === filter;
        return matchesSearch && matchesFilter;
    });

    return (
        <div>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-cyan-600">
                    My Inventory
                </h1>

                <div className="flex gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search products..."
                            className="pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-white"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <select
                        className="px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-white text-slate-600"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                    >
                        <option value="All">All Categories</option>
                        <option value="Food">Food</option>
                        <option value="Medicine">Medicine</option>
                        <option value="Expired">Expired</option>
                        <option value="Expiring Soon">Expiring Soon</option>
                    </select>
                </div>
            </div>

            {loading ? (
                <div className="text-center py-20 text-slate-500">Loading products...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProducts.map((product) => (
                        <div key={product.id} className="glass-panel p-5 hover:shadow-2xl transition-all duration-300">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="font-bold text-lg text-slate-800">{product.name}</h3>
                                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{product.category}</span>
                                </div>
                                <span className={clsx("px-3 py-1 text-xs font-bold rounded-full border", getStatusColor(product.status))}>
                                    {product.status}
                                </span>
                            </div>

                            <div className="space-y-2 text-sm text-slate-600 mb-4">
                                <div className="flex items-center gap-2">
                                    <Calendar size={16} className="text-slate-400" />
                                    <span>Expires: <b className="text-slate-800">{new Date(product.expiryDate).toLocaleDateString()}</b></span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="font-medium">Qty:</span> {product.quantity}
                                </div>
                                {product.notes && <p className="text-xs text-slate-400 italic">"{product.notes}"</p>}
                            </div>

                            <div className="pt-4 border-t border-slate-100 flex justify-end">
                                <button className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    ))}

                    {filteredProducts.length === 0 && (
                        <div className="col-span-full text-center py-12 text-slate-400">
                            <p>No products found matching your criteria.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
