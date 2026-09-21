import React, { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Layers,
  Store,
  FileCode2,
  LogOut,
  Menu,
  X,
  ShieldCheck,
  ChevronRight,
  User,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../common/Button';

export const AdminLayout: React.FC = () => {
  const { admin, isAuthenticated, isLoading, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Route protection
  React.useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/admin/login', { replace: true, state: { from: location } });
    }
  }, [isLoading, isAuthenticated, navigate, location]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-900 text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-accent-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-medium text-zinc-400">Verifying administrator session...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const navItems = [
    {
      name: 'Overview & KPIs',
      href: '/admin/dashboard',
      icon: LayoutDashboard,
    },
    {
      name: 'Products Management',
      href: '/admin/products',
      icon: Package,
    },
    {
      name: 'Categories',
      href: '/admin/categories',
      icon: Layers,
    },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col md:flex-row">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-zinc-900/90 backdrop-blur-xl border-r border-zinc-800/80 flex flex-col transition-transform duration-300 md:translate-x-0 md:static ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="p-6 border-b border-zinc-800/80 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-xl bg-white text-zinc-950 flex items-center justify-center font-display font-extrabold text-base">
              N
            </div>
            <div>
              <div className="font-display font-bold text-base text-white leading-none">NOVA</div>
              <div className="text-[10px] font-semibold text-accent-400 tracking-wider uppercase mt-0.5">
                Admin Console
              </div>
            </div>
          </Link>

          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden p-1.5 rounded-lg text-zinc-400 hover:text-white"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 px-3 py-2">
            Management
          </div>
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              end={item.href === '/admin/dashboard'}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                  isActive
                    ? 'bg-accent-600/15 text-accent-400 border border-accent-500/20'
                    : 'text-zinc-400 hover:bg-zinc-800/60 hover:text-white'
                }`
              }
            >
              <item.icon className="w-4 h-4 shrink-0" />
              <span>{item.name}</span>
            </NavLink>
          ))}

          <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 px-3 pt-6 pb-2">
            Store & Docs
          </div>

          <Link
            to="/"
            className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold text-zinc-400 hover:bg-zinc-800/60 hover:text-white transition-colors"
          >
            <div className="flex items-center gap-3">
              <Store className="w-4 h-4 shrink-0" />
              <span>Storefront</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-zinc-600" />
          </Link>

          <a
            href="http://localhost:5000/docs"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold text-zinc-400 hover:bg-zinc-800/60 hover:text-white transition-colors"
          >
            <div className="flex items-center gap-3">
              <FileCode2 className="w-4 h-4 shrink-0 text-sky-400" />
              <span>Swagger API Docs</span>
            </div>
            <span className="text-[10px] bg-zinc-800 px-1.5 py-0.5 rounded text-zinc-400 font-mono">
              /docs
            </span>
          </a>
        </div>

        {/* User Card & Logout */}
        <div className="p-4 border-t border-zinc-800/80 bg-zinc-950/40">
          <div className="flex items-center gap-3 mb-3 px-2">
            <div className="w-9 h-9 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-accent-400 shrink-0">
              <User className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-bold text-white truncate">{admin?.name || 'Admin'}</div>
              <div className="text-[11px] text-zinc-500 truncate">{admin?.email}</div>
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={logout}
            leftIcon={<LogOut className="w-3.5 h-3.5 text-red-400" />}
            className="w-full text-zinc-400 hover:text-red-300 hover:bg-red-950/30 justify-start"
          >
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="h-16 bg-zinc-900/60 backdrop-blur-md border-b border-zinc-800/80 flex items-center justify-between px-6 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800"
              aria-label="Open sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-xs text-zinc-400">
              <span>Admin Console</span>
              <ChevronRight className="w-3 h-3 text-zinc-600" />
              <span className="text-white font-medium capitalize">
                {location.pathname.replace('/admin/', '').replace('/', '') || 'Overview'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin Session Active</span>
            </div>

            <Link to="/">
              <Button variant="outline" size="sm" className="text-zinc-300 border-zinc-700 hover:bg-zinc-800">
                View Store
              </Button>
            </Link>
          </div>
        </header>

        {/* Page Outlet */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
