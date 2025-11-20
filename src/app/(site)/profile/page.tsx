"use client";

import React, { JSX, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Card,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import VerticalTabs, { drawerWidth } from "@/components/VerticalTabs";
import LockIcon from "@mui/icons-material/Lock";
import GppGoodIcon from "@mui/icons-material/GppGood";

const Profile = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 3,
        maxWidth: 900,
        mx: "auto",
        p: { xs: 2, md: 3 },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", sm: "center" },
          gap: 1,
        }}
      >
        <Typography variant="h5">Account Information</Typography>
        <Button variant="contained" size="small">
          Edit Information
        </Button>
      </Box>

      {/* Name Section */}
      <Card
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          p: 2,
          flexWrap: "wrap",
        }}
      >
        <Avatar
          alt="Remy Sharp"
          src="/static/images/avatar/1.jpg"
          sx={{ width: 56, height: 56 }}
        />
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            gap: 2,
            flex: 1,
            width: "100%",
          }}
        >
          <TextField
            fullWidth
            label="First Name"
            variant="outlined"
            size="small"
          />
          <TextField
            fullWidth
            label="Last Name"
            variant="outlined"
            size="small"
          />
        </Box>
      </Card>

      {/* Contact Section */}
      <Card sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Contact Information
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            gap: 2,
          }}
        >
          <TextField
            label="Email Address"
            variant="outlined"
            size="small"
            fullWidth
          />
          <TextField
            label="Phone Number"
            variant="outlined"
            size="small"
            fullWidth
          />
        </Box>
      </Card>

      {/* Security Section */}
      <Card sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Security
        </Typography>

        {/* Password */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", sm: "center" },
            p: 2,
            border: "1px solid #e0e0e0",
            borderRadius: 2,
            mb: 2,
            gap: 2,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <LockIcon color="action" />
            <Box>
              <Typography variant="subtitle1" fontWeight="bold">
                Password
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Last updated: January 15, 2024
              </Typography>
            </Box>
          </Box>
          <Button variant="text">Change</Button>
        </Box>

        {/* 2FA */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", sm: "center" },
            p: 2,
            border: "1px solid #e0e0e0",
            borderRadius: 2,
            gap: 2,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <GppGoodIcon color="action" />
            <Box>
              <Typography variant="subtitle1" fontWeight="bold">
                Two-Factor Authentication
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Add an extra layer of security
              </Typography>
            </Box>
          </Box>
          <Button variant="text">Change</Button>
        </Box>
      </Card>
    </Box>
  );
};

const tabContentMap: Record<string, JSX.Element> = {
  newsroom: (
    <>
      <h1>Newsroom Coverage</h1>
      <p>Latest media coverage and updates.</p>
      <h1>Newsroom Coverage</h1>
      <p>Latest media coverage and updates.</p>
      <h1>Newsroom Coverage</h1>
      <p>Latest media coverage and updates.</p>
      <h1>Newsroom Coverage</h1>
      <p>Latest media coverage and updates.</p>
      <h1>Newsroom Coverage</h1>
      <p>Latest media coverage and updates.</p>
      <h1>Newsroom Coverage</h1>
      <p>Latest media coverage and updates.</p>
      <h1>Newsroom Coverage</h1>
      <p>Latest media coverage and updates.</p>
      <h1>Newsroom Coverage</h1>
      <p>Latest media coverage and updates.</p>
      <h1>Newsroom Coverage</h1>
      <p>Latest media coverage and updates.</p>
      <h1>Newsroom Coverage</h1>
      <p>Latest media coverage and updates.</p>
      <h1>Newsroom Coverage</h1>
      <p>Latest media coverage and updates.</p>
      <h1>Newsroom Coverage</h1>
      <p>Latest media coverage and updates.</p>
      <h1>Newsroom Coverage</h1>
      <p>Latest media coverage and updates.</p>
      <h1>Newsroom Coverage</h1>
      <p>Latest media coverage and updates.</p>
      <h1>Newsroom Coverage</h1>
      <p>Latest media coverage and updates.</p>
      <h1>Newsroom Coverage</h1>
      <p>Latest media coverage and updates.</p>
      <h1>Newsroom Coverage</h1>
      <p>Latest media coverage and updates.</p>
      <h1>Newsroom Coverage</h1>
      <p>Latest media coverage and updates.</p>
    </>
  ),
  categories: (
    <>
      <h1>Categories</h1>
      <p>Manage your content categories.</p>
      <h1>Categories</h1>
      <p>Manage your content categories.</p>
      <h1>Categories</h1>
      <p>Manage your content categories.</p>
    </>
  ),
  stories: (
    <>
      <h1>Stories</h1>
      <p>Curated stories and articles here.</p>
    </>
  ),
  about: (
    <>
      <h1>About Us</h1>
      <p>Learn more about our mission and team.</p>
    </>
  ),
  profile: <Profile />,
};

const TabbedDashboard = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState("newsroom");

  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("sm"));

  return (
    <Box sx={{ display: "flex" }}>
      <VerticalTabs
        isOpen={drawerOpen}
        onDrawerToggle={setDrawerOpen}
        selectedTab={selectedTab}
        onSelectTab={setSelectedTab}
      />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          pl: isDesktop && drawerOpen ? `${drawerWidth - 85}px` : 0,
          transition: "padding-left 0.3s ease",
          mt: "3rem",
        }}
      >
        <Box sx={{ p: 2 }}>
          {tabContentMap[selectedTab] || <p>Tab not found.</p>}
        </Box>
      </Box>
    </Box>
  );
};

export default TabbedDashboard;
