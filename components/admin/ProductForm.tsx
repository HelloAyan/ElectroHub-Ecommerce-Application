'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Trash2, Save, ArrowLeft, ImagePlus } from 'lucide-react';
import { useAppDispatch } from '@/hooks/redux';
import { createProduct, updateProduct } from '@/store/slices/productSlice';
import type { Product } from '@/store/slices/productSlice';
import Link from 'next/link';
import Image from 'next/image';
import toast from 'react-hot-toast';

const CATEGORIES = ['mobile', 'laptop', 'headphone', 'tablet', 'accessories', 'other'];

interface Props {
  product?: Product;
  isEdit?: boolean;
}

export default function ProductForm({ product, isEdit }: Props) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: product?.name || '',
    description: product?.description || '',
    price: product?.price || 0,
    originalPrice: product?.originalPrice || 0,
    brand: product?.brand || '',
    category: product?.category || 'mobile',
    stock: product?.stock || 0,
    isFeatured: product?.isFeatured || false,
    images: product?.images || [''],
    specifications: product?.specifications
      ? Object.entries(product.specifications).map(([k, v]) => ({ key: k, value: v as string }))
      : [{ key: '', value: '' }],
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked :
               ['price', 'originalPrice', 'stock'].includes(name) ? Number(value) : value,
    }));
  };

  const handleImageChange = (idx: number, val: string) => {
    const images = [...form.images];
    images[idx] = val;
    setForm(prev => ({ ...prev, images }));
  };

  const addImage = () => setForm(prev => ({ ...prev, images: [...prev.images, ''] }));
  const removeImage = (idx: number) => setForm(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== idx) }));

  const handleSpecChange = (idx: number, field: 'key' | 'value', val: string) => {
    const specs = [...form.specifications];
    specs[idx] = { ...specs[idx], [field]: val };
    setForm(prev => ({ ...prev, specifications: specs }));
  };

  const addSpec = () => setForm(prev => ({ ...prev, specifications: [...prev.specifications, { key: '', value: '' }] }));
  const removeSpec = (idx: number) => setForm(prev => ({ ...prev, specifications: prev.specifications.filter((_, i) => i !== idx) }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.price || !form.brand || !form.category) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);

    // Build specifications object
    const specifications: Record<string, string> = {};
    form.specifications.forEach(({ key, value }) => {
      if (key.trim()) specifications[key.trim()] = value.trim();
    });

    const payload = {
      ...form,
      images: form.images.filter(img => img.trim()),
      specifications,
    };

    let result;
    if (isEdit && product) {
      result = await dispatch(updateProduct({ id: product._id, data: payload }));
    } else {
      result = await dispatch(createProduct(payload));
    }

    setLoading(false);

    if (createProduct.fulfilled.match(result) || updateProduct.fulfilled.match(result)) {
      toast.success(isEdit ? 'Product updated!' : 'Product created!');
      router.push('/admin/products');
    } else {
      toast.error((result.payload as string) || 'Failed to save product');
    }
  };

  return (
    <div className="max-w-4xl">
      <div className="flex items-center gap-3 mb-8">
        <Link href="/admin/products" className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h2 className="text-2xl font-black text-gray-900">{isEdit ? 'Edit Product' : 'Add New Product'}</h2>
          <p className="text-gray-500 text-sm mt-0.5">{isEdit ? `Editing: ${product?.name}` : 'Create a new product listing'}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="card p-6 space-y-5">
          <h3 className="font-bold text-gray-900 border-b border-gray-100 pb-3">Basic Information</h3>

          <div>
            <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Product Name *</label>
            <input name="name" value={form.name} onChange={handleChange} required
              placeholder="e.g. iPhone 15 Pro Max" className="input-field" />
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Description *</label>
            <textarea name="description" value={form.description} onChange={handleChange} required rows={4}
              placeholder="Detailed product description..." className="input-field resize-none" />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Brand *</label>
              <input name="brand" value={form.brand} onChange={handleChange} required
                placeholder="e.g. Apple, Samsung" className="input-field" />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Category *</label>
              <select name="category" value={form.category} onChange={handleChange} className="input-field">
                {CATEGORIES.map(c => <option key={c} value={c} className="capitalize">{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
              </select>
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Sale Price (৳) *</label>
              <input name="price" type="number" value={form.price} onChange={handleChange} required min={0}
                className="input-field" />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Original Price (৳)</label>
              <input name="originalPrice" type="number" value={form.originalPrice} onChange={handleChange} min={0}
                placeholder="0 = no discount" className="input-field" />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Stock Quantity *</label>
              <input name="stock" type="number" value={form.stock} onChange={handleChange} required min={0}
                className="input-field" />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" name="isFeatured" checked={form.isFeatured}
                onChange={handleChange} className="sr-only peer" />
              <div className="w-10 h-6 bg-gray-200 peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-4" />
            </label>
            <div>
              <p className="text-sm font-semibold text-gray-700">Featured Product</p>
              <p className="text-xs text-gray-400">Appears in featured sections on the homepage</p>
            </div>
          </div>
        </div>

        {/* Images */}
        <div className="card p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h3 className="font-bold text-gray-900">Product Images</h3>
            <button type="button" onClick={addImage}
              className="flex items-center gap-1.5 text-sm text-blue-600 font-medium hover:text-blue-700 transition-colors">
              <Plus className="w-4 h-4" /> Add Image URL
            </button>
          </div>

          {form.images.map((img, idx) => (
            <div key={idx} className="flex gap-3 items-start">
              <div className="flex-1">
                <input
                  value={img}
                  onChange={e => handleImageChange(idx, e.target.value)}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="input-field text-sm"
                />
              </div>
              {img && (
                <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100 border border-gray-200 flex-shrink-0">
                  <Image src={img} alt="preview" fill className="object-contain p-1" sizes="48px"
                    onError={(e: any) => { e.target.style.display = 'none'; }} />
                </div>
              )}
              {form.images.length > 1 && (
                <button type="button" onClick={() => removeImage(idx)}
                  className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0">
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}

          <p className="text-xs text-gray-400 flex items-center gap-1.5">
            <ImagePlus className="w-3.5 h-3.5" />
            Paste direct image URLs (Unsplash, CDN, etc.)
          </p>
        </div>

        {/* Specifications */}
        <div className="card p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h3 className="font-bold text-gray-900">Specifications</h3>
            <button type="button" onClick={addSpec}
              className="flex items-center gap-1.5 text-sm text-blue-600 font-medium hover:text-blue-700 transition-colors">
              <Plus className="w-4 h-4" /> Add Spec
            </button>
          </div>

          {form.specifications.map((spec, idx) => (
            <div key={idx} className="flex gap-3 items-center">
              <input
                value={spec.key}
                onChange={e => handleSpecChange(idx, 'key', e.target.value)}
                placeholder="e.g. Processor"
                className="input-field text-sm flex-1"
              />
              <input
                value={spec.value}
                onChange={e => handleSpecChange(idx, 'value', e.target.value)}
                placeholder="e.g. Apple M3 Max"
                className="input-field text-sm flex-1"
              />
              {form.specifications.length > 1 && (
                <button type="button" onClick={() => removeSpec(idx)}
                  className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0">
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Submit */}
        <div className="flex gap-4">
          <Link href="/admin/products" className="btn-secondary flex-1 text-center">
            Cancel
          </Link>
          <button type="submit" disabled={loading}
            className="btn-primary flex-1 flex items-center justify-center gap-2">
            {loading
              ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Saving...</>
              : <><Save className="w-4 h-4" /> {isEdit ? 'Update Product' : 'Create Product'}</>
            }
          </button>
        </div>
      </form>
    </div>
  );
}
