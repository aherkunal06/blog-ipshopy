// redux/slices/articleCategorySlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

interface ArticleCategoryState {
  data: any | null;
  loading: boolean;
  error: string | null;
}

const initialState: ArticleCategoryState = {
  data: null,
  loading: false,
  error: null,
};

// Thunk to fetch category by ID
export const fetchArticleCategory = createAsyncThunk(
  "articleCategory/fetch",
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/blogs/article-categories/${id}`
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const articleCategorySlice = createSlice({
  name: "articleCategory",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchArticleCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchArticleCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchArticleCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default articleCategorySlice.reducer;
