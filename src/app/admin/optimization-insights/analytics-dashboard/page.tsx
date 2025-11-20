"use client";

import { Box, Card, CardContent, Typography } from "@mui/material";
import React from "react";
import LinkIcon from "@mui/icons-material/Link";
import SimpleLineChart from "@/admin-components/SimpleLineChart";
import TinyBarChart from "@/admin-components/TinyBarChart";
import BasicTable from "@/admin-components/BasicTable";
import { MRT_ColumnDef } from "material-react-table";

// 📊 Cards Data
const cardsData = [
  {
    icon: <LinkIcon />,
    title: "Total Internal Links",
    value: "2847",
    change: "12",
  },
  {
    icon: <LinkIcon />,
    title: "Total Backlinks",
    value: "1236",
    change: "8",
  },
  {
    icon: <LinkIcon />,
    title: "Posts with 10+ Links",
    value: "156",
    change: "5",
  },
  {
    icon: <LinkIcon />,
    title: "Broken Links",
    value: "23",
    change: "-3",
  },
];

// 📝 Post type
type Post = {
  id: number;
  title: string;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  lastUpdated: string;
};

// 📝 Table data
const postData: Post[] = [
  {
    id: 1,
    title: "10 SEO Tips for 2025",
    views: 1240,
    likes: 320,
    comments: 45,
    shares: 78,
    lastUpdated: "2025-08-12",
  },
  {
    id: 2,
    title: "Internal Linking Strategies",
    views: 980,
    likes: 210,
    comments: 30,
    shares: 50,
    lastUpdated: "2025-08-15",
  },
  {
    id: 3,
    title: "Backlink Building Guide",
    views: 1650,
    likes: 400,
    comments: 60,
    shares: 120,
    lastUpdated: "2025-08-17",
  },
];

const AnalyticsDashboard = () => {
  // 📑 Table Columns
  const columns: MRT_ColumnDef<Post>[] = [
    { accessorKey: "title", header: "Post Title" },
    { accessorKey: "views", header: "Views" },
    { accessorKey: "likes", header: "Likes" },
    { accessorKey: "comments", header: "Comments" },
    { accessorKey: "shares", header: "Shares" },
    { accessorKey: "lastUpdated", header: "Last Updated" },
  ];

  return (
    <Box>
      {/* Cards Section */}
      <Box>
        <Cards data={cardsData} />
      </Box>

      {/* Charts */}
      <Box mt={3}>
        <Typography variant="h6">Monthly Visitors</Typography>
        <SimpleLineChart />
      </Box>
      <Box mt={3}>
        <Typography variant="h6">Post Engagement</Typography>
        <TinyBarChart />
      </Box>

      {/* Table */}
      <Box mt={3}>
        <BasicTable<Post>
          data={postData}
          columns={columns}
          topToolbarActions={() => (
            <Typography variant="h6" sx={{ p: 2 }}>
              Blog Performance Overview
            </Typography>
          )}
        />
      </Box>
    </Box>
  );
};

export default AnalyticsDashboard;

// 🎴 Cards Component
interface CardData {
  icon: React.ReactNode;
  title: string;
  value: string;
  change: string;
}

interface CardsProps {
  data?: CardData[];
}

const Cards: React.FC<CardsProps> = ({ data }: CardsProps) => {
  if (!data || !Array.isArray(data)) return null;

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "repeat(2, 1fr)",
          sm: "repeat(4, 1fr)",
          md: "repeat(4, 1fr)",
        },
        gap: 2,
      }}
    >
      {data.map((item, index) => {
        const isPositive = !item.change.startsWith("-");

        return (
          <Card key={index} elevation={3} sx={{ borderRadius: 2 }}>
            <CardContent>
              <Typography variant="body1" color="text.secondary" gutterBottom>
                {item.title}
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                  {item.value}
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    color: isPositive ? "success.main" : "error.main",
                  }}
                >
                  <Typography variant="body2" sx={{ fontWeight: 500, ml: 0.5 }}>
                    {isPositive ? "+" : ""}
                    {item.change}%
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        );
      })}
    </Box>
  );
};
