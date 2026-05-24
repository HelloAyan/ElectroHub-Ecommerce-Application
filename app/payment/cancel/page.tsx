'use client';
import Link from 'next/link';
import { XCircle, ShoppingCart } from 'lucide-react';
import StoreLayout from '@/components/layout/StoreLayout';

export default function PaymentCancelPage() {
  return (
    <StoreLayout>
      <div className="container-custom py-20 text-center max-w-md mx-auto">
        <div className="card p-10">
          <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <XCircle className="w-10 h-10 text-yellow-600" />
          </div>
          <h1 className="text-2xl font-black text-gray-900 mb-2">Payment Cancelled</h1>
          <p className="text-gray-500 mb-8">You cancelled the payment. Your cart is still saved.</p>
          <div className="space-y-3">
            <Link href="/checkout" className="btn-primary w-full flex items-center justify-center gap-2">
              Try Again
            </Link>
            <Link href="/cart" className="btn-secondary w-full flex items-center justify-center gap-2">
              <ShoppingCart className="w-4 h-4" /> View Cart
            </Link>
          </div>
        </div>
      </div>
    </StoreLayout>
  );
}
