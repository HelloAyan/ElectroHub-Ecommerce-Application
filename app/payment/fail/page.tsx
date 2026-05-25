'use client';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { XCircle, RefreshCw, ArrowLeft } from 'lucide-react';
import StoreLayout from '@/components/layout/StoreLayout';
import { Suspense } from 'react';

function PaymentFailContent() {
  const params = useSearchParams();
  const orderId = params.get('orderId');

  return (
    <StoreLayout>
      <div className="container-custom py-20 text-center max-w-md mx-auto">
        <div className="card p-10">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-          center mx-auto mb-6">
            <XCircle className="w-10 h-10 text-red-600" />
          </div>
          <h1 className="text-2xl font-black text-gray-900 mb-2">Payment Failed</h1>
          <p className="text-gray-500 mb-8">
            Your payment could not be processed. Your order is saved — you can retry payment from your orders page.
          </p>
          <div className="space-y-3">
            {orderId && (
              <Link href={`/orders/${orderId}`} className="btn-primary w-full flex items-center justify-center gap-2">
                <RefreshCw className="w-4 h-4" /> Retry Payment
              </Link>
            )}
            <Link href="/cart" className="btn-secondary w-full flex items-center justify-center gap-2">
              <ArrowLeft className="w-4 h-4" /> Back to Cart
            </Link>
          </div>
        </div>
      </div>
    </StoreLayout>
  );
}

export default function PaymentFailPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" /></div>}>
      <PaymentFailContent />
    </Suspense>
  );
}