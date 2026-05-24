'use client';
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingCart, Search, User, Menu, X, LogOut, Package, LayoutDashboard, ChevronDown, Zap } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { logout } from '@/store/slices/authSlice';
import { selectCartCount, toggleCart } from '@/store/slices/cartSlice';
import CartDrawer from './CartDrawer';
import toast from 'react-hot-toast';

const CATEGORIES = [
  { label: 'Mobiles', href: '/products?category=mobile' },
  { label: 'Laptops', href: '/products?category=laptop' },
  { label: 'Headphones', href: '/products?category=headphone' },
  { label: 'Tablets', href: '/products?category=tablet' },
  { label: 'Accessories', href: '/products?category=accessories' },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [catMenuOpen, setCatMenuOpen] = useState(false);
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(s => s.auth);
  const cartCount = useAppSelector(selectCartCount);
  const router = useRouter();
  const userMenuRef = useRef<HTMLDivElement>(null);

  const isStaff = user && ['admin', 'super_admin', 'moderator'].includes(user.role);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setMobileOpen(false);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    setUserMenuOpen(false);
    toast.success('Logged out successfully');
    router.push('/');
  };

  const handleCartClick = () => {
    if (!user) {
      toast.error('Please login to view your cart');
      router.push('/auth/login');
      return;
    }
    dispatch(toggleCart());
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-sm">
        {/* Top bar */}
        <div className="bg-gradient-to-r from-blue-700 to-blue-600 text-white text-xs py-1.5 text-center">
          <span>🚀 Free shipping on orders over ৳5,000 | Use code <strong>ELECTRO10</strong> for 10% off</span>
        </div>

        {/* Main header */}
        <div className="container-custom">
          <div className="flex items-center gap-4 py-3">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 flex-shrink-0">
              <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center">
                <Zap className="w-5 h-5 text-white fill-white" />
              </div>
              <span className="text-xl font-bold text-gray-900 hidden sm:block">
                Electro<span className="text-blue-600">Hub</span>
              </span>
            </Link>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex-1 max-w-xl hidden md:flex">
              <div className="relative w-full">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search mobiles, laptops, headphones..."
                  className="w-full pl-4 pr-12 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                />
                <button type="submit" className="absolute right-0 top-0 bottom-0 px-4 text-gray-400 hover:text-blue-600 transition-colors">
                  <Search className="w-4 h-4" />
                </button>
              </div>
            </form>

            {/* Right actions */}
            <div className="flex items-center gap-2 ml-auto">
              {/* Cart */}
              <button
                onClick={handleCartClick}
                className="relative p-2.5 rounded-xl hover:bg-gray-100 transition-colors"
                aria-label="Cart"
              >
                <ShoppingCart className="w-5 h-5 text-gray-700" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center font-bold animate-zoom-in">
                    {cartCount > 9 ? '9+' : cartCount}
                  </span>
                )}
              </button>

              {/* User Menu */}
              {user ? (
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 p-2 rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold text-blue-600">{user.name[0].toUpperCase()}</span>
                    </div>
                    <span className="text-sm font-medium text-gray-700 hidden lg:block max-w-[120px] truncate">{user.name}</span>
                    <ChevronDown className={`w-4 h-4 text-gray-400 hidden lg:block transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {userMenuOpen && (
                    <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 animate-slide-down">
                      <div className="px-4 py-2 border-b border-gray-100 mb-1">
                        <p className="text-sm font-semibold text-gray-900 truncate">{user.name}</p>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                        <span className="badge bg-blue-100 text-blue-700 mt-1 capitalize">{user.role.replace('_', ' ')}</span>
                      </div>
                      <Link href="/orders" onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                        <Package className="w-4 h-4" /> My Orders
                      </Link>
                      {isStaff && (
                        <Link href="/admin" onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-blue-600 hover:bg-blue-50 transition-colors font-medium">
                          <LayoutDashboard className="w-4 h-4" /> Admin Dashboard
                        </Link>
                      )}
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors w-full text-left"
                      >
                        <LogOut className="w-4 h-4" /> Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link href="/auth/login" className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors px-3 py-2 rounded-xl hover:bg-gray-100">
                    Login
                  </Link>
                  <Link href="/auth/register" className="btn-primary text-sm !py-2 !px-4 hidden sm:inline-flex">
                    Sign Up
                  </Link>
                </div>
              )}

              {/* Mobile menu toggle */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="p-2.5 rounded-xl hover:bg-gray-100 transition-colors md:hidden"
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Nav */}
          <nav className="hidden md:flex items-center gap-1 pb-2">
            <Link href="/products" className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
              All Products
            </Link>
            {CATEGORIES.map(c => (
              <Link key={c.href} href={c.href} className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
                {c.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white px-4 py-4 space-y-3 animate-slide-down">
            <form onSubmit={handleSearch}>
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="input-field pr-10 text-sm"
                />
                <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <Search className="w-4 h-4" />
                </button>
              </div>
            </form>
            <div className="space-y-1">
              {[{ label: 'All Products', href: '/products' }, ...CATEGORIES].map(c => (
                <Link key={c.href} href={c.href} onClick={() => setMobileOpen(false)}
                  className="block px-3 py-2 text-sm text-gray-700 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
                  {c.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </header>

      <CartDrawer />
    </>
  );
}
