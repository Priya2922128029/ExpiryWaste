import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Bell, LogOut, User } from 'lucide-react';

export default function Header() {
    const { user, logout } = useAuth();

    return (
        <header className="fixed top-0 left-0 right-0 z-50 glass-panel m-4 mt-2 px-6 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-tr from-emerald-400 to-cyan-500 rounded-lg flex items-center justify-center text-white font-bold">
                    E
                </div>
                <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-cyan-600">
                    ExpiryWaste
                </span>
            </div>

            <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
                <Link to="/" className="hover:text-emerald-600 transition-colors">Dashboard</Link>
                <Link to="/products" className="hover:text-emerald-600 transition-colors">Products</Link>
                <Link to="/add-product" className="hover:text-emerald-600 transition-colors">Add</Link>
                <Link to="/analytics" className="hover:text-emerald-600 transition-colors">Analytics</Link>
            </nav>

            <div className="flex items-center gap-4">
                <button className="relative p-2 rounded-full hover:bg-slate-100 transition-colors text-slate-600">
                    <Bell size={20} />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                </button>

                <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-semibold text-slate-800">{user?.name}</p>
                        <p className="text-xs text-slate-500 truncate max-w-[100px]">{user?.email}</p>
                    </div>
                    <button
                        onClick={logout}
                        className="p-2 rounded-full hover:bg-red-50 text-red-500 transition-colors"
                        title="Logout"
                    >
                        <LogOut size={20} />
                    </button>
                </div>
            </div>
        </header>
    );
}
