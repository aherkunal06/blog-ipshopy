// redux/slices/blogSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { BlogCard, BlogsApiResponse } from "@/types/blog";

interface BlogState {
  blogs: BlogCard[];
  loading: boolean;
  error: string | null;
  fetched: boolean; // ✅ new flag
}

const initialState: BlogState = {
  blogs: [],
  loading: false,
  error: null,
  fetched: false,
};

export const fetchBlogs = createAsyncThunk<BlogCard[]>(
  "blogs/fetchBlogs",
  async () => {
    const response = await axios.get<BlogsApiResponse>("/api/blogs");
    const data = response.data;

    // Flatten categories → blogs
    const blogs: BlogCard[] = data.categories.flatMap((cat) =>
      cat.blogs.map((b) => b.blog)
    );

    return blogs;
  },
  {
    condition: (_, { getState }) => {
      const state = getState() as { blogs: BlogState };
      if (state.blogs.fetched) {
        return false;
      }
    },
  }
);

const blogSlice = createSlice({
  name: "blogs",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBlogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBlogs.fulfilled, (state, action) => {
        state.loading = false;
        state.blogs = action.payload;
        state.fetched = true; // ✅ mark as fetched
      })
      .addCase(fetchBlogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Something went wrong";
      });
  },
});

export default blogSlice.reducer;
