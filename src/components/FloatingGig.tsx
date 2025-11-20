// app/components/FloatingBg.tsx
"use client";

import { Box } from "@mui/material";

export const FloatingBg = () => (
  <Box
    aria-hidden
    sx={{
      position: "fixed",
      inset: 0,
      width: "100vw",
      height: "100vh",
      pointerEvents: "none",
      zIndex: -1,
      backgroundImage: "url('/2.webp')", // ensure public/2.webp exists
      backgroundRepeat: "no-repeat",
      backgroundPosition: "right -20px bottom -20px", // adjust offsets as needed
      backgroundSize: { xs: "240px", sm: "300px", md: "380px", lg: "460px" },
      opacity: 0.18, // increase/decrease visibility
      filter: "saturate(110%) contrast(105%)",
    }}
  />
);
