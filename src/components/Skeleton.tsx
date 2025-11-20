"use client";

import React from "react";
import { Box, Card, CardContent, Skeleton, Stack } from "@mui/material";
import { useThemeContext } from "@/context/ThemeContext";

interface CardsSkeletonProps {
  count?: number;
  aspectRatio?: string; // e.g., '16 / 9'
  cardRadius?: number;
}

const CardsSkeleton: React.FC<CardsSkeletonProps> = ({
  count = 6,
  aspectRatio = "16 / 9",
  cardRadius = 12,
}) => {
  const { theme } = useThemeContext();
  const isDark = theme === "dark";

  // Theme-based colors
  const cardBg = isDark ? "grey.900" : "background.paper";
  const borderColor = isDark ? "grey.700" : "divider";
  const skeletonBase = isDark ? "grey.800" : "grey.300";
  const skeletonHighlight = isDark ? "grey.700" : "grey.100";

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "1fr 1fr 1fr" },
        gap: 4, // equal row/col spacing
      }}
    >
      {Array.from({ length: count }).map((_, i) => (
        <Card
          key={i}
          elevation={0}
          sx={{
            borderRadius: cardRadius,
            overflow: "hidden",
            border: "1px solid",
            borderColor: borderColor,
            bgcolor: cardBg,
          }}
        >
          {/* Media area */}
          <Box sx={{ width: "100%", aspectRatio, position: "relative" }}>
            <Skeleton
              variant="rectangular"
              animation="wave"
              width="100%"
              height="100%"
              sx={{
                position: "absolute",
                inset: 0,
                bgcolor: skeletonBase,
              }}
            />
          </Box>

          <CardContent sx={{ pt: 2 }}>
            {/* Title lines */}
            <Skeleton
              animation="wave"
              variant="text"
              height={28}
              width="80%"
              sx={{ bgcolor: skeletonBase }}
            />
            <Skeleton
              animation="wave"
              variant="text"
              height={22}
              width="60%"
              sx={{ mt: 1, bgcolor: skeletonBase }}
            />

            {/* Author row */}
            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mt: 2 }}>
              <Skeleton
                animation="wave"
                variant="circular"
                width={30}
                height={30}
                sx={{ bgcolor: skeletonBase }}
              />
              <Skeleton
                animation="wave"
                variant="text"
                height={20}
                width="30%"
                sx={{ bgcolor: skeletonBase }}
              />
            </Stack>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};

export default CardsSkeleton;
