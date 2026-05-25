'use client';
import { useEffect, useState, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { SlidersHorizontal, X, ChevronDown, ChevronUp, Search } from 'lucide-react';
import StoreLayout from '@/components/layout/StoreLayout';
import ProductCard from '@/components/shop/ProductCard';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { fetchProducts } from '@/store/slices/productSlice';

const CATEGORIES = ['mobile', 'laptop', 'headphone', 'tablet', 'accessories'];
const SORT_OPTIONS = [
  { value: '-createdAt', label: 'Newest First' },
  { value: 'price', label: 'Price: Low to High' },
  { value: '-price', label: 'Price: High to Low' },
  { value: '-rating', label: 'Top Rated' },
];

function ProductsPageContent() {
  const dispatch = useAppDispatch();
  const { products, loading, pagination, filters } = useAppSelector(s => s.products);
  const searchParams = useSearchParams();
  const router = useRouter();

  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [selectedBrands, setSelectedBrands] = useState<string[]>(
    searchParams.get('brand')?.split(',').filter(Boolean) || []
  );
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [minPrice, setMinPrice] = useState(Number(searchParams.get('minPrice') || 0));
  const [maxPrice, setMaxPrice] = useState(Number(searchParams.get('maxPrice') || 500000));
  const [sort, setSort] = useState(searchParams.get('sort') || '-createdAt');
  const [page, setPage] = useState(Number(searchParams.get('page') || 1));
  const [priceOpen, setPriceOpen] = useState(true);
  const [brandOpen, setBrandOpen] = useState(true);
  const [catOpen, setCatOpen] = useState(true);

  const buildParams = useCallback(() => {
    const params: Record<string, string> = {};
    if (search) params.search = search;
    if (selectedBrands.length) params.brand = selectedBrands.join(',');
    if (category) params.category = category;
    if (minPrice > 0) params.minPrice = String(minPrice);
    if (maxPrice < 500000) params.maxPrice = String(maxPrice);
    params.sort = sort;
    params.page = String(page);
    return params;
  }, [search, selectedBrands, category, minPrice, maxPrice, sort, page]);

  useEffect(() => {
    const params = buildParams();
    dispatch(fetchProducts(params));
    const qp = new URLSearchParams(params);
    router.replace(`/products?${qp.toString()}`, { scroll: false });
  }, [search, selectedBrands, category, minPrice, maxPrice, sort, page]);

  const toggleBrand = (brand: string) => {
    setSelectedBrands(prev =>
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    );
    setPage(1);
  };

  const resetFilters = () => {
    setSearch(''); setSelectedBrands([]); setCategory('');
    setMinPrice(0); setMaxPrice(500000); setSort('-createdAt'); setPage(1);
  };

  const hasActiveFilters = search || selectedBrands.length || category || minPrice > 0 || maxPrice < 500000;

  const Sidebar = () => (
    <aside className="space-y-6">
      {/* Search */}
      <div>
        <h3 className="font-bold text-gray-900 mb-3 text-sm uppercase tracking-wide">Search</h3>
        <div className="relative">
          <input
            type="text"
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search products..."
            className="input-field pr-9 text-sm"
          />
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        </div>
      </div>

      {/* Category */}
      <div>
        <button
          onClick={() => setCatOpen(!catOpen)}
          className="flex items-center justify-between w-full font-bold text-gray-900 text-sm uppercase tracking-wide mb-3"
        >
          Category {catOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        {catOpen && (
          <div className="space-y-1.5">
            <label className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-gray-50 transition-colors">
              <input type="radio" name="category" checked={category === ''} onChange={() => { setCategory(''); setPage(1); }} className="accent-blue-600" />
              <span className="text-sm text-gray-700">All Categories</span>
            </label>
            {CATEGORIES.map(c => (
              <label key={c} className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-gray-50 transition-colors">
                <input type="radio" name="category" checked={category === c} onChange={() => { setCategory(c); setPage(1); }} className="accent-blue-600" />
                <span className="text-sm text-gray-700 capitalize">{c}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Brand */}
      {filters.brands.length > 0 && (
        <div>
          <button
            onClick={() => setBrandOpen(!brandOpen)}
            className="flex items-center justify-between w-full font-bold text-gray-900 text-sm uppercase tracking-wide mb-3"
          >
            Brand {brandOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          {brandOpen && (
            <div className="space-y-1.5 max-h-48 overflow-y-auto">
              {filters.brands.map(brand => (
                <label key={brand} className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-gray-50 transition-colors">
                  <input
                    type="checkbox"
                    checked={selectedBrands.includes(brand)}
                    onChange={() => toggleBrand(brand)}
                    className="accent-blue-600"
                  />
                  <span className="text-sm text-gray-700">{brand}</span>
                </label>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Price Range */}
      <div>
        <button
          onClick={() => setPriceOpen(!priceOpen)}
          className="flex items-center justify-between w-full font-bold text-gray-900 text-sm uppercase tracking-wide mb-3"
        >
          Price Range {priceOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        {priceOpen && (
          <div className="space-y-3">
            <div className="flex gap-2">
              <div className="flex-1">
                <label className="text-xs text-gray-500 mb-1 block">Min (৳)</label>
                <input
                  type="number"
                  value={minPrice}
                  onChange={e => { setMinPrice(Number(e.target.value)); setPage(1); }}
                  className="input-field text-sm py-2"
                  min={0}
                />
              </div>
              <div className="flex-1">
                <label className="text-xs text-gray-500 mb-1 block">Max (৳)</label>
                <input
                  type="number"
                  value={maxPrice}
                  onChange={e => { setMaxPrice(Number(e.target.value)); setPage(1); }}
                  className="input-field text-sm py-2"
                  min={0}
                />
              </div>
            </div>
            <input
              type="range"
              min={0}
              max={500000}
              step={1000}
              value={maxPrice}
              onChange={e => { setMaxPrice(Number(e.target.value)); setPage(1); }}
              className="w-full accent-blue-600"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>৳0</span>
              <span>৳5,00,000</span>
            </div>
          </div>
        )}
      </div>

      {/* Reset */}
      {hasActiveFilters && (
        <button onClick={resetFilters} className="w-full btn-secondary text-sm flex items-center justify-center gap-2">
          <X className="w-4 h-4" /> Clear All Filters
        </button>
      )}
    </aside>
  );

  return (
    <StoreLayout>
      <div className="container-custom py-8">
        {/* Page header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {category ? <span className="capitalize">{category}s</span> : 'All Products'}
            </h1>
            {pagination && (
              <p className="text-sm text-gray-500 mt-1">{pagination.total} products found</p>
            )}
          </div>
          <div className="flex items-center gap-3">
            {/* Mobile filter toggle */}
            <button
              onClick={() => setMobileFiltersOpen(true)}
              className="md:hidden flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters {hasActiveFilters && <span className="badge bg-blue-100 text-blue-700 text-xs">!</span>}
            </button>
            {/* Sort */}
            <select
              value={sort}
              onChange={e => setSort(e.target.value)}
              className="input-field text-sm py-2 w-auto"
            >
              {SORT_OPTIONS.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Desktop Sidebar */}
          <div className="hidden md:block w-64 flex-shrink-0">
            <div className="card p-5 sticky top-24">
              <Sidebar />
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1 min-w-0">
            {/* Active filters */}
            {hasActiveFilters && (
              <div className="flex flex-wrap gap-2 mb-4">
                {search && (
                  <span className="badge bg-blue-100 text-blue-700 gap-1">
                    "{search}" <button onClick={() => setSearch('')}><X className="w-3 h-3" /></button>
                  </span>
                )}
                {category && (
                  <span className="badge bg-blue-100 text-blue-700 capitalize gap-1">
                    {category} <button onClick={() => setCategory('')}><X className="w-3 h-3" /></button>
                  </span>
                )}
                {selectedBrands.map(b => (
                  <span key={b} className="badge bg-blue-100 text-blue-700 gap-1">
                    {b} <button onClick={() => toggleBrand(b)}><X className="w-3 h-3" /></button>
                  </span>
                ))}
              </div>
            )}

            {loading ? (
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {[...Array(12)].map((_, i) => (
                  <div key={i} className="card p-4 animate-pulse">
                    <div className="bg-gray-200 rounded-xl aspect-[4/3] mb-4" />
                    <div className="h-4 bg-gray-200 rounded mb-2" />
                    <div className="h-4 bg-gray-200 rounded w-2/3 mb-3" />
                    <div className="h-8 bg-gray-200 rounded" />
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-5xl mb-4">🔍</p>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-500 mb-6">Try adjusting your filters or search terms</p>
                <button onClick={resetFilters} className="btn-primary">Clear Filters</button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {products.map(product => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>

                {/* Pagination */}
                {pagination && pagination.pages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-10">
                    <button
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium disabled:opacity-40 hover:bg-gray-50 transition-colors"
                    >
                      Previous
                    </button>
                    {[...Array(pagination.pages)].map((_, i) => (
                      <button
                        key={i + 1}
                        onClick={() => setPage(i + 1)}
                        className={`w-9 h-9 rounded-xl text-sm font-medium transition-colors ${page === i + 1 ? 'bg-blue-600 text-white' : 'border border-gray-200 hover:bg-gray-50'}`}
                      >
                        {i + 1}
                      </button>
                    ))}
                    <button
                      onClick={() => setPage(p => Math.min(pagination.pages, p + 1))}
                      disabled={page === pagination.pages}
                      className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium disabled:opacity-40 hover:bg-gray-50 transition-colors"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile filter drawer */}
      {mobileFiltersOpen && (
        <>
          <div className="fixed inset-0 bg-black/40 z-50" onClick={() => setMobileFiltersOpen(false)} />
          <div className="fixed left-0 top-0 bottom-0 w-80 bg-white z-50 overflow-y-auto p-5 animate-slide-up">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-bold text-lg">Filters</h2>
              <button onClick={() => setMobileFiltersOpen(false)} className="p-2 rounded-xl hover:bg-gray-100">
                <X className="w-5 h-5" />
              </button>
            </div>
            <Sidebar />
          </div>
        </>
      )}
    </StoreLayout>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <ProductsPageContent />
    </Suspense>
  );
}