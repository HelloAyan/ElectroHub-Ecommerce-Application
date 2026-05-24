import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/lib/api';

interface OrderState {
  orders: any[];
  order: any | null;
  loading: boolean;
  error: string | null;
  paymentUrl: string | null;
}

const initialState: OrderState = {
  orders: [],
  order: null,
  loading: false,
  error: null,
  paymentUrl: null,
};

export const createOrder = createAsyncThunk(
  'orders/create',
  async (orderData: any, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/orders', orderData);
      return data.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to create order');
    }
  }
);

export const initiatePayment = createAsyncThunk(
  'orders/initiatePayment',
  async (orderId: string, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/payment/initiate', { orderId });
      return data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Payment failed');
    }
  }
);

export const fetchMyOrders = createAsyncThunk(
  'orders/fetchMy',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/orders/my');
      return data.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed');
    }
  }
);

export const fetchOrder = createAsyncThunk(
  'orders/fetchOne',
  async (id: string, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/orders/${id}`);
      return data.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed');
    }
  }
);

export const fetchAllOrders = createAsyncThunk(
  'orders/fetchAll',
  async (params: Record<string, any> = {}, { rejectWithValue }) => {
    try {
      const query = new URLSearchParams(params).toString();
      const { data } = await api.get(`/orders?${query}`);
      return data.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed');
    }
  }
);

export const updateOrderStatus = createAsyncThunk(
  'orders/updateStatus',
  async ({ id, ...statusData }: { id: string; orderStatus?: string; paymentStatus?: string }, { rejectWithValue }) => {
    try {
      const { data } = await api.put(`/orders/${id}/status`, statusData);
      return data.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed');
    }
  }
);

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearOrder(state) { state.order = null; state.paymentUrl = null; },
    clearError(state) { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(createOrder.fulfilled, (state, action) => { state.loading = false; state.order = action.payload; })
      .addCase(createOrder.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; })
      .addCase(initiatePayment.pending, (state) => { state.loading = true; })
      .addCase(initiatePayment.fulfilled, (state, action) => {
        state.loading = false;
        state.paymentUrl = action.payload.url;
      })
      .addCase(initiatePayment.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; })
      .addCase(fetchMyOrders.fulfilled, (state, action) => { state.orders = action.payload; })
      .addCase(fetchOrder.fulfilled, (state, action) => { state.order = action.payload; })
      .addCase(fetchAllOrders.fulfilled, (state, action) => { state.orders = action.payload; })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        const idx = state.orders.findIndex(o => o._id === action.payload._id);
        if (idx !== -1) state.orders[idx] = action.payload;
        if (state.order?._id === action.payload._id) state.order = action.payload;
      });
  },
});

export const { clearOrder, clearError } = orderSlice.actions;
export default orderSlice.reducer;
