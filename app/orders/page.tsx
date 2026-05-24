'use client';
import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Package, Clock, CheckCircle, Truck, XCircle, ArrowRight } from 'lucide-react';
import StoreLayout from '@/components/layout/StoreLayout';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { fetchMyOrders } from '@/store/slices/orderSlice';

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: any }> = {
  processing: { label: 'Processing', color: 'bg-yellow-100 text-yellow-700', icon: Clock },
  confirmed: { label: 'Confirmed', color: 'bg-blue-100 text-blue-700', icon: CheckCircle },
  shipped: { label: 'Shipped', color: 'bg-purple-100 text-purple-700', icon: Truck },
  delivered: { label: 'Delivered', color: 'bg-green-100 text-green-700', icon: CheckCircle },
  cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-700', icon: XCircle },
};

const PAYMENT_CONFIG: Record<string, { label: string; color: string }> = {
  pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-700' },
  paid: { label: 'Paid', color: 'bg-green-100 text-green-700' },
  failed: { label: 'Failed', color: 'bg-red-100 text-red-700' },
  refunded: { label: 'Refunded', color: 'bg-gray-100 text-gray-700' },
};

export default function OrdersPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { orders, loading } = useAppSelector(s => s.orders);
  const user = useAppSelector(s => s.auth.user);

  useEffect(() => {
    if (!user) { router.push('/auth/login'); return; }
    dispatch(fetchMyOrders());
  }, [user]);

  return (
    <StoreLayout>
      <div className="container-custom py-10">
        <div className="flex items-center gap-3 mb-8">
          <Package className="w-7 h-7 text-blue-600" />
          <h1 className="text-2xl font-black text-gray-900">My Orders</h1>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="card p-6 animate-pulse">
                <div className="h-5 bg-gray-200 rounded w-1/4 mb-3" />
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2" />
                <div className="h-4 bg-gray-200 rounded w-1/3" />
              </div>
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-20">
            <Package className="w-20 h-20 text-gray-200 mx-auto mb-5" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">No orders yet</h2>
            <p className="text-gray-500 mb-8">Start shopping to see your orders here</p>
            <Link href="/products" className="btn-primary">Browse Products</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order: any) => {
              const statusConf = STATUS_CONFIG[order.orderStatus] || STATUS_CONFIG.processing;
              const payConf = PAYMENT_CONFIG[order.paymentStatus] || PAYMENT_CONFIG.pending;
              const StatusIcon = statusConf.icon;

              return (
                <div key={order._id} className="card p-6 hover:shadow-md transition-shadow">
                  <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Order ID</p>
                      <p className="font-mono text-sm font-bold text-gray-900">#{order._id.slice(-8).toUpperCase()}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`badge ${statusConf.color} flex items-center gap-1`}>
                        <StatusIcon className="w-3 h-3" /> {statusConf.label}
                      </span>
                      <span className={`badge ${payConf.color}`}>{payConf.label}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {order.orderItems?.slice(0, 3).map((item: any) => (
                      <span key={item._id} className="text-sm text-gray-700 bg-gray-50 px-3 py-1 rounded-lg">
                        {item.name} x{item.quantity}
                      </span>
                    ))}
                    {order.orderItems?.length > 3 && (
                      <span className="text-sm text-gray-500">+{order.orderItems.length - 3} more</span>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6 text-sm text-gray-500">
                      <span>{new Date(order.createdAt).toLocaleDateString('en-BD', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                      <span className="font-bold text-gray-900">৳{order.totalPrice?.toLocaleString()}</span>
                    </div>
                    <Link href={`/orders/${order._id}`}
                      className="flex items-center gap-1 text-blue-600 font-medium text-sm hover:gap-2 transition-all">
                      View Details <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </StoreLayout>
  );
}
