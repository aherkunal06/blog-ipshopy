// components/VerticalTabs.tsx
"use client";

import React from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  IconButton,
  Box,
  Divider,
  Typography,
  Button,
  Avatar,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";

type DrawerItem = {
  label: string;
  key: string;
};

const drawerWidth = 240;

const drawerItems: DrawerItem[] = [
  { label: "Newsroom Coverage", key: "newsroom" },
  { label: "Categories", key: "categories" },
  { label: "Stories", key: "stories" },
  { label: "About Us", key: "about" },
  { label: "Profile", key: "profile" },
];

interface VerticalTabsProps {
  isOpen: boolean;
  onDrawerToggle: (open: boolean) => void;
  selectedTab: string;
  onSelectTab: (key: string) => void;
}

const VerticalTabs: React.FC<VerticalTabsProps> = ({
  isOpen,
  onDrawerToggle,
  selectedTab,
  onSelectTab,
}) => {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("sm"));

  const user = {
    name: "Ameya Thakur",
    avatarUrl: "/avatar.jpg",
  };

  return (
    <Box>
      <Box sx={{ p: 2, mt: "3rem" }}>
        <IconButton onClick={() => onDrawerToggle(!isOpen)}>
          <MenuIcon />
        </IconButton>
      </Box>

      <Drawer
        variant={isDesktop ? "persistent" : "temporary"}
        open={isOpen}
        anchor="left"
        onClose={() => onDrawerToggle(false)}
        ModalProps={{
          keepMounted: true,
          hideBackdrop: true,
        }}
        sx={{
          "& .MuiDrawer-paper": {
            position: "absolute",
            top: 76,
            width: drawerWidth,
            height: {
              xs: "88%", // mobile
              sm: "60%", // small screen
              md: "95%", // tablet
              lg: "90%", // desktop
            },
            background: "#183F79",
            backgroundImage:
              "linear-gradient(90deg, rgba(24, 63, 121, 1) 0%, rgba(38, 84, 166, 1) 50%)",
            color: "#fff",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          },
        }}
      >
        <Box>
          <Box
            sx={{ display: "flex", justifyContent: "flex-end", px: 2, pt: 2 }}
          >
            <IconButton onClick={() => onDrawerToggle(false)}>
              <CloseIcon />
            </IconButton>
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              mt: 1,
            }}
          >
            <Avatar
              src={user.avatarUrl}
              sx={{ width: 64, height: 64, mb: 1 }}
            />
            <Typography variant="subtitle1" fontWeight={600}>
              {user.name}
            </Typography>
          </Box>

          <Divider sx={{ my: 2 }} />

          <List>
            {drawerItems.map((item) => (
              <ListItem key={item.key} disablePadding>
                <ListItemButton
                  selected={selectedTab === item.key}
                  onClick={() => onSelectTab(item.key)}
                >
                  <ListItemText primary={item.label} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>

        <Box sx={{ px: 2, py: 2 }}>
          <Divider sx={{ mb: 2 }} />
          <Button
            variant="contained"
            color="error"
            fullWidth
            onClick={() => console.log("Logout")}
          >
            Logout
          </Button>
          <Typography
            variant="caption"
            display="block"
            textAlign="center"
            mt={1}
          >
            v1.0.0
          </Typography>
        </Box>
      </Drawer>
    </Box>
  );
};

export { drawerWidth };
export default VerticalTabs;
