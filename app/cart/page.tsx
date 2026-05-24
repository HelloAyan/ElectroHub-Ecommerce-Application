'use client';
import { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, ArrowRight } from 'lucide-react';
import StoreLayout from '@/components/layout/StoreLayout';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { removeFromCart, updateQuantity, clearCart, selectCartItems, selectCartTotal } from '@/store/slices/cartSlice';
import toast from 'react-hot-toast';

export default function CartPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const items = useAppSelector(selectCartItems);
  const total = useAppSelector(selectCartTotal);
  const user = useAppSelector(s => s.auth.user);

  useEffect(() => {
    if (!user) { router.push('/auth/login'); }
  }, [user]);

  const shipping = total > 5000 ? 0 : 100;
  const tax = Math.round(total * 0.05);
  const grandTotal = total + shipping + tax;

  return (
    <StoreLayout>
      <div className="container-custom py-10">
        <div className="flex items-center gap-3 mb-8">
          <ShoppingBag className="w-7 h-7 text-blue-600" />
          <h1 className="text-2xl font-black text-gray-900">Shopping Cart</h1>
          <span className="badge bg-blue-100 text-blue-700">{items.length} items</span>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-20">
            <ShoppingBag className="w-20 h-20 text-gray-200 mx-auto mb-5" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
            <p className="text-gray-500 mb-8">Discover amazing products and add them to your cart</p>
            <Link href="/products" className="btn-primary inline-flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" /> Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart items */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-500">{items.length} items in cart</p>
                <button onClick={() => { dispatch(clearCart()); toast.success('Cart cleared'); }}
                  className="text-sm text-red-500 hover:text-red-700 font-medium transition-colors flex items-center gap-1">
                  <Trash2 className="w-3.5 h-3.5" /> Clear All
                </button>
              </div>

              {items.map(item => (
                <div key={item._id} className="card p-4 flex gap-4">
                  <Link href={`/products/${item._id}`} className="relative w-24 h-24 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0 border border-gray-100 hover-zoom">
                    <Image src={item.image} alt={item.name} fill className="object-contain p-2" sizes="96px"
                      onError={(e: any) => { e.target.src = 'https://via.placeholder.com/96'; }} />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link href={`/products/${item._id}`} className="font-semibold text-gray-900 hover:text-blue-600 transition-colors text-sm md:text-base line-clamp-2">
                      {item.name}
                    </Link>
                    <p className="text-sm text-gray-500 mt-0.5">{item.brand}</p>
                    <p className="text-blue-600 font-bold mt-1">৳{item.price.toLocaleString()} each</p>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-2 border border-gray-200 rounded-xl p-1">
                        <button onClick={() => dispatch(updateQuantity({ id: item._id, quantity: item.quantity - 1 }))}
                          disabled={item.quantity <= 1}
                          className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-40">
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-8 text-center font-bold text-sm">{item.quantity}</span>
                        <button onClick={() => dispatch(updateQuantity({ id: item._id, quantity: item.quantity + 1 }))}
                          disabled={item.quantity >= item.stock}
                          className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-40">
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-gray-900">৳{(item.price * item.quantity).toLocaleString()}</span>
                        <button onClick={() => { dispatch(removeFromCart(item._id)); toast.success('Item removed'); }}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              <Link href="/products" className="inline-flex items-center gap-2 text-blue-600 font-medium text-sm hover:gap-3 transition-all">
                <ArrowLeft className="w-4 h-4" /> Continue Shopping
              </Link>
            </div>

            {/* Order summary */}
            <div className="lg:col-span-1">
              <div className="card p-6 sticky top-24">
                <h2 className="text-lg font-bold text-gray-900 mb-5">Order Summary</h2>
                <div className="space-y-3 mb-5">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} items)</span>
                    <span className="font-semibold">৳{total.toLocaleString()}</span>
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
                  {total < 5000 && (
                    <p className="text-xs text-amber-600 bg-amber-50 px-3 py-2 rounded-lg">
                      Add ৳{(5000 - total).toLocaleString()} more for free shipping!
                    </p>
                  )}
                  <div className="border-t border-gray-100 pt-3 flex justify-between">
                    <span className="font-bold text-gray-900">Total</span>
                    <span className="font-black text-xl text-gray-900">৳{grandTotal.toLocaleString()}</span>
                  </div>
                </div>
                <Link href="/checkout" className="btn-primary w-full flex items-center justify-center gap-2">
                  Proceed to Checkout <ArrowRight className="w-4 h-4" />
                </Link>
                <p className="text-center text-xs text-gray-400 mt-4">🔒 Secure checkout with SSLCommerz</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </StoreLayout>
  );
}
