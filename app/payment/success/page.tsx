'use client';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle, ArrowRight, Package } from 'lucide-react';
import StoreLayout from '@/components/layout/StoreLayout';
import { Suspense } from 'react';

function PaymentSuccessContent() {
  const params = useSearchParams();
  const orderId = params.get('orderId');

  return (
    <StoreLayout>
      <div className="container-custom py-20 text-center max-w-md mx-auto">
        <div className="card p-10">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-2xl font-black text-gray-900 mb-2">Payment Successful!</h1>
          <p className="text-gray-500 mb-8">Your order has been confirmed and will be shipped soon.</p>
          <div className="space-y-3">
            {orderId && (
              <Link href={`/orders/${orderId}`} className="btn-primary w-full flex items-center justify-center gap-2">
                <Package className="w-4 h-4" /> View Order
              </Link>
            )}
            <Link href="/products" className="btn-secondary w-full flex items-center justify-center gap-2">
              Continue Shopping <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </StoreLayout>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" /></div>}>
      <PaymentSuccessContent />
    </Suspense>
  );
}