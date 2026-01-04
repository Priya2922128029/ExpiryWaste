import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Calendar, Package, DollarSign, Tag, FileText, Hash } from 'lucide-react';

export default function AddProduct() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        category: 'Food',
        quantity: 1,
        startDate: new Date().toISOString().split('T')[0],
        expiryDate: '',
        price: '',
        notes: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await axios.post('http://localhost:5000/api/products', formData);
            navigate('/products');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to add product');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-cyan-600 mb-8">
                Add New Product
            </h1>

            <div className="glass-panel p-8">
                {error && <div className="bg-red-100 text-red-600 p-3 rounded-lg mb-6">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* Product Name */}
                    <div>
                        <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                            <Package size={18} className="text-emerald-500" /> Product Name
                        </label>
                        <input
                            type="text"
                            name="name"
                            required
                            placeholder="e.g. Milk, Bread, Paracetamol"
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-white/50"
                            onChange={handleChange}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Category */}
                        <div>
                            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                                <Tag size={18} className="text-emerald-500" /> Category
                            </label>
                            <select
                                name="category"
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-white/50"
                                onChange={handleChange}
                                value={formData.category}
                            >
                                <option value="Food">Food</option>
                                <option value="Medicine">Medicine</option>
                                <option value="Cosmetic">Cosmetic</option>
                                <option value="Stationery">Stationery</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        {/* Quantity */}
                        <div>
                            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                                <Hash size={18} className="text-emerald-500" /> Quantity
                            </label>
                            <input
                                type="number"
                                name="quantity"
                                min="1"
                                required
                                value={formData.quantity}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-white/50"
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Start Date */}
                        <div>
                            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                                <Calendar size={18} className="text-emerald-500" /> Purchase/Start Date
                            </label>
                            <input
                                type="date"
                                name="startDate"
                                required
                                value={formData.startDate}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-white/50"
                                onChange={handleChange}
                            />
                        </div>

                        {/* Expiry Date */}
                        <div>
                            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                                <Calendar size={18} className="text-red-500" /> Expiry Date
                            </label>
                            <input
                                type="date"
                                name="expiryDate"
                                required
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-red-400 bg-white/50"
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    {/* Price */}
                    <div>
                        <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                            <DollarSign size={18} className="text-emerald-500" /> Price (Optional)
                        </label>
                        <input
                            type="number"
                            name="price"
                            step="0.01"
                            placeholder="0.00"
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-white/50"
                            onChange={handleChange}
                        />
                    </div>

                    {/* Notes */}
                    <div>
                        <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                            <FileText size={18} className="text-emerald-500" /> Notes (Optional)
                        </label>
                        <textarea
                            name="notes"
                            rows="3"
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-white/50"
                            onChange={handleChange}
                        ></textarea>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-600 text-white font-bold text-lg hover:shadow-lg hover:scale-[1.01] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Saving...' : 'Save Product'}
                    </button>

                </form>
            </div>
        </div>
    );
}
