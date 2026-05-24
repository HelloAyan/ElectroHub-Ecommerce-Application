'use client';
import { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, MapPin, CreditCard, Package } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { fetchOrder, updateOrderStatus } from '@/store/slices/orderSlice';
import toast from 'react-hot-toast';

const ORDER_STATUSES = ['processing', 'confirmed', 'shipped', 'delivered', 'cancelled'];
const PAYMENT_STATUSES = ['pending', 'paid', 'failed', 'refunded'];

export default function AdminOrderDetailPage({ params }: { params: { id: string } }) {
  const dispatch = useAppDispatch();
  const { order, loading } = useAppSelector(s => s.orders);

  useEffect(() => {
    dispatch(fetchOrder(params.id));
  }, [params.id]);

  const handleUpdate = async (field: string, value: string) => {
    const result = await dispatch(updateOrderStatus({ id: params.id, [field]: value }));
    if (updateOrderStatus.fulfilled.match(result)) {
      toast.success('Order updated');
    } else {
      toast.error('Failed to update');
    }
  };

  if (loading || !order) {
    return (
      <div className="space-y-4 animate-pulse max-w-4xl">
        <div className="h-8 bg-gray-200 rounded w-48" />
        <div className="card p-6 h-40" />
        <div className="card p-6 h-40" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/orders" className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h2 className="text-xl font-black text-gray-900">Order #{order._id?.slice(-8).toUpperCase()}</h2>
          <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleString()}</p>
        </div>
      </div>

      {/* Status Controls */}
      <div className="card p-6">
        <h3 className="font-bold text-gray-900 mb-4">Update Order Status</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-semibold text-gray-600 mb-2 block">Order Status</label>
            <select
              value={order.orderStatus}
              onChange={e => handleUpdate('orderStatus', e.target.value)}
              className="input-field capitalize"
            >
              {ORDER_STATUSES.map(s => <option key={s} value={s} className="capitalize">{s}</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-600 mb-2 block">Payment Status</label>
            <select
              value={order.paymentStatus}
              onChange={e => handleUpdate('paymentStatus', e.target.value)}
              className="input-field capitalize"
            >
              {PAYMENT_STATUSES.map(s => <option key={s} value={s} className="capitalize">{s}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Customer & Shipping */}
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-gray-900">Shipping Details</h3>
          </div>
          <div className="space-y-1.5 text-sm">
            <p className="font-semibold text-gray-900">{order.shippingAddress?.fullName}</p>
            <p className="text-gray-600">{order.shippingAddress?.address}</p>
            <p className="text-gray-600">{order.shippingAddress?.city}, {order.shippingAddress?.postalCode}</p>
            <p className="text-gray-600">{order.shippingAddress?.country}</p>
            <p className="text-blue-600 font-medium">{order.shippingAddress?.phone}</p>
          </div>
          {order.user && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Customer</p>
              <p className="font-semibold text-sm text-gray-900">{order.user.name}</p>
              <p className="text-xs text-gray-400">{order.user.email}</p>
            </div>
          )}
        </div>

        {/* Payment */}
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-4">
            <CreditCard className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-gray-900">Payment Details</h3>
          </div>
          <div className="space-y-2.5 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Method</span>
              <span className="font-medium">{order.paymentMethod}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Items</span>
              <span className="font-medium">৳{order.itemsPrice?.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Shipping</span>
              <span className="font-medium">{order.shippingPrice === 0 ? 'FREE' : `৳${order.shippingPrice}`}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Tax</span>
              <span className="font-medium">৳{order.taxPrice?.toLocaleString()}</span>
            </div>
            <div className="flex justify-between border-t border-gray-100 pt-2">
              <span className="font-bold text-gray-900">Total</span>
              <span className="font-black text-blue-600">৳{order.totalPrice?.toLocaleString()}</span>
            </div>
            {order.paidAt && (
              <p className="text-xs text-green-600">Paid on: {new Date(order.paidAt).toLocaleDateString()}</p>
            )}
            {order.transactionId && (
              <p className="text-xs text-gray-400 font-mono">TXN: {order.transactionId}</p>
            )}
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div className="card p-6">
        <div className="flex items-center gap-2 mb-4">
          <Package className="w-5 h-5 text-blue-600" />
          <h3 className="font-bold text-gray-900">Order Items ({order.orderItems?.length})</h3>
        </div>
        <div className="space-y-3">
          {order.orderItems?.map((item: any) => (
            <div key={item._id} className="flex gap-3 items-center py-3 border-b border-gray-100 last:border-0">
              <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-gray-50 border border-gray-100 flex-shrink-0">
                <Image
                  src={item.image || 'https://via.placeholder.com/56'}
                  alt={item.name}
                  fill
                  className="object-contain p-1"
                  sizes="56px"
                  onError={(e: any) => { e.target.src = 'https://via.placeholder.com/56'; }}
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 text-sm truncate">{item.name}</p>
                <p className="text-xs text-gray-500">Qty: {item.quantity} × ৳{item.price?.toLocaleString()}</p>
              </div>
              <span className="font-bold text-gray-900 text-sm flex-shrink-0">
                ৳{(item.price * item.quantity)?.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
