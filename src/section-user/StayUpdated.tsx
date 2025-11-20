"use client";

import { Box, Button, TextField, Typography, InputAdornment } from "@mui/material";
import React from "react";
import MailOutlineIcon from "@mui/icons-material/MailOutline";

const StayUpdated = () => {
  return (
    <Box
      sx={{
        position: "relative",
        background: "linear-gradient(135deg, #0f1d3a, #143a7a)",
        color: "white",
        textAlign: "center",
        py: { xs: 8, md: 12 },
        px: { xs: 3, md: 6 },
        overflow: "hidden",
      }}
    >
      {/* Floating background accents */}
      <Box
        sx={{
          position: "absolute",
          top: -80,
          left: -50,
          width: 220,
          height: 220,
          borderRadius: "50%",
          background: "radial-gradient(circle, #60a5fa33, transparent)",
          filter: "blur(90px)",
          zIndex: 0,
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: -100,
          right: -70,
          width: 260,
          height: 260,
          borderRadius: "50%",
          background: "radial-gradient(circle, #22d3ee33, transparent)",
          filter: "blur(120px)",
          zIndex: 0,
        }}
      />

      {/* Section Content */}
      <Typography
        variant="h3"
        sx={{
          fontWeight: 800,
          fontSize: { xs: "1.8rem", md: "2.5rem" },
          mb: 2,
          position: "relative",
          zIndex: 1,
          display: "inline-flex",
          alignItems: "center",
          gap: 1,
          whiteSpace: "nowrap",
          background: "linear-gradient(90deg, #60a5fa, #22d3ee, #3b82f6)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          transition: "0.5s ease",
          "& span": {
            display: "inline-block",
            animation: "bounceEmoji 2s infinite alternate",
            fontSize: { xs: "2rem", md: "2.5rem" },
          },
          "@keyframes bounceEmoji": {
            "0%": { transform: "translateY(0px)" },
            "100%": { transform: "translateY(-5px)" },
          },
        }}
      >
        Stay Updated <span>📰</span>
      </Typography>

      <Typography
        variant="subtitle1"
        sx={{
          mb: 4,
          color: "rgba(255,255,255,0.85)",
          maxWidth: 800,
          mx: "auto",
          position: "relative",
          zIndex: 1,
          fontSize: { xs: "1rem", md: "1.1rem" },
        }}
      >
        Subscribe to our newsletter ✉️ and never miss new articles, updates, and exclusive content.
      </Typography>

      {/* Form row */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 2,
          flexDirection: { xs: "column", sm: "row" },
          position: "relative",
          zIndex: 1,
          maxWidth: 600,
          mx: "auto",
          width: "100%",
        }}
      >
        <TextField
          fullWidth
          placeholder="Enter your email"
          size="medium"
          variant="outlined"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <MailOutlineIcon color="primary" />
              </InputAdornment>
            ),
          }}
          sx={{
            flex: "1 1 320px",
            backgroundColor: "white",
            borderRadius: "999px",
            "& .MuiOutlinedInput-root": {
              borderRadius: "999px",
            },
            // Focus ring + border color
            "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "#22d3ee",
              boxShadow: "0 0 12px rgba(34,211,238,0.4)",
            },
            // Adornment color on focus
            "& .MuiOutlinedInput-root.Mui-focused .MuiInputAdornment-root": {
              color: "#22d3ee",
            },
          }}
        />

        <Button
          variant="contained"
          sx={{
            flex: "0 0 auto",
            px: { xs: 4, md: 5 },
            py: 1.5,
            minWidth: 190,          // ensures one-line label
            whiteSpace: "nowrap",   // prevent wrap
            borderRadius: "999px",
            fontWeight: 600,
            textTransform: "none",
            background: "linear-gradient(90deg, #60a5fa, #22d3ee)",
            transition: "all 0.3s ease",
            boxShadow: "0 4px 15px rgba(34,211,238,0.3)",
            "&:hover": {
              transform: "translateY(-2px)",
              boxShadow: "0 8px 25px rgba(34,211,238,0.5)",
              background: "linear-gradient(90deg, #4fd7f0, #3b82f6)",
            },
          }}
        >
          Subscribe 📨
        </Button>
      </Box>
    </Box>
  );
};

export default StayUpdated;
