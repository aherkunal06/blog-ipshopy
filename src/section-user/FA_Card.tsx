'use client'

import React from "react";
import { Card, CardContent, CardMedia, CardHeader, Avatar, Typography } from "@mui/material";
import Link from "next/link";

interface FACardItem {
  id?: number;
  category: string;
  title: string;
  image: string;
  slug: string;
  author: { username: string };
  dec?: string;
}

const FA_Cards: React.FC<{ data: FACardItem }> = ({ data }) => {
  return (
    <Card sx={{ borderRadius: "1rem" }}>
      <CardMedia component="img" height="140" image={data.image} alt={data.title} />
      <CardContent>
        <Typography variant="subtitle1" color="text.secondary" sx={{ fontSize: "14px", fontWeight: 500 }}>
          {data.category}
        </Typography>
        <Link href={data.slug ? data.slug : ''}>
          <Typography variant="h6" sx={{ fontSize: "18px", fontWeight: 600 }}>
            {data.title}
          </Typography>
        </Link>
      </CardContent>
      <CardHeader
        avatar={<Avatar src={data.image} alt={data.author.username} />}
        title={data.author.username}
        subheader={data.dec}
      />
    </Card>
  );
};

export default FA_Cards;
