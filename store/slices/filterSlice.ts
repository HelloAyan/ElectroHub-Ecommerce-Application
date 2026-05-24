import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface FilterState {
  search: string;
  brand: string[];
  category: string;
  minPrice: number;
  maxPrice: number;
  sort: string;
  page: number;
}

const initialState: FilterState = {
  search: '',
  brand: [],
  category: '',
  minPrice: 0,
  maxPrice: 500000,
  sort: '-createdAt',
  page: 1,
};

const filterSlice = createSlice({
  name: 'filter',
  initialState,
  reducers: {
    setSearch(state, action: PayloadAction<string>) {
      state.search = action.payload;
      state.page = 1;
    },
    toggleBrand(state, action: PayloadAction<string>) {
      const idx = state.brand.indexOf(action.payload);
      if (idx === -1) state.brand.push(action.payload);
      else state.brand.splice(idx, 1);
      state.page = 1;
    },
    setBrand(state, action: PayloadAction<string[]>) {
      state.brand = action.payload;
      state.page = 1;
    },
    setCategory(state, action: PayloadAction<string>) {
      state.category = action.payload;
      state.page = 1;
    },
    setPriceRange(state, action: PayloadAction<{ min: number; max: number }>) {
      state.minPrice = action.payload.min;
      state.maxPrice = action.payload.max;
      state.page = 1;
    },
    setSort(state, action: PayloadAction<string>) {
      state.sort = action.payload;
    },
    setPage(state, action: PayloadAction<number>) {
      state.page = action.payload;
    },
    resetFilters(state) {
      return { ...initialState };
    },
  },
});

export const { setSearch, toggleBrand, setBrand, setCategory, setPriceRange, setSort, setPage, resetFilters } = filterSlice.actions;
export default filterSlice.reducer;
