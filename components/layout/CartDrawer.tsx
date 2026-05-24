'use client';
import Link from 'next/link';
import Image from 'next/image';
import { X, Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { removeFromCart, updateQuantity, closeCart, selectCartItems, selectCartTotal } from '@/store/slices/cartSlice';

export default function CartDrawer() {
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectCartItems);
  const total = useAppSelector(selectCartTotal);
  const isOpen = useAppSelector(s => s.cart.isOpen);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 animate-fade-in"
        onClick={() => dispatch(closeCart())}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white z-50 flex flex-col shadow-2xl animate-slide-in-right"
        style={{ animation: 'slideInRight 0.3s ease-out' }}>
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-bold text-gray-900">Your Cart</h2>
            <span className="badge bg-blue-100 text-blue-700">{items.length} items</span>
          </div>
          <button onClick={() => dispatch(closeCart())} className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <ShoppingBag className="w-16 h-16 text-gray-200 mb-4" />
              <p className="text-gray-500 font-medium">Your cart is empty</p>
              <p className="text-gray-400 text-sm mt-1">Add some products to get started</p>
              <Link href="/products" onClick={() => dispatch(closeCart())}
                className="btn-primary mt-6 text-sm">
                Browse Products
              </Link>
            </div>
          ) : (
            items.map(item => (
              <div key={item._id} className="flex gap-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-white flex-shrink-0 border border-gray-100">
                  <Image src={item.image} alt={item.name} fill className="object-contain p-1" sizes="64px"
                    onError={(e: any) => { e.target.src = 'https://via.placeholder.com/64'; }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">{item.name}</p>
                  <p className="text-xs text-gray-500 mb-2">{item.brand}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 bg-white rounded-lg border border-gray-200 p-0.5">
                      <button
                        onClick={() => dispatch(updateQuantity({ id: item._id, quantity: item.quantity - 1 }))}
                        className="p-1 rounded hover:bg-gray-100 transition-colors disabled:opacity-40"
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-6 text-center text-sm font-bold">{item.quantity}</span>
                      <button
                        onClick={() => dispatch(updateQuantity({ id: item._id, quantity: item.quantity + 1 }))}
                        className="p-1 rounded hover:bg-gray-100 transition-colors disabled:opacity-40"
                        disabled={item.quantity >= item.stock}
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <span className="text-sm font-bold text-blue-600">৳{(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                </div>
                <button
                  onClick={() => dispatch(removeFromCart(item._id))}
                  className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0 self-start"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-gray-100 p-5 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-bold text-gray-900 text-lg">৳{total.toLocaleString()}</span>
            </div>
            <p className="text-xs text-gray-400">Shipping & taxes calculated at checkout</p>
            <Link
              href="/checkout"
              onClick={() => dispatch(closeCart())}
              className="btn-primary w-full text-center block"
            >
              Proceed to Checkout
            </Link>
            <Link
              href="/cart"
              onClick={() => dispatch(closeCart())}
              className="btn-secondary w-full text-center block text-sm"
            >
              View Full Cart
            </Link>
          </div>
        )}
      </div>

      <style jsx global>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </>
  );
}
