'use client';
import { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Smartphone, Laptop, Headphones, Shield, Truck, RefreshCw, HeadphonesIcon, Zap, Star } from 'lucide-react';
import StoreLayout from '@/components/layout/StoreLayout';
import ProductCard from '@/components/shop/ProductCard';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { fetchFeaturedProducts, fetchCategoryProducts } from '@/store/slices/productSlice';

const CATEGORIES = [
  { id: 'mobile', label: 'Mobiles', icon: Smartphone, color: 'bg-blue-50 text-blue-600', count: '200+ Products' },
  { id: 'laptop', label: 'Laptops', icon: Laptop, color: 'bg-purple-50 text-purple-600', count: '150+ Products' },
  { id: 'headphone', label: 'Headphones', icon: Headphones, color: 'bg-emerald-50 text-emerald-600', count: '100+ Products' },
];

const FEATURES = [
  { icon: Truck, title: 'Free Delivery', desc: 'On orders over ৳5,000', color: 'text-blue-600' },
  { icon: Shield, title: 'Authentic Products', desc: '100% genuine guarantee', color: 'text-emerald-600' },
  { icon: RefreshCw, title: 'Easy Returns', desc: '7-day hassle-free returns', color: 'text-orange-600' },
  { icon: HeadphonesIcon, title: '24/7 Support', desc: 'Always here to help', color: 'text-purple-600' },
];

export default function HomePage() {
  const dispatch = useAppDispatch();
  const { featuredProducts, categoryProducts, loading } = useAppSelector(s => s.products);

  useEffect(() => {
    dispatch(fetchFeaturedProducts());
    dispatch(fetchCategoryProducts('mobile'));
    dispatch(fetchCategoryProducts('laptop'));
    dispatch(fetchCategoryProducts('headphone'));
  }, [dispatch]);

  return (
    <StoreLayout>
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, #3b82f6 0%, transparent 70%)' }} />
        <div className="container-custom py-20 md:py-28 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-7">
              <div className="inline-flex items-center gap-2 bg-blue-600/20 border border-blue-500/30 rounded-full px-4 py-1.5 text-sm text-blue-300">
                <Zap className="w-4 h-4 fill-blue-300" />
                <span>New arrivals every week</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight">
                Premium Tech,<br />
                <span className="text-gradient bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                  Best Prices.
                </span>
              </h1>
              <p className="text-slate-300 text-lg max-w-md leading-relaxed">
                Discover the latest smartphones, laptops, and headphones. 
                Authentic products, fast delivery across Bangladesh.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/products" className="btn-primary inline-flex items-center gap-2 !py-3.5 !px-7 text-base">
                  Shop Now <ArrowRight className="w-4 h-4" />
                </Link>
                <Link href="/products?featured=true" className="btn-outline inline-flex items-center gap-2 !py-3.5 !px-7 text-base border-slate-500 text-slate-200 hover:bg-white hover:text-slate-900">
                  Featured Deals
                </Link>
              </div>
              <div className="flex items-center gap-6 pt-2">
                {[['10K+', 'Happy Customers'], ['500+', 'Products'], ['5★', 'Rating']].map(([num, label]) => (
                  <div key={label}>
                    <p className="text-2xl font-black text-white">{num}</p>
                    <p className="text-xs text-slate-400">{label}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="hidden lg:flex justify-center items-center">
              <div className="relative w-80 h-80">
                <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-3xl" />
                <div className="relative w-full h-full flex items-center justify-center">
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { icon: Smartphone, label: 'Mobile', bg: 'bg-blue-500' },
                      { icon: Laptop, label: 'Laptop', bg: 'bg-purple-500' },
                      { icon: Headphones, label: 'Audio', bg: 'bg-emerald-500' },
                      { icon: Zap, label: 'Deals', bg: 'bg-orange-500' },
                    ].map(({ icon: Icon, label, bg }) => (
                      <div key={label} className={`${bg} w-32 h-32 rounded-2xl flex flex-col items-center justify-center gap-2 shadow-lg`}>
                        <Icon className="w-10 h-10 text-white" />
                        <span className="text-white text-sm font-bold">{label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="border-b border-gray-100 bg-white">
        <div className="container-custom py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {FEATURES.map(({ icon: Icon, title, desc, color }) => (
              <div key={title} className="flex items-center gap-3 p-4 rounded-xl hover:bg-gray-50 transition-colors">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-gray-50 ${color} flex-shrink-0`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold text-sm text-gray-900">{title}</p>
                  <p className="text-xs text-gray-500">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="container-custom py-14">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-blue-600 font-medium text-sm mb-1">Shop by Category</p>
            <h2 className="section-title">Browse Categories</h2>
          </div>
          <Link href="/products" className="text-blue-600 font-medium text-sm flex items-center gap-1 hover:gap-2 transition-all">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {CATEGORIES.map(({ id, label, icon: Icon, color, count }) => (
            <Link key={id} href={`/products?category=${id}`}
              className="card p-6 flex items-center gap-5 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
              <div className={`w-16 h-16 rounded-2xl ${color} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                <Icon className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{label}</h3>
                <p className="text-sm text-gray-500">{count}</p>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-blue-600 ml-auto transition-colors" />
            </Link>
          ))}
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="bg-gray-50 py-14">
        <div className="container-custom">
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="text-blue-600 font-medium text-sm mb-1">Hand-picked for you</p>
              <h2 className="section-title">Featured Products</h2>
            </div>
            <Link href="/products?featured=true" className="text-blue-600 font-medium text-sm flex items-center gap-1 hover:gap-2 transition-all">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="card p-4 animate-pulse">
                  <div className="bg-gray-200 rounded-xl aspect-[4/3] mb-4" />
                  <div className="h-4 bg-gray-200 rounded mb-2" />
                  <div className="h-4 bg-gray-200 rounded w-2/3 mb-3" />
                  <div className="h-8 bg-gray-200 rounded" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {featuredProducts.map(product => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CATEGORY SECTIONS */}
      {[
        { id: 'mobile', label: 'Top Mobiles', desc: 'Latest smartphones from top brands' },
        { id: 'laptop', label: 'Best Laptops', desc: 'Power and performance for every need' },
        { id: 'headphone', label: 'Premium Audio', desc: 'Immersive sound experience' },
      ].map(({ id, label, desc }) => {
        const products = categoryProducts[id] || [];
        if (!products.length) return null;
        return (
          <section key={id} className={`py-14 ${id === 'laptop' ? 'bg-gray-50' : 'bg-white'}`}>
            <div className="container-custom">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <p className="text-blue-600 font-medium text-sm mb-1">{desc}</p>
                  <h2 className="section-title">{label}</h2>
                </div>
                <Link href={`/products?category=${id}`} className="text-blue-600 font-medium text-sm flex items-center gap-1 hover:gap-2 transition-all">
                  See All <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {products.slice(0, 4).map(product => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            </div>
          </section>
        );
      })}

      {/* CTA BANNER */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-4xl font-black mb-4">Ready to shop smarter?</h2>
          <p className="text-blue-100 mb-8 text-lg">Join thousands of happy customers. Get the best deals on premium electronics.</p>
          <Link href="/auth/register" className="inline-flex items-center gap-2 bg-white text-blue-700 font-bold px-8 py-4 rounded-xl hover:bg-blue-50 transition-colors text-lg">
            Create Free Account <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </StoreLayout>
  );
}
