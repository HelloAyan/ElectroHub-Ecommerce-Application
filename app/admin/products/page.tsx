'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Plus, Search, Edit, Trash2, Eye, Package, AlertTriangle } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { fetchProducts, deleteProduct } from '@/store/slices/productSlice';
import toast from 'react-hot-toast';

const CATEGORY_COLORS: Record<string, string> = {
  mobile: 'bg-blue-100 text-blue-700',
  laptop: 'bg-purple-100 text-purple-700',
  headphone: 'bg-emerald-100 text-emerald-700',
  tablet: 'bg-orange-100 text-orange-700',
  accessories: 'bg-pink-100 text-pink-700',
  other: 'bg-gray-100 text-gray-700',
};

export default function AdminProductsPage() {
  const dispatch = useAppDispatch();
  const { products, loading, pagination } = useAppSelector(s => s.products);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchProducts({ search, page, limit: 15, sort: '-createdAt' }));
  }, [search, page]);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    const result = await dispatch(deleteProduct(id));
    setDeletingId(null);
    setConfirmDelete(null);
    if (deleteProduct.fulfilled.match(result)) {
      toast.success('Product deleted');
    } else {
      toast.error('Failed to delete product');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-gray-900">Products</h2>
          <p className="text-gray-500 text-sm mt-1">{pagination?.total || 0} total products</p>
        </div>
        <Link href="/admin/products/new" className="btn-primary flex items-center gap-2 self-start">
          <Plus className="w-4 h-4" /> Add Product
        </Link>
      </div>

      {/* Search */}
      <div className="card p-4">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search products by name, brand..."
            className="input-field pl-10"
          />
        </div>
      </div>

      {/* Products Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left py-4 px-4 text-gray-500 font-semibold text-xs uppercase tracking-wide">Product</th>
                <th className="text-left py-4 px-4 text-gray-500 font-semibold text-xs uppercase tracking-wide hidden md:table-cell">Category</th>
                <th className="text-left py-4 px-4 text-gray-500 font-semibold text-xs uppercase tracking-wide">Price</th>
                <th className="text-left py-4 px-4 text-gray-500 font-semibold text-xs uppercase tracking-wide hidden sm:table-cell">Stock</th>
                <th className="text-left py-4 px-4 text-gray-500 font-semibold text-xs uppercase tracking-wide">Featured</th>
                <th className="text-right py-4 px-4 text-gray-500 font-semibold text-xs uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(8)].map((_, i) => (
                  <tr key={i} className="border-b border-gray-50">
                    <td className="py-4 px-4" colSpan={6}>
                      <div className="h-10 bg-gray-100 rounded-lg animate-pulse" />
                    </td>
                  </tr>
                ))
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center">
                    <Package className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                    <p className="text-gray-500 font-medium">No products found</p>
                    <Link href="/admin/products/new" className="btn-primary mt-4 inline-flex items-center gap-2 text-sm">
                      <Plus className="w-4 h-4" /> Add First Product
                    </Link>
                  </td>
                </tr>
              ) : (
                products.map(product => (
                  <tr key={product._id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-200">
                          <Image
                            src={product.images[0] || 'https://via.placeholder.com/48'}
                            alt={product.name}
                            fill
                            className="object-contain p-1"
                            sizes="48px"
                            onError={(e: any) => { e.target.src = 'https://via.placeholder.com/48'; }}
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-gray-900 truncate max-w-[160px]">{product.name}</p>
                          <p className="text-xs text-gray-500">{product.brand}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 hidden md:table-cell">
                      <span className={`badge capitalize ${CATEGORY_COLORS[product.category] || 'bg-gray-100 text-gray-700'}`}>
                        {product.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-bold text-gray-900">
                      ৳{product.price.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 hidden sm:table-cell">
                      <span className={`badge ${
                        product.stock === 0 ? 'bg-red-100 text-red-700' :
                        product.stock < 10 ? 'bg-yellow-100 text-yellow-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {product.stock === 0 ? 'Out of Stock' : `${product.stock} in stock`}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`badge ${product.isFeatured ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-500'}`}>
                        {product.isFeatured ? '★ Featured' : 'Standard'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          href={`/products/${product._id}`}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link
                          href={`/admin/products/${product._id}`}
                          className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => setConfirmDelete(product._id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination && pagination.pages > 1 && (
          <div className="flex items-center justify-between px-4 py-4 border-t border-gray-100">
            <p className="text-sm text-gray-500">
              Page {page} of {pagination.pages} ({pagination.total} items)
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm disabled:opacity-40 hover:bg-gray-50 transition-colors"
              >
                Previous
              </button>
              <button
                onClick={() => setPage(p => Math.min(pagination.pages, p + 1))}
                disabled={page === pagination.pages}
                className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm disabled:opacity-40 hover:bg-gray-50 transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Confirm Delete Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl animate-zoom-in">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Delete Product?</h3>
            </div>
            <p className="text-gray-500 text-sm mb-6">
              This product will be hidden from the store. This action can be reversed later.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(confirmDelete)}
                disabled={!!deletingId}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-3 rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {deletingId ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : null}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
