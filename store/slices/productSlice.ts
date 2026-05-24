import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/lib/api';

export interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  originalPrice: number;
  brand: string;
  category: string;
  images: string[];
  stock: number;
  rating: number;
  numReviews: number;
  isFeatured: boolean;
  specifications: Record<string, string>;
  reviews?: any[];
}

interface ProductState {
  products: Product[];
  product: Product | null;
  featuredProducts: Product[];
  categoryProducts: Record<string, Product[]>;
  loading: boolean;
  error: string | null;
  pagination: { total: number; page: number; pages: number; limit: number } | null;
  filters: { brands: string[] };
}

const initialState: ProductState = {
  products: [],
  product: null,
  featuredProducts: [],
  categoryProducts: {},
  loading: false,
  error: null,
  pagination: null,
  filters: { brands: [] },
};

export const fetchProducts = createAsyncThunk(
  'products/fetchAll',
  async (params: Record<string, any> = {}, { rejectWithValue }) => {
    try {
      const query = new URLSearchParams(params).toString();
      const { data } = await api.get(`/products?${query}`);
      return data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch products');
    }
  }
);

export const fetchProduct = createAsyncThunk(
  'products/fetchOne',
  async (id: string, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/products/${id}`);
      return data.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Product not found');
    }
  }
);

export const fetchFeaturedProducts = createAsyncThunk(
  'products/fetchFeatured',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/products?featured=true&limit=8');
      return data.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed');
    }
  }
);

export const fetchCategoryProducts = createAsyncThunk(
  'products/fetchByCategory',
  async (category: string, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/products/category/${category}`);
      return { category, products: data.data };
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed');
    }
  }
);

export const createProduct = createAsyncThunk(
  'products/create',
  async (productData: Partial<Product>, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/products', productData);
      return data.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to create');
    }
  }
);

export const updateProduct = createAsyncThunk(
  'products/update',
  async ({ id, data: productData }: { id: string; data: Partial<Product> }, { rejectWithValue }) => {
    try {
      const { data } = await api.put(`/products/${id}`, productData);
      return data.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to update');
    }
  }
);

export const deleteProduct = createAsyncThunk(
  'products/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      await api.delete(`/products/${id}`);
      return id;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to delete');
    }
  }
);

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    clearProduct(state) { state.product = null; },
    clearError(state) { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.data;
        state.pagination = action.payload.pagination;
        state.filters = action.payload.filters || { brands: [] };
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false; state.error = action.payload as string;
      })
      .addCase(fetchProduct.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchProduct.fulfilled, (state, action) => {
        state.loading = false; state.product = action.payload;
      })
      .addCase(fetchProduct.rejected, (state, action) => {
        state.loading = false; state.error = action.payload as string;
      })
      .addCase(fetchFeaturedProducts.fulfilled, (state, action) => {
        state.featuredProducts = action.payload;
      })
      .addCase(fetchCategoryProducts.fulfilled, (state, action) => {
        state.categoryProducts[action.payload.category] = action.payload.products;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.products.unshift(action.payload);
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        const idx = state.products.findIndex(p => p._id === action.payload._id);
        if (idx !== -1) state.products[idx] = action.payload;
        if (state.product?._id === action.payload._id) state.product = action.payload;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.products = state.products.filter(p => p._id !== action.payload);
      });
  },
});

export const { clearProduct, clearError } = productSlice.actions;
export default productSlice.reducer;
