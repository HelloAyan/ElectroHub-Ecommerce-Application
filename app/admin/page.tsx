'use client';
import { useEffect, useState } from 'react';
import { Users, Package, ShoppingCart, DollarSign, TrendingUp, ArrowUpRight, Clock, CheckCircle } from 'lucide-react';
import api from '@/lib/api';
import Link from 'next/link';

interface Stats {
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
}

interface Order {
  _id: string;
  user: { name: string; email: string };
  totalPrice: number;
  orderStatus: string;
  paymentStatus: string;
  createdAt: string;
}

const STATUS_COLORS: Record<string, string> = {
  processing: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-blue-100 text-blue-700',
  shipped: 'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [monthlyRevenue, setMonthlyRevenue] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get('/admin/stats');
        setStats(data.data.stats);
        setRecentOrders(data.data.recentOrders);
        setMonthlyRevenue(data.data.monthlyRevenue);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const STAT_CARDS = [
    {
      label: 'Total Revenue',
      value: stats ? `৳${stats.totalRevenue.toLocaleString()}` : '—',
      icon: DollarSign,
      color: 'bg-emerald-50 text-emerald-600',
      change: '+12%',
    },
    {
      label: 'Total Orders',
      value: stats?.totalOrders ?? '—',
      icon: ShoppingCart,
      color: 'bg-blue-50 text-blue-600',
      change: '+8%',
    },
    {
      label: 'Total Products',
      value: stats?.totalProducts ?? '—',
      icon: Package,
      color: 'bg-purple-50 text-purple-600',
      change: '+3%',
    },
    {
      label: 'Total Users',
      value: stats?.totalUsers ?? '—',
      icon: Users,
      color: 'bg-orange-50 text-orange-600',
      change: '+15%',
    },
  ];

  const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

  // Build bar chart data
  const maxRevenue = Math.max(...monthlyRevenue.map(m => m.revenue), 1);

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div>
        <h2 className="text-2xl font-black text-gray-900">Dashboard Overview</h2>
        <p className="text-gray-500 mt-1">Welcome back! Here's what's happening with your store.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {STAT_CARDS.map(({ label, value, icon: Icon, color, change }) => (
          <div key={label} className="card p-6">
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${color}`}>
                <Icon className="w-6 h-6" />
              </div>
              <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
                <TrendingUp className="w-3 h-3" /> {change}
              </span>
            </div>
            {loading ? (
              <div className="space-y-2">
                <div className="h-8 bg-gray-200 rounded animate-pulse w-2/3" />
                <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2" />
              </div>
            ) : (
              <>
                <p className="text-2xl font-black text-gray-900">{value}</p>
                <p className="text-sm text-gray-500 mt-1">{label}</p>
              </>
            )}
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 card p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-gray-900">Monthly Revenue</h3>
            <span className="text-xs text-gray-500">Last 12 months</span>
          </div>
          {loading ? (
            <div className="h-48 bg-gray-100 rounded-xl animate-pulse" />
          ) : monthlyRevenue.length === 0 ? (
            <div className="h-48 flex items-center justify-center text-gray-400 text-sm">
              No revenue data yet
            </div>
          ) : (
            <div className="flex items-end gap-2 h-48">
              {monthlyRevenue.map((m, i) => {
                const height = Math.max((m.revenue / maxRevenue) * 100, 4);
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                    <div
                      className="w-full bg-blue-600 rounded-t-lg hover:bg-blue-700 transition-colors cursor-pointer relative group"
                      style={{ height: `${height}%` }}
                    >
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap transition-opacity pointer-events-none z-10">
                        ৳{m.revenue.toLocaleString()}
                      </div>
                    </div>
                    <span className="text-xs text-gray-400">{MONTHS[(m._id.month - 1)]}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="card p-6">
          <h3 className="font-bold text-gray-900 mb-5">Quick Actions</h3>
          <div className="space-y-3">
            {[
              { label: 'Add New Product', href: '/admin/products/new', color: 'bg-blue-600 hover:bg-blue-700 text-white' },
              { label: 'View All Orders', href: '/admin/orders', color: 'bg-purple-600 hover:bg-purple-700 text-white' },
              { label: 'Manage Users', href: '/admin/users', color: 'bg-emerald-600 hover:bg-emerald-700 text-white' },
              { label: 'Role Management', href: '/admin/roles', color: 'bg-orange-600 hover:bg-orange-700 text-white' },
            ].map(({ label, href, color }) => (
              <Link key={href} href={href}
                className={`flex items-center justify-between px-4 py-3 rounded-xl font-semibold text-sm transition-colors ${color}`}>
                {label}
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-bold text-gray-900">Recent Orders</h3>
          <Link href="/admin/orders" className="text-blue-600 text-sm font-medium hover:underline flex items-center gap-1">
            View All <ArrowUpRight className="w-3 h-3" />
          </Link>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-100 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : recentOrders.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-8">No orders yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-3 px-2 text-gray-500 font-semibold text-xs uppercase">Order ID</th>
                  <th className="text-left py-3 px-2 text-gray-500 font-semibold text-xs uppercase">Customer</th>
                  <th className="text-left py-3 px-2 text-gray-500 font-semibold text-xs uppercase hidden sm:table-cell">Date</th>
                  <th className="text-left py-3 px-2 text-gray-500 font-semibold text-xs uppercase">Total</th>
                  <th className="text-left py-3 px-2 text-gray-500 font-semibold text-xs uppercase">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order._id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-2">
                      <Link href={`/admin/orders/${order._id}`} className="font-mono text-blue-600 hover:underline text-xs">
                        #{order._id.slice(-8).toUpperCase()}
                      </Link>
                    </td>
                    <td className="py-3 px-2">
                      <p className="font-medium text-gray-900 truncate max-w-[120px]">{order.user?.name}</p>
                      <p className="text-xs text-gray-400 truncate max-w-[120px]">{order.user?.email}</p>
                    </td>
                    <td className="py-3 px-2 text-gray-500 hidden sm:table-cell">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-2 font-bold text-gray-900">৳{order.totalPrice?.toLocaleString()}</td>
                    <td className="py-3 px-2">
                      <span className={`badge ${STATUS_COLORS[order.orderStatus] || 'bg-gray-100 text-gray-700'} capitalize`}>
                        {order.orderStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
