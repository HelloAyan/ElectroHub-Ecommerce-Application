'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard, Package, ShoppingCart, Users, Settings,
  LogOut, Menu, X, Zap, ChevronRight, Shield
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { logout } from '@/store/slices/authSlice';
import toast from 'react-hot-toast';

const NAV_ITEMS = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, roles: ['admin', 'super_admin', 'moderator'] },
  { href: '/admin/products', label: 'Products', icon: Package, roles: ['admin', 'super_admin', 'moderator'] },
  { href: '/admin/orders', label: 'Orders', icon: ShoppingCart, roles: ['admin', 'super_admin'] },
  { href: '/admin/users', label: 'Users', icon: Users, roles: ['admin', 'super_admin'] },
  { href: '/admin/roles', label: 'Role Management', icon: Shield, roles: ['super_admin'] },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(s => s.auth);

  useEffect(() => {
    if (!user) {
      router.replace('/auth/login');
      return;
    }
    if (!['admin', 'super_admin', 'moderator'].includes(user.role)) {
      toast.error('Access denied. Admin only area.');
      router.replace('/');
    }
  }, [user]);

  if (!user || !['admin', 'super_admin', 'moderator'].includes(user.role)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Verifying access...</p>
        </div>
      </div>
    );
  }

  const allowedNav = NAV_ITEMS.filter(item => item.roles.includes(user.role));

  const handleLogout = () => {
    dispatch(logout());
    toast.success('Logged out');
    router.push('/');
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-6 border-b border-slate-700">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-9 h-9 bg-blue-500 rounded-xl flex items-center justify-center">
            <Zap className="w-5 h-5 text-white fill-white" />
          </div>
          <div>
            <span className="text-lg font-black text-white">Electro<span className="text-blue-400">Hub</span></span>
            <p className="text-xs text-slate-400">Admin Panel</p>
          </div>
        </Link>
      </div>

      {/* User info */}
      <div className="p-4 border-b border-slate-700">
        <div className="flex items-center gap-3 p-3 bg-slate-700/50 rounded-xl">
          <div className="w-9 h-9 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-sm font-bold text-white">{user.name[0].toUpperCase()}</span>
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-white truncate">{user.name}</p>
            <p className="text-xs text-slate-400 capitalize">{user.role.replace('_', ' ')}</p>
          </div>
        </div>
      </div>

      {/* Nav items */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 mb-3">Navigation</p>
        {allowedNav.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href || (href !== '/admin' && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                isActive
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25'
                  : 'text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span className="flex-1">{label}</span>
              {isActive && <ChevronRight className="w-3 h-3 opacity-70" />}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-700 space-y-1">
        <Link href="/" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-300 hover:bg-slate-700 hover:text-white transition-all">
          <Zap className="w-4 h-4" />
          View Store
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 bg-slate-900 flex-col fixed inset-y-0 left-0 z-40">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
          <aside className="fixed left-0 top-0 bottom-0 w-72 bg-slate-900 z-50 lg:hidden flex flex-col animate-slide-up">
            <SidebarContent />
          </aside>
        </>
      )}

      {/* Main content */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-100 px-4 md:px-8 py-4 flex items-center gap-4 sticky top-0 z-30 shadow-sm">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-xl hover:bg-gray-100 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <h1 className="text-lg font-bold text-gray-900">
              {allowedNav.find(n => n.href === pathname || (n.href !== '/admin' && pathname.startsWith(n.href)))?.label || 'Admin'}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="badge bg-blue-100 text-blue-700 capitalize hidden sm:inline-flex">
              {user.role.replace('_', ' ')}
            </span>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
