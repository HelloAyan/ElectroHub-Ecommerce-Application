'use client';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, Star, Heart } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { addToCart } from '@/store/slices/cartSlice';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import type { Product } from '@/store/slices/productSlice';

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const user = useAppSelector(s => s.auth.user);

  const discount = product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      toast.error('Please login to add items to cart');
      router.push('/auth/login');
      return;
    }
    if (product.stock === 0) {
      toast.error('Product out of stock');
      return;
    }
    dispatch(addToCart({
      _id: product._id,
      name: product.name,
      price: product.price,
      image: product.images[0] || '',
      stock: product.stock,
      quantity: 1,
      brand: product.brand,
    }));
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <Link href={`/products/${product._id}`} className="product-card group block">
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-50 hover-zoom">
        <Image
          src={product.images[0] || 'https://via.placeholder.com/400x300'}
          alt={product.name}
          fill
          className="object-contain p-4"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          onError={(e: any) => { e.target.src = 'https://via.placeholder.com/400x300'; }}
        />
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {discount > 0 && (
            <span className="badge bg-red-500 text-white">-{discount}%</span>
          )}
          {product.isFeatured && (
            <span className="badge bg-amber-400 text-amber-900">Featured</span>
          )}
          {product.stock === 0 && (
            <span className="badge bg-gray-500 text-white">Out of Stock</span>
          )}
        </div>
        {/* Wishlist */}
        <button className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-all hover:bg-red-50 hover:text-red-500">
          <Heart className="w-4 h-4" />
        </button>
      </div>

      {/* Info */}
      <div className="p-4">
        <p className="text-xs text-blue-600 font-medium mb-1 uppercase tracking-wide">{product.brand}</p>
        <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 mb-2 leading-snug group-hover:text-blue-600 transition-colors">
          {product.name}
        </h3>

        {/* Rating */}
        {product.numReviews > 0 && (
          <div className="flex items-center gap-1 mb-3">
            <div className="flex">
              {[1,2,3,4,5].map(i => (
                <Star key={i} className={`w-3 h-3 ${i <= Math.round(product.rating) ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200'}`} />
              ))}
            </div>
            <span className="text-xs text-gray-500">({product.numReviews})</span>
          </div>
        )}

        {/* Price */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-lg font-bold text-gray-900">৳{product.price.toLocaleString()}</span>
          {product.originalPrice > product.price && (
            <span className="text-sm text-gray-400 line-through">৳{product.originalPrice.toLocaleString()}</span>
          )}
        </div>

        {/* Add to cart */}
        <button
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          className="w-full flex items-center justify-center gap-2 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500"
        >
          <ShoppingCart className="w-4 h-4" />
          {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
        </button>
      </div>
    </Link>
  );
}
