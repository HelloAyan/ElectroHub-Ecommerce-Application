'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, CreditCard, MapPin, User, Phone, ArrowLeft } from 'lucide-react';
import StoreLayout from '@/components/layout/StoreLayout';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { createOrder, initiatePayment } from '@/store/slices/orderSlice';
import { clearCart, selectCartItems, selectCartTotal } from '@/store/slices/cartSlice';
import Image from 'next/image';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function CheckoutPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const user = useAppSelector(s => s.auth.user);
  const items = useAppSelector(selectCartItems);
  const subtotal = useAppSelector(selectCartTotal);
  const { loading, order, paymentUrl } = useAppSelector(s => s.orders);

  const [form, setForm] = useState({
    fullName: user?.name || '',
    address: '',
    city: '',
    postalCode: '',
    country: 'Bangladesh',
    phone: '',
  });

  const shipping = subtotal > 5000 ? 0 : 100;
  const tax = Math.round(subtotal * 0.05);
  const total = subtotal + shipping + tax;

  useEffect(() => {
    if (!user) { router.push('/auth/login'); return; }
    if (items.length === 0) { router.push('/cart'); }
  }, [user, items]);

  // Redirect to SSLCommerz when payment URL is ready
  useEffect(() => {
    if (paymentUrl) {
      window.location.href = paymentUrl;
    }
  }, [paymentUrl]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.fullName || !form.address || !form.city || !form.phone) {
      toast.error('Please fill in all required fields');
      return;
    }

    const orderItems = items.map(item => ({
      product: item._id,
      name: item.name,
      image: item.image,
      price: item.price,
      quantity: item.quantity,
    }));

    const result = await dispatch(createOrder({
      orderItems,
      shippingAddress: form,
      paymentMethod: 'SSLCommerz',
    }));

    if (createOrder.fulfilled.match(result)) {
      const orderId = result.payload._id;
      dispatch(clearCart());
      const payResult = await dispatch(initiatePayment(orderId));
      if (!initiatePayment.fulfilled.match(payResult)) {
        toast.error('Payment initiation failed. You can pay from your orders page.');
        router.push(`/orders/${orderId}`);
      }
    } else {
      toast.error('Failed to place order. Please try again.');
    }
  };

  return (
    <StoreLayout>
      <div className="container-custom py-10">
        <div className="flex items-center gap-3 mb-8">
          <Link href="/cart" className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-2xl font-black text-gray-900">Checkout</h1>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Shipping Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Shipping Address */}
              <div className="card p-6">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <MapPin className="w-4 h-4 text-blue-600" />
                  </div>
                  <h2 className="text-lg font-bold text-gray-900">Shipping Address</h2>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Full Name *</label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        name="fullName"
                        value={form.fullName}
                        onChange={handleChange}
                        placeholder="Your full name"
                        required
                        className="input-field pl-10"
                      />
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Phone Number *</label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="+880 1700-000000"
                        required
                        className="input-field pl-10"
                      />
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Address *</label>
                    <input
                      name="address"
                      value={form.address}
                      onChange={handleChange}
                      placeholder="House no, Road, Area"
                      required
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-1.5 block">City *</label>
                    <input
                      name="city"
                      value={form.city}
                      onChange={handleChange}
                      placeholder="Dhaka"
                      required
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Postal Code</label>
                    <input
                      name="postalCode"
                      value={form.postalCode}
                      onChange={handleChange}
                      placeholder="1212"
                      className="input-field"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Country</label>
                    <select name="country" value={form.country} onChange={handleChange} className="input-field">
                      <option>Bangladesh</option>
                      <option>India</option>
                      <option>Pakistan</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Payment */}
              <div className="card p-6">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <CreditCard className="w-4 h-4 text-green-600" />
                  </div>
                  <h2 className="text-lg font-bold text-gray-900">Payment Method</h2>
                </div>

                <div className="flex items-center gap-4 p-4 border-2 border-blue-600 rounded-xl bg-blue-50">
                  <div className="w-5 h-5 rounded-full border-2 border-blue-600 flex items-center justify-center">
                    <div className="w-2.5 h-2.5 bg-blue-600 rounded-full" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">SSLCommerz</p>
                    <p className="text-sm text-gray-500">Credit/Debit Card, Mobile Banking, Net Banking</p>
                  </div>
                  <div className="flex gap-2">
                    {['bKash', 'Nagad', 'Visa', 'MasterCard'].map(m => (
                      <span key={m} className="text-xs bg-white border border-gray-200 px-2 py-1 rounded-lg font-medium text-gray-600">{m}</span>
                    ))}
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
                  <Lock className="w-4 h-4 text-green-600" />
                  <span>Your payment is secured by SSL encryption</span>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="card p-6 sticky top-24">
                <h2 className="text-lg font-bold text-gray-900 mb-5">Order Summary</h2>

                <div className="space-y-3 mb-5 max-h-60 overflow-y-auto pr-1">
                  {items.map(item => (
                    <div key={item._id} className="flex gap-3 items-center">
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-50 flex-shrink-0 border border-gray-100">
                        <Image src={item.image} alt={item.name} fill className="object-contain p-1" sizes="48px"
                          onError={(e: any) => { e.target.src = 'https://via.placeholder.com/48'; }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-gray-900 truncate">{item.name}</p>
                        <p className="text-xs text-gray-500">x{item.quantity}</p>
                      </div>
                      <span className="text-sm font-bold text-gray-900 flex-shrink-0">
                        ৳{(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-100 pt-4 space-y-2.5 mb-5">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-semibold">৳{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Shipping</span>
                    <span className={`font-semibold ${shipping === 0 ? 'text-green-600' : ''}`}>
                      {shipping === 0 ? 'FREE' : `৳${shipping}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tax (5%)</span>
                    <span className="font-semibold">৳{tax.toLocaleString()}</span>
                  </div>
                  <div className="border-t border-gray-100 pt-2.5 flex justify-between">
                    <span className="font-bold text-gray-900">Total</span>
                    <span className="font-black text-xl text-blue-600">৳{total.toLocaleString()}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Processing...</>
                  ) : (
                    <><Lock className="w-4 h-4" /> Pay ৳{total.toLocaleString()}</>
                  )}
                </button>

                <p className="text-center text-xs text-gray-400 mt-3">
                  You'll be redirected to SSLCommerz for secure payment
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </StoreLayout>
  );
}
