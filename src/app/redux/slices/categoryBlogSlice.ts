// store/categoryBlogSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export interface Blog {
  id: number;
  title: string;
  content: string;
}

interface CategoryBlogState {
  blogs: Blog[];
  loading: boolean;
  error: string | null;
}

const initialState: CategoryBlogState = {
  blogs: [],
  loading: false,
  error: null,
};

// Fetch blogs from API
export const fetchCategoryBlogs = createAsyncThunk(
  "categoryBlogs/fetchCategoryBlogs",
  async () => {
    const response = await axios.get("http://localhost:5000/blogs"); // Change API URL as needed
    return response.data;
  }
);

const categoryBlogSlice = createSlice({
  name: "categoryBlogs",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategoryBlogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategoryBlogs.fulfilled, (state, action) => {
        state.loading = false;
        state.blogs = action.payload;
      })
      .addCase(fetchCategoryBlogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Something went wrong";
      });
  },
});

export default categoryBlogSlice.reducer;
