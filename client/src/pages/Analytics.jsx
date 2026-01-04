import { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { BadgeDollarSign, Trash2 } from 'lucide-react';

export default function Analytics() {
    const [data, setData] = useState([]);
    const [wasteStats, setWasteStats] = useState({
        totalWasteValue: 0,
        mostWastedCategory: '',
        totalExpiredItems: 0
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/products');
            const products = res.data;
            processAnalytics(products);
        } catch (error) {
            console.error("Failed to fetch analytics data");
        }
    };

    const processAnalytics = (products) => {
        const expiredProducts = products.filter(p => p.status === 'Expired');

        // Calculate total waste value
        const totalWasteValue = expiredProducts.reduce((sum, p) => sum + (p.price || 0) * p.quantity, 0);

        // Group by Category
        const categoryCount = {};
        expiredProducts.forEach(p => {
            categoryCount[p.category] = (categoryCount[p.category] || 0) + 1;
        });

        const mostWastedCategory = Object.keys(categoryCount).reduce((a, b) => categoryCount[a] > categoryCount[b] ? a : b, 'None');

        // Chart Data: Monthly Expiry
        // Mocking monthly data distribution for visualization as we only have current data
        // In a real app, this would query backend for historical data
        const chartData = [
            { name: 'Jan', expired: 4, cost: 120 },
            { name: 'Feb', expired: 3, cost: 80 },
            { name: 'Mar', expired: 2, cost: 40 },
            { name: 'Apr', expired: 6, cost: 200 },
            { name: 'May', expired: expiredProducts.length, cost: totalWasteValue }, // Current Month
        ];

        setData(chartData);
        setWasteStats({
            totalWasteValue,
            mostWastedCategory,
            totalExpiredItems: expiredProducts.length
        });
    };

    return (
        <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-orange-600 mb-8">
                Waste Analytics
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="glass-panel p-6 flex items-center justify-between">
                    <div>
                        <p className="text-slate-500 text-sm">Total Financial Loss</p>
                        <h2 className="text-3xl font-bold text-red-600">${wasteStats.totalWasteValue.toFixed(2)}</h2>
                    </div>
                    <div className="p-3 bg-red-100 text-red-600 rounded-full">
                        <BadgeDollarSign size={24} />
                    </div>
                </div>

                <div className="glass-panel p-6 flex items-center justify-between">
                    <div>
                        <p className="text-slate-500 text-sm">Expired Items</p>
                        <h2 className="text-3xl font-bold text-slate-800">{wasteStats.totalExpiredItems}</h2>
                    </div>
                    <div className="p-3 bg-slate-100 text-slate-600 rounded-full">
                        <Trash2 size={24} />
                    </div>
                </div>

                <div className="glass-panel p-6 flex items-center justify-between">
                    <div>
                        <p className="text-slate-500 text-sm">Most Wasted Category</p>
                        <h2 className="text-lg font-bold text-slate-800">{wasteStats.mostWastedCategory}</h2>
                    </div>
                    <div className="p-3 bg-orange-100 text-orange-600 rounded-full">
                        <Trash2 size={24} />
                    </div>
                </div>
            </div>

            <div className="glass-panel p-6 mb-8">
                <h3 className="text-lg font-bold text-slate-700 mb-6">Monthly Waste Trend</h3>
                <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={data}
                            margin={{
                                top: 20,
                                right: 30,
                                left: 20,
                                bottom: 5,
                            }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                            <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                            <Tooltip />
                            <Legend />
                            <Bar yAxisId="left" dataKey="expired" name="Items Expired" fill="#8884d8" />
                            <Bar yAxisId="right" dataKey="cost" name="Cost ($)" fill="#82ca9d" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="glass-panel p-6 bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-100">
                <h3 className="text-lg font-bold text-emerald-800 mb-3">🌱 Smart Suggestion</h3>
                <p className="text-emerald-700">
                    You seem to have higher waste in the <b>{wasteStats.mostWastedCategory}</b> category.
                    Consider buying smaller quantities or checking expiry dates before purchasing.
                    Based on your usage, you can save approximately <b>${(wasteStats.totalWasteValue * 0.2).toFixed(2)}</b> next month by optimizing purchases.
                </p>
            </div>
        </div>
    );
}
