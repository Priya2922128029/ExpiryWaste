import { Outlet } from 'react-router-dom';
import Header from './Header';

export default function Layout() {
    return (
        <div className="min-h-screen bg-slate-50 pt-24 px-4 pb-12">
            <Header />
            <main className="max-w-7xl mx-auto">
                <Outlet />
            </main>
        </div>
    );
}
