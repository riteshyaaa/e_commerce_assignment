import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingBag, Search, Menu, X, Shield, ArrowRight, Sparkles, Truck } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../common/Button';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const { itemCount, openCart } = useCart();
  const { isAuthenticated } = useAuth();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setMobileMenuOpen(false);
    }
  };

  const navLinks = [
    { name: 'Shop All', href: '/products' },
    { name: 'Audio', href: '/products?category=audio' },
    { name: 'Watches', href: '/products?category=wearables-and-watches' },
    { name: 'Bags & Travel', href: '/products?category=bags-and-travel' },
    { name: 'Footwear', href: '/products?category=footwear' },
    { name: 'Everyday', href: '/products?category=lifestyle-and-everyday' },
  ];

  return (
    <>
      {/* Top Announcement Bar */}
      <div className="bg-zinc-950 text-zinc-300 text-xs py-2 px-4 text-center font-medium tracking-wide flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-accent-400 shrink-0" />
        <span>Complimentary Express Delivery on orders over ₹2,999 • 30-Day Risk-Free Returns</span>
      </div>

      {/* Main Sticky Glass Header */}
      <header className="sticky top-0 z-40 w-full bg-white/85 backdrop-blur-md border-b border-zinc-200/80 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-18">
            {/* Left: Mobile Menu Button & Brand Logo */}
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden p-2 rounded-xl text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 transition-colors"
                aria-label="Open mobile menu"
              >
                <Menu className="w-5 h-5" />
              </button>

              <Link to="/" className="flex items-center gap-2.5 group">
                <div className="w-9 h-9 rounded-xl bg-zinc-900 text-white flex items-center justify-center font-display font-extrabold text-lg shadow-sm group-hover:bg-zinc-800 transition-colors">
                  N
                </div>
                <div className="flex flex-col">
                  <span className="font-display font-extrabold text-xl tracking-tight text-zinc-900 leading-none">
                    NOVA
                  </span>
                  <span className="text-[10px] font-semibold text-zinc-400 tracking-widest uppercase mt-0.5">
                    Modern Essentials
                  </span>
                </div>
              </Link>
            </div>

            {/* Middle: Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-7">
              {navLinks.map((link) => {
                const isActive = location.pathname + location.search === link.href;
                return (
                  <Link
                    key={link.name}
                    to={link.href}
                    className={`text-sm font-medium transition-colors hover:text-zinc-900 ${
                      isActive ? 'text-zinc-900 font-semibold' : 'text-zinc-600'
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </nav>

            {/* Right: Actions (Search, Track Order, Admin, Cart) */}
            <div className="flex items-center gap-2">
              {/* Search Modal Trigger */}
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2.5 rounded-xl text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 transition-colors flex items-center gap-2"
                aria-label="Search catalog"
              >
                <Search className="w-5 h-5" />
                <span className="hidden md:inline text-xs text-zinc-400 font-medium bg-zinc-100 border border-zinc-200 px-2 py-0.5 rounded-md">
                  Search...
                </span>
              </button>

              {/* Track Order Direct Link */}
              <Link
                to="/track-order"
                className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-zinc-700 hover:text-zinc-900 hover:bg-zinc-100 border border-zinc-200 transition-colors"
              >
                <Truck className="w-3.5 h-3.5 text-zinc-500" />
                <span>Track Order</span>
              </Link>

              {/* Admin Portal Link */}
              <Link
                to={isAuthenticated ? '/admin/dashboard' : '/admin/login'}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-zinc-700 hover:text-zinc-900 hover:bg-zinc-100 border border-zinc-200 transition-colors"
              >
                <Shield className="w-3.5 h-3.5 text-zinc-500" />
                <span>{isAuthenticated ? 'Dashboard' : 'Admin'}</span>
              </Link>

              {/* Shopping Bag Button with Counter Badge */}
              <button
                onClick={openCart}
                className="relative p-2.5 rounded-xl bg-zinc-900 text-white hover:bg-zinc-800 transition-all flex items-center justify-center shadow-sm"
                aria-label={`Shopping bag with ${itemCount} items`}
              >
                <ShoppingBag className="w-4 h-4" />
                {itemCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-accent-600 text-white text-[10px] font-bold flex items-center justify-center shadow-sm animate-pulse">
                    {itemCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Global Search Overlay Modal */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-zinc-950/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-zinc-200 overflow-hidden animate-in zoom-in-95 duration-150">
            <form onSubmit={handleSearchSubmit} className="p-4 border-b border-zinc-100 flex items-center gap-3">
              <Search className="w-5 h-5 text-zinc-400 shrink-0" />
              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search watches, backpacks, headphones, sneakers..."
                className="w-full text-base bg-transparent border-none focus:outline-none text-zinc-900 placeholder:text-zinc-400"
              />
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="p-1 rounded-lg text-zinc-400 hover:text-zinc-700"
              >
                <X className="w-5 h-5" />
              </button>
            </form>
            <div className="p-4 bg-zinc-50/50 text-xs text-zinc-500 flex items-center justify-between">
              <span>Popular searches: <button type="button" onClick={() => { setSearchQuery('Headphones'); }} className="text-zinc-900 hover:underline font-medium ml-1">Headphones</button>, <button type="button" onClick={() => { setSearchQuery('Backpack'); }} className="text-zinc-900 hover:underline font-medium ml-1">Backpack</button>, <button type="button" onClick={() => { setSearchQuery('Watch'); }} className="text-zinc-900 hover:underline font-medium ml-1">Watch</button></span>
              <span className="hidden sm:inline">Press ESC to dismiss</span>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-zinc-950/60 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white shadow-2xl p-6 z-10">
            <div className="flex items-center justify-between pb-6 border-b border-zinc-100">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2"
              >
                <div className="w-8 h-8 rounded-lg bg-zinc-900 text-white flex items-center justify-center font-display font-bold text-base">
                  N
                </div>
                <span className="font-display font-bold text-lg text-zinc-900">NOVA</span>
              </Link>

              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-xl text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex-1 py-6 flex flex-col gap-1 overflow-y-auto">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-3 rounded-xl text-base font-medium text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900 transition-colors flex items-center justify-between"
                >
                  <span>{link.name}</span>
                  <ArrowRight className="w-4 h-4 text-zinc-400" />
                </Link>
              ))}
            </nav>

            <div className="pt-6 border-t border-zinc-100 flex flex-col gap-3">
              <Link
                to="/track-order"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-2.5 px-4 rounded-xl border border-zinc-200 text-sm font-semibold text-zinc-800 text-center flex items-center justify-center gap-2 hover:bg-zinc-50 transition-colors"
              >
                <Truck className="w-4 h-4 text-zinc-500" />
                <span>Track Your Order</span>
              </Link>
              <Link
                to={isAuthenticated ? '/admin/dashboard' : '/admin/login'}
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-2.5 px-4 rounded-xl border border-zinc-200 text-sm font-semibold text-zinc-800 text-center flex items-center justify-center gap-2 hover:bg-zinc-50 transition-colors"
              >
                <Shield className="w-4 h-4 text-zinc-500" />
                {isAuthenticated ? 'Admin Dashboard' : 'Admin Portal Login'}
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
