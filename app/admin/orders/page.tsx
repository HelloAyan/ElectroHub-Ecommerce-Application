'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Search, Eye, ChevronDown, Filter } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { fetchAllOrders, updateOrderStatus } from '@/store/slices/orderSlice';
import toast from 'react-hot-toast';

const ORDER_STATUSES = ['processing', 'confirmed', 'shipped', 'delivered', 'cancelled'];
const PAYMENT_STATUSES = ['pending', 'paid', 'failed', 'refunded'];

const STATUS_COLORS: Record<string, string> = {
  processing: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-blue-100 text-blue-700',
  shipped: 'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

const PAY_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  paid: 'bg-green-100 text-green-700',
  failed: 'bg-red-100 text-red-700',
  refunded: 'bg-gray-100 text-gray-700',
};

export default function AdminOrdersPage() {
  const dispatch = useAppDispatch();
  const { orders, loading } = useAppSelector(s => s.orders);
  const [filterStatus, setFilterStatus] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchAllOrders(filterStatus ? { status: filterStatus } : {}));
  }, [filterStatus]);

  const handleStatusUpdate = async (id: string, orderStatus: string) => {
    setUpdatingId(id);
    const result = await dispatch(updateOrderStatus({ id, orderStatus }));
    setUpdatingId(null);
    if (updateOrderStatus.fulfilled.match(result)) {
      toast.success('Order status updated');
    } else {
      toast.error('Failed to update order');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-gray-900">Orders</h2>
        <p className="text-gray-500 text-sm mt-1">{orders.length} orders found</p>
      </div>

      {/* Filters */}
      <div className="card p-4 flex flex-wrap gap-3 items-center">
        <Filter className="w-4 h-4 text-gray-400" />
        <span className="text-sm font-semibold text-gray-600">Filter:</span>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilterStatus('')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${filterStatus === '' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          >
            All
          </button>
          {ORDER_STATUSES.map(s => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition-colors ${filterStatus === s ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {['Order ID', 'Customer', 'Date', 'Total', 'Payment', 'Order Status', 'Actions'].map(h => (
                  <th key={h} className="text-left py-4 px-4 text-gray-500 font-semibold text-xs uppercase tracking-wide">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(8)].map((_, i) => (
                  <tr key={i} className="border-b border-gray-50">
                    <td colSpan={7} className="py-4 px-4">
                      <div className="h-10 bg-gray-100 rounded-lg animate-pulse" />
                    </td>
                  </tr>
                ))
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-gray-400">
                    No orders found
                  </td>
                </tr>
              ) : (
                orders.map((order: any) => (
                  <tr key={order._id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="py-3.5 px-4">
                      <span className="font-mono text-xs font-bold text-gray-700">
                        #{order._id.slice(-8).toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-medium text-gray-900 text-sm">{order.user?.name || 'N/A'}</p>
                      <p className="text-xs text-gray-400">{order.user?.email}</p>
                    </td>
                    <td className="py-3.5 px-4 text-gray-500 text-xs">
                      {new Date(order.createdAt).toLocaleDateString('en-BD', {
                        day: 'numeric', month: 'short', year: 'numeric'
                      })}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-gray-900">
                      ৳{order.totalPrice?.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`badge ${PAY_COLORS[order.paymentStatus] || 'bg-gray-100 text-gray-700'} capitalize`}>
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <select
                        value={order.orderStatus}
                        disabled={updatingId === order._id}
                        onChange={e => handleStatusUpdate(order._id, e.target.value)}
                        className={`text-xs font-semibold px-2.5 py-1.5 rounded-lg border-0 cursor-pointer focus:ring-2 focus:ring-blue-400 focus:outline-none capitalize ${STATUS_COLORS[order.orderStatus] || 'bg-gray-100 text-gray-700'}`}
                      >
                        {ORDER_STATUSES.map(s => (
                          <option key={s} value={s} className="bg-white text-gray-800 capitalize">{s}</option>
                        ))}
                      </select>
                    </td>
                    <td className="py-3.5 px-4">
                      <Link
                        href={`/admin/orders/${order._id}`}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors inline-flex"
                        title="View order"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
