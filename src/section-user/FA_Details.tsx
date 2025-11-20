'use client'

import React from "react";
import { Box, Typography, Button } from "@mui/material";
import Image from "next/image";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";

const FA_Details: React.FC = () => {
  return (
    <Box
      sx={{
        border: "2px solid blue",
        borderRadius: "8px",
        padding: "2rem",
        marginTop: "3rem",
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        alignItems: "center",
        justifyContent: "space-between",
        gap: 4,
        textAlign: { xs: "center", md: "left" },
      }}
    >
      {/* Left Text */}
      <Box sx={{ flex: 1 }}>
        <Typography variant="h4" gutterBottom>
          IpShopy Stories are now on WhatsApp
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          Stay updated with our latest stories and news. Subscribe to our WhatsApp channel.
        </Typography>
        <Button variant="contained" startIcon={<WhatsAppIcon />} sx={{ mt: 2 }}>
          Subscribe Now
        </Button>
      </Box>

      {/* Right Image */}
      <Box sx={{ flex: 1, textAlign: "center" }}>
        <Image src={"/FA_Dec.png"} alt="WhatsApp promotion" width={300} height={200} style={{ maxWidth: "100%", height: "auto" }} />
      </Box>
    </Box>
  );
};

export default FA_Details;
