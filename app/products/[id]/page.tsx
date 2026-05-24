'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Star, ChevronLeft, Package, Shield, Truck, Minus, Plus } from 'lucide-react';
import StoreLayout from '@/components/layout/StoreLayout';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { fetchProduct } from '@/store/slices/productSlice';
import { addToCart } from '@/store/slices/cartSlice';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { product, loading } = useAppSelector(s => s.products);
  const user = useAppSelector(s => s.auth.user);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    dispatch(fetchProduct(params.id));
  }, [params.id, dispatch]);

  const handleAddToCart = () => {
    if (!user) { toast.error('Please login to add to cart'); router.push('/auth/login'); return; }
    if (!product) return;
    if (product.stock === 0) { toast.error('Out of stock'); return; }
    for (let i = 0; i < quantity; i++) {
      dispatch(addToCart({
        _id: product._id, name: product.name, price: product.price,
        image: product.images[0] || '', stock: product.stock, quantity: 1, brand: product.brand,
      }));
    }
    toast.success(`${quantity}x ${product.name} added to cart!`);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    if (user) router.push('/checkout');
  };

  if (loading) return (
    <StoreLayout>
      <div className="container-custom py-10">
        <div className="grid md:grid-cols-2 gap-10 animate-pulse">
          <div className="bg-gray-200 rounded-2xl aspect-square" />
          <div className="space-y-4">
            <div className="h-8 bg-gray-200 rounded w-3/4" />
            <div className="h-5 bg-gray-200 rounded w-1/2" />
            <div className="h-10 bg-gray-200 rounded w-1/3" />
            <div className="h-24 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    </StoreLayout>
  );

  if (!product) return (
    <StoreLayout>
      <div className="container-custom py-20 text-center">
        <p className="text-5xl mb-4">😕</p>
        <h2 className="text-2xl font-bold mb-4">Product not found</h2>
        <Link href="/products" className="btn-primary">Back to Products</Link>
      </div>
    </StoreLayout>
  );

  const discount = product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <StoreLayout>
      <div className="container-custom py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-blue-600 transition-colors">Products</Link>
          <span>/</span>
          <Link href={`/products?category=${product.category}`} className="hover:text-blue-600 transition-colors capitalize">{product.category}</Link>
          <span>/</span>
          <span className="text-gray-900 truncate max-w-xs">{product.name}</span>
        </div>

        <div className="grid md:grid-cols-2 gap-10 mb-12">
          {/* Images */}
          <div className="space-y-4">
            <div className="card aspect-square overflow-hidden bg-gray-50">
              <div className="relative w-full h-full hover-zoom">
                <Image
                  src={product.images[selectedImage] || 'https://via.placeholder.com/600'}
                  alt={product.name}
                  fill
                  className="object-contain p-8"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
              </div>
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-3">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`relative w-18 h-18 w-[72px] h-[72px] rounded-xl overflow-hidden border-2 transition-colors ${selectedImage === i ? 'border-blue-600' : 'border-gray-200 hover:border-gray-300'}`}
                  >
                    <Image src={img} alt={`${product.name} ${i + 1}`} fill className="object-contain p-1" sizes="72px" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div>
            <div className="flex items-start gap-2 mb-2">
              <span className="badge bg-blue-100 text-blue-700 capitalize">{product.brand}</span>
              <span className="badge bg-gray-100 text-gray-700 capitalize">{product.category}</span>
              {product.isFeatured && <span className="badge bg-amber-100 text-amber-700">Featured</span>}
            </div>

            <h1 className="text-2xl md:text-3xl font-black text-gray-900 mb-3">{product.name}</h1>

            {product.numReviews > 0 && (
              <div className="flex items-center gap-2 mb-4">
                <div className="flex">
                  {[1,2,3,4,5].map(i => (
                    <Star key={i} className={`w-4 h-4 ${i <= Math.round(product.rating) ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200'}`} />
                  ))}
                </div>
                <span className="text-sm text-gray-500">({product.numReviews} reviews)</span>
              </div>
            )}

            <div className="flex items-baseline gap-3 mb-5">
              <span className="text-3xl font-black text-gray-900">৳{product.price.toLocaleString()}</span>
              {product.originalPrice > product.price && (
                <>
                  <span className="text-xl text-gray-400 line-through">৳{product.originalPrice.toLocaleString()}</span>
                  <span className="badge bg-red-100 text-red-700 text-sm font-bold">-{discount}%</span>
                </>
              )}
            </div>

            <p className="text-gray-600 leading-relaxed mb-6">{product.description}</p>

            {/* Stock */}
            <div className="flex items-center gap-2 mb-6">
              <div className={`w-2.5 h-2.5 rounded-full ${product.stock > 0 ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className={`text-sm font-medium ${product.stock > 0 ? 'text-green-700' : 'text-red-700'}`}>
                {product.stock > 10 ? 'In Stock' : product.stock > 0 ? `Only ${product.stock} left!` : 'Out of Stock'}
              </span>
            </div>

            {/* Quantity */}
            {product.stock > 0 && (
              <div className="flex items-center gap-4 mb-6">
                <span className="text-sm font-semibold text-gray-700">Quantity:</span>
                <div className="flex items-center gap-3 border border-gray-200 rounded-xl p-1">
                  <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="p-2 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-40" disabled={quantity <= 1}>
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-8 text-center font-bold">{quantity}</span>
                  <button onClick={() => setQuantity(q => Math.min(product.stock, q + 1))} className="p-2 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-40" disabled={quantity >= product.stock}>
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              <button onClick={handleAddToCart} disabled={product.stock === 0}
                className="btn-outline flex-1 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                <ShoppingCart className="w-4 h-4" /> Add to Cart
              </button>
              <button onClick={handleBuyNow} disabled={product.stock === 0}
                className="btn-primary flex-1 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                Buy Now
              </button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-3 p-4 bg-gray-50 rounded-xl">
              {[
                { icon: Truck, text: 'Free Delivery' },
                { icon: Shield, text: '1 Year Warranty' },
                { icon: Package, text: 'Easy Returns' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex flex-col items-center gap-1.5 text-center">
                  <Icon className="w-5 h-5 text-blue-600" />
                  <span className="text-xs text-gray-600 font-medium">{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Specifications */}
        {product.specifications && Object.keys(product.specifications).length > 0 && (
          <div className="card p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-5">Specifications</h2>
            <div className="grid md:grid-cols-2 gap-3">
              {Object.entries(product.specifications).map(([key, value]) => (
                <div key={key} className="flex gap-3 py-2.5 border-b border-gray-100">
                  <span className="text-sm font-semibold text-gray-600 w-32 flex-shrink-0">{key}</span>
                  <span className="text-sm text-gray-900">{value as string}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Reviews */}
        {product.reviews && product.reviews.length > 0 && (
          <div className="card p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-5">Customer Reviews ({product.numReviews})</h2>
            <div className="space-y-4">
              {product.reviews.slice(0, 5).map((review: any) => (
                <div key={review._id} className="flex gap-4 pb-4 border-b border-gray-100 last:border-0">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-blue-600">{review.name[0]}</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-sm text-gray-900">{review.name}</span>
                      <div className="flex">
                        {[1,2,3,4,5].map(i => (
                          <Star key={i} className={`w-3 h-3 ${i <= review.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200'}`} />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">{review.comment}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </StoreLayout>
  );
}
