// redux/store.ts
import { configureStore } from "@reduxjs/toolkit";
import blogReducer from "../slices/blogSlice";
import categoryBlogReducer from '../slices/categoryBlogSlice';
import articleCategoryReducer from "../slices/articleCategorySlice";
// import privacyPolicyReducer from "../slices/privacyPolicySlice";

export const store = configureStore({
  reducer: {
    blogs: blogReducer,
    categoryBlogs: categoryBlogReducer,
    articleCategory: articleCategoryReducer,
    // privacyPolicy: privacyPolicyReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
