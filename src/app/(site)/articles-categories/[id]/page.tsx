"use client";

import { fetchArticleCategory } from "@/app/redux/slices/articleCategorySlice";
import { AppDispatch, RootState } from "@/app/redux/store/store";
import CommonCard from "@/components/CommonCard";
import { Box, Grid, Typography } from "@mui/material";
import React, { use, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

interface ArticleCategoriesIdProps {
  params: Promise<{
    id: string;
  }>;
}

const ArticleCategoriesId = ({ params }: ArticleCategoriesIdProps) => {
  // ✅ unwrap params using React.use()
  const { id } = use(params);

  const dispatch = useDispatch<AppDispatch>();
  const { data, loading, error } = useSelector(
    (state: RootState) => state.articleCategory
  );

  useEffect(() => {
    if (id) {
      dispatch(fetchArticleCategory(Number(id))); // fetch category by ID
    }
  }, [dispatch, id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;

  return (
    <Box sx={{ mt: 10 }}>
      <Typography variant="h3" sx={{ mb: 3 }}>
        Articles in Category {id}
      </Typography>

      <Box sx={{ p: 2 }}>
        <Grid container spacing={3}>
          {Array.isArray(data) && data.length > 0 ? (
            data.map((article: any) => (
              <Grid item key={article.id} xs={12} sm={6} md={4}>
                <CommonCard
                  data={{
                    category: article.slug || "No slug",
                    title: article.title,
                    avatarImg:
                      "https://i.pinimg.com/736x/3e/36/00/3e3600f33f0c190104d30d2a971e1659.jpg", // static fallback
                    name: article.author?.username || "Unknown",
                    dec: article.metaDescription,
                    img: article.image,
                  }}
                />
              </Grid>
            ))
          ) : (
            <Typography>No articles found in this category.</Typography>
          )}
        </Grid>
      </Box>
    </Box>
  );
};

export default ArticleCategoriesId;
