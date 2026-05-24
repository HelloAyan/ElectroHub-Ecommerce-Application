'use client';
import { useEffect } from 'react';
import ProductForm from '@/components/admin/ProductForm';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { fetchProduct } from '@/store/slices/productSlice';

export default function EditProductPage({ params }: { params: { id: string } }) {
  const dispatch = useAppDispatch();
  const { product, loading } = useAppSelector(s => s.products);

  useEffect(() => {
    dispatch(fetchProduct(params.id));
  }, [params.id]);

  if (loading || !product) {
    return (
      <div className="max-w-4xl space-y-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="card p-6 animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/3 mb-4" />
            <div className="space-y-3">
              <div className="h-10 bg-gray-100 rounded-xl" />
              <div className="h-24 bg-gray-100 rounded-xl" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return <ProductForm product={product} isEdit />;
}
