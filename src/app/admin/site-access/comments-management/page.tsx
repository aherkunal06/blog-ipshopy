"use client";

import {
  Autocomplete,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  InputAdornment,
  Pagination,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";
import LinkIcon from "@mui/icons-material/Link";
import SearchIcon from "@mui/icons-material/Search";

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

const top100Films = [
  { label: "Bulk Actions" },
  { label: "Bulk Actions" },
  { label: "Bulk Actions" },
  { label: "Bulk Actions" },
];

const CardData = [
  {
    id: 1,
    user: {
      name: "Sarah Johnson",
      avatar: "/static/images/avatar/1.jpg",
    },
    meta: {
      timeAgo: "2 hours ago",
      ip: "192.168.1.0",
    },
    comment:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Libero, eum? Lorem ipsum dolor sit amet consectetur adipisicing elit. Asperiores, consequuntur!",
    status: "Pending",
    postTitle: "Getting Started with React",
    actions: ["Approve", "Delete", "Block User"],
  },
  {
    id: 2,
    user: {
      name: "John Doe",
      avatar: "/static/images/avatar/2.jpg",
    },
    meta: {
      timeAgo: "5 hours ago",
      ip: "192.168.1.5",
    },
    comment: "This is another example comment for testing multiple cards.",
    status: "Approved",
    postTitle: "Understanding Material UI",
    actions: ["Delete", "Block User"],
  },
  {
    id: 3,
    user: {
      name: "John Doe",
      avatar: "/static/images/avatar/2.jpg",
    },
    meta: {
      timeAgo: "5 hours ago",
      ip: "192.168.1.5",
    },
    comment: "This is another example comment for testing multiple cards.",
    status: "Approved",
    postTitle: "Understanding Material UI",
    actions: ["Delete", "Block User"],
  },
];

const CommentsManagements = () => {
  
  return (
    <>
      <Box>
        <Cards data={cardsData} />
      </Box>

      <Box sx={{ mt: 2, display: "flex", gap: 2 }}>
        <Autocomplete
          disablePortal
          options={top100Films}
          sx={{ width: 300 }}
          renderInput={(params) => (
            <TextField {...params} label="Movie" size="small" />
          )}
        />
        <TextField
          id="outlined-basic"
          label="Search"
          variant="outlined"
          sx={{ width: 300 }}
          size="small"
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            },
          }}
        />
      </Box>

      <Box sx={{ mt: 2 }}>
        <Grid
          container
          spacing={{ xs: 2, md: 3 }}
          columns={{ xs: 4, sm: 8, md: 12 }}
        >
          {CardData.map((item, index) => (
            <Grid key={index} size={{ xs: 12, sm: 12, md: 12 }}>
              <CardComments data={item} />
            </Grid>
          ))}
        </Grid>
      </Box>

       <Box sx={{ mt: 3, display: "flex", justifyContent: "center" }}>
        <Pagination count={10} />
      </Box>

    </>
  );
};

export default CommentsManagements;

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
          <Card key={index} elevation={3} sx={{ borderRadius: 2, p: 1 }}>
            <CardContent>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                {/* Icon with circle background */}
                <Box
                  sx={{
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    // bgcolor: "primary.light",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    // color: "primary.main",
                  }}
                >
                  {item.icon}
                </Box>

                {/* Change % with accent background */}
                <Box
                  sx={{
                    px: 1,
                    py: 0.2,
                    borderRadius: 1,
                    // bgcolor: isPositive ? "success.light" : "error.light",
                    // color: isPositive ? "success.dark" : "error.dark",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                  }}
                >
                  {isPositive ? "+" : ""}
                  {item.change}%
                </Box>
              </Box>

              {/* Title */}
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 1, mb: 1 }}
              >
                {item.title}
              </Typography>

              {/* Value */}
              <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                {item.value}
              </Typography>
            </CardContent>
          </Card>
        );
      })}
    </Box>
  );
};

const CardComments = ({ data }) => {
  return (
    <Card sx={{ p: 2, mb: 2 }}>
      {/* Header: User info + IP */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {/* Left - Avatar + Name + Time */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Avatar alt={data.user.name} src={data.user.avatar} />
          <Box>
            <Typography variant="subtitle1" fontWeight="bold">
              {data.user.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {data.meta.timeAgo}
            </Typography>
          </Box>
        </Box>

        {/* Right - IP Address */}
        <Typography variant="body2" color="text.secondary">
          IP: {data.meta.ip}
        </Typography>
      </Box>

      {/* Comment Content */}
      <CardContent sx={{ px: 0 }}>
        <Typography variant="body1">{data.comment}</Typography>
      </CardContent>

      {/* Footer: Status + Actions */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mt: 1,
        }}
      >
        {/* Status */}
        <Box sx={{ display: "flex", gap: 1 }}>
          <Typography
            variant="body2"
            fontWeight="bold"
            color={
              data.status === "Pending"
                ? "warning.main"
                : data.status === "Approved"
                ? "success.main"
                : "text.secondary"
            }
          >
            {data.status}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            on "{data.postTitle}"
          </Typography>
        </Box>

        {/* Actions */}
        <Box sx={{ display: "flex", gap: 1 }}>
          {data.actions.map((action) => (
            <Button
              key={action}
              size="small"
              variant="text"
              color={
                action === "Approve"
                  ? "success"
                  : action === "Delete"
                  ? "error"
                  : action === "Block User"
                  ? "warning"
                  : "primary"
              }
            >
              {action}
            </Button>
          ))}
        </Box>
      </Box>
    </Card>
  );
};
