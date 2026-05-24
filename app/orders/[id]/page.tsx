'use client';
import { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Package, CheckCircle, Truck, Clock, MapPin, CreditCard } from 'lucide-react';
import StoreLayout from '@/components/layout/StoreLayout';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { fetchOrder, initiatePayment } from '@/store/slices/orderSlice';
import toast from 'react-hot-toast';

export default function OrderDetailPage({ params }: { params: { id: string } }) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { order, loading } = useAppSelector(s => s.orders);
  const user = useAppSelector(s => s.auth.user);

  useEffect(() => {
    if (!user) { router.push('/auth/login'); return; }
    dispatch(fetchOrder(params.id));
    if (searchParams.get('payment') === 'success') {
      toast.success('Payment successful! Your order is confirmed.');
    }
  }, [params.id, user]);

  const handleRetryPayment = async () => {
    const result = await dispatch(initiatePayment(params.id));
    if (initiatePayment.fulfilled.match(result) && result.payload.url) {
      window.location.href = result.payload.url;
    } else {
      toast.error('Failed to initiate payment');
    }
  };

  if (loading || !order) return (
    <StoreLayout>
      <div className="container-custom py-10">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-48" />
          <div className="card p-6 space-y-3">
            <div className="h-5 bg-gray-200 rounded w-1/3" />
            <div className="h-4 bg-gray-200 rounded w-1/2" />
            <div className="h-4 bg-gray-200 rounded w-1/4" />
          </div>
        </div>
      </div>
    </StoreLayout>
  );

  const isPaid = order.paymentStatus === 'paid';
  const isDelivered = order.orderStatus === 'delivered';

  const steps = [
    { key: 'processing', label: 'Order Placed', icon: Package },
    { key: 'confirmed', label: 'Confirmed', icon: CheckCircle },
    { key: 'shipped', label: 'Shipped', icon: Truck },
    { key: 'delivered', label: 'Delivered', icon: CheckCircle },
  ];
  const stepOrder = ['processing', 'confirmed', 'shipped', 'delivered'];
  const currentStep = stepOrder.indexOf(order.orderStatus);

  return (
    <StoreLayout>
      <div className="container-custom py-10 max-w-4xl">
        <div className="flex items-center gap-3 mb-8">
          <Link href="/orders" className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-black text-gray-900">Order Details</h1>
            <p className="text-sm text-gray-500 font-mono">#{order._id?.slice(-8).toUpperCase()}</p>
          </div>
        </div>

        {/* Payment success banner */}
        {searchParams.get('payment') === 'success' && (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-4 mb-6 flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
            <div>
              <p className="font-semibold text-green-800">Payment Successful!</p>
              <p className="text-sm text-green-600">Your order has been confirmed and will be shipped soon.</p>
            </div>
          </div>
        )}

        {/* Retry payment if unpaid */}
        {!isPaid && order.orderStatus !== 'cancelled' && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 mb-6 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <CreditCard className="w-6 h-6 text-yellow-600 flex-shrink-0" />
              <p className="text-sm font-medium text-yellow-800">Payment pending for this order</p>
            </div>
            <button onClick={handleRetryPayment} className="btn-primary !py-2 !px-4 text-sm">
              Pay Now
            </button>
          </div>
        )}

        {/* Order Progress */}
        {order.orderStatus !== 'cancelled' && (
          <div className="card p-6 mb-6">
            <h2 className="font-bold text-gray-900 mb-6">Order Progress</h2>
            <div className="flex items-center justify-between relative">
              <div className="absolute top-4 left-0 right-0 h-0.5 bg-gray-200 -z-0" />
              <div
                className="absolute top-4 left-0 h-0.5 bg-blue-600 -z-0 transition-all duration-500"
                style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
              />
              {steps.map((step, i) => {
                const Icon = step.icon;
                const done = i <= currentStep;
                return (
                  <div key={step.key} className="flex flex-col items-center gap-2 relative z-10">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors ${done ? 'bg-blue-600 border-blue-600' : 'bg-white border-gray-200'}`}>
                      <Icon className={`w-4 h-4 ${done ? 'text-white' : 'text-gray-300'}`} />
                    </div>
                    <span className={`text-xs font-medium text-center ${done ? 'text-blue-600' : 'text-gray-400'}`}>{step.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Shipping Address */}
          <div className="card p-5">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="w-5 h-5 text-blue-600" />
              <h2 className="font-bold text-gray-900">Shipping Address</h2>
            </div>
            <div className="space-y-1 text-sm text-gray-700">
              <p className="font-semibold">{order.shippingAddress?.fullName}</p>
              <p>{order.shippingAddress?.address}</p>
              <p>{order.shippingAddress?.city}, {order.shippingAddress?.postalCode}</p>
              <p>{order.shippingAddress?.country}</p>
              <p>{order.shippingAddress?.phone}</p>
            </div>
          </div>

          {/* Payment Info */}
          <div className="card p-5">
            <div className="flex items-center gap-2 mb-4">
              <CreditCard className="w-5 h-5 text-blue-600" />
              <h2 className="font-bold text-gray-900">Payment Information</h2>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Method</span>
                <span className="font-medium">{order.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Status</span>
                <span className={`badge ${isPaid ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                  {isPaid ? 'Paid' : 'Pending'}
                </span>
              </div>
              {order.paidAt && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Paid on</span>
                  <span>{new Date(order.paidAt).toLocaleDateString()}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="card p-6 mb-6">
          <h2 className="font-bold text-gray-900 mb-4">Order Items</h2>
          <div className="space-y-3">
            {order.orderItems?.map((item: any) => (
              <div key={item._id} className="flex gap-3 items-center pb-3 border-b border-gray-100 last:border-0 last:pb-0">
                <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-gray-50 border border-gray-100 flex-shrink-0">
                  <Image src={item.image || 'https://via.placeholder.com/64'} alt={item.name}
                    fill className="object-contain p-1" sizes="64px"
                    onError={(e: any) => { e.target.src = 'https://via.placeholder.com/64'; }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 text-sm truncate">{item.name}</p>
                  <p className="text-xs text-gray-500 mt-0.5">Qty: {item.quantity} × ৳{item.price?.toLocaleString()}</p>
                </div>
                <span className="font-bold text-gray-900 flex-shrink-0">
                  ৳{(item.price * item.quantity)?.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Price Summary */}
        <div className="card p-6">
          <h2 className="font-bold text-gray-900 mb-4">Price Summary</h2>
          <div className="space-y-2.5 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Items Total</span>
              <span className="font-semibold">৳{order.itemsPrice?.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Shipping</span>
              <span className={`font-semibold ${order.shippingPrice === 0 ? 'text-green-600' : ''}`}>
                {order.shippingPrice === 0 ? 'FREE' : `৳${order.shippingPrice}`}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Tax</span>
              <span className="font-semibold">৳{order.taxPrice?.toLocaleString()}</span>
            </div>
            <div className="border-t border-gray-100 pt-2.5 flex justify-between">
              <span className="font-bold text-gray-900">Grand Total</span>
              <span className="font-black text-xl text-blue-600">৳{order.totalPrice?.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </StoreLayout>
  );
}
