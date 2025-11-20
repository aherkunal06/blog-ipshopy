'use client'

import React, { useEffect, useState } from "react";
import { Grid } from "@mui/material";
import FA_Cards from "./FA_Card";

interface BlogCard {
  id: number;
  title: string;
  metaDescription: string;
  image: string;
  slug: string;
  category: string;
  author: { username: string };
}

const FA_Des: React.FC = () => {
  const [blogs, setBlogs] = useState<{ categories: any[] }>({ categories: [] });

  useEffect(() => {
    fetch('/api/blogs')
      .then(res => res.json())
      .then(data => setBlogs(data));
  }, []);

  return (
    <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }} sx={{ mt: 5 }}>
      {blogs?.categories
        ?.flatMap(category => category.blogs.map((b: any) => b.blog))
        .map((blog: BlogCard, index: number) => (
          <Grid key={index} size={{ xs: 12, sm: 4, md: 4 }}>
            <FA_Cards data={blog} />
          </Grid>
        ))}
    </Grid>
  );
};

export default FA_Des;
