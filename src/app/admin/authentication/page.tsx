"use client";
import BasicTabs from "@/admin-components/BasicTabs";
import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  IconButton,
  Stack,
  Switch,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useMemo, useState } from "react";
import BasicTable from "../../../admin-components/BasicTable";
import { MRT_ColumnDef } from "material-react-table";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import EmailIcon from "@mui/icons-material/Email";
import ShieldIcon from "@mui/icons-material/Shield";

type Role = {
  roleName: string;
  description: string;
  totalUsers: number;
  lastUpdated: string;
};

const roleData: Role[] = [
  {
    roleName: "Admin",
    description: "Full system access with all permissions",
    totalUsers: 5,
    lastUpdated: "2024-07-01",
  },
  {
    roleName: "Editor",
    description: "Content management and user moderation",
    totalUsers: 12,
    lastUpdated: "2024-06-21",
  },
  {
    roleName: "Contributor",
    description: "Content creation and editing",
    totalUsers: 28,
    lastUpdated: "2024-07-15",
  },
  {
    roleName: "Viewer",
    description: "Read-only access to content",
    totalUsers: 45,
    lastUpdated: "2024-07-15",
  },
];

type Permission = {
  role: string;
  contentManagement: boolean;
  userManagement: boolean;
  settings: boolean;
  analytics: boolean;
  apiAccess: boolean;
};

const initialPermissions: Permission[] = [
  {
    role: "Admin",
    contentManagement: true,
    userManagement: true,
    settings: true,
    analytics: true,
    apiAccess: true,
  },
  {
    role: "Editor",
    contentManagement: true,
    userManagement: true,
    settings: false,
    analytics: true,
    apiAccess: false,
  },
  {
    role: "Contributor",
    contentManagement: true,
    userManagement: false,
    settings: false,
    analytics: false,
    apiAccess: false,
  },
  {
    role: "Viewer",
    contentManagement: false,
    userManagement: false,
    settings: false,
    analytics: true,
    apiAccess: false,
  },
];

const twoFactorAuth = [
  { label: "Default" },
  { label: "The Godfather" },
  { label: "The Godfather: Part II" },
  { label: "The Dark Knight" },
];

const UserRole = () => {
  const [permissions, setPermissions] =
    useState<Permission[]>(initialPermissions);

  const togglePermission = (
    rowIndex: number,
    key: keyof Omit<Permission, "role">
  ) => {
    setPermissions((prev) =>
      prev.map((row, i) =>
        i === rowIndex ? { ...row, [key]: !row[key] } : row
      )
    );
  };

  const columns = useMemo<MRT_ColumnDef<Role>[]>(
    () => [
      {
        accessorKey: "roleName",
        header: "Role Name",
      },
      {
        accessorKey: "description",
        header: "Description",
      },
      {
        accessorKey: "totalUsers",
        header: "Total Users",
      },
      {
        accessorKey: "lastUpdated",
        header: "Last Updated",
        Cell: ({ cell }) =>
          new Intl.DateTimeFormat("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }).format(new Date(cell.getValue<string>())),
      },
      {
        id: "actions",
        header: "Actions",
        Cell: ({ row }) => (
          <>
            <Tooltip title="Edit">
              <IconButton
                color="primary"
                onClick={() => alert(`Edit ${row.original.roleName}`)}
              >
                <EditIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete">
              <IconButton
                color="error"
                onClick={() => alert(`Delete ${row.original.roleName}`)}
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </>
        ),
      },
    ],
    []
  );

  const permissionColumns = useMemo<MRT_ColumnDef<Role>[]>(
    () => [
      {
        accessorKey: "roleName",
        header: "Role Name",
      },
      {
        accessorKey: "description",
        header: "Description",
      },
      {
        accessorKey: "totalUsers",
        header: "Total Users",
      },
      {
        accessorKey: "lastUpdated",
        header: "Last Updated",
        Cell: ({ cell }) =>
          new Intl.DateTimeFormat("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }).format(new Date(cell.getValue<string>())),
      },
      {
        id: "actions",
        header: "Actions",
        Cell: ({ row }) => (
          <>
            <Tooltip title="Edit">
              <IconButton
                color="primary"
                onClick={() => alert(`Edit ${row.original.roleName}`)}
              >
                <EditIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete">
              <IconButton
                color="error"
                onClick={() => alert(`Delete ${row.original.roleName}`)}
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </>
        ),
      },
    ],
    []
  );

  const permission_columns: MRT_ColumnDef<Permission>[] = useMemo(
    () => [
      {
        accessorKey: "role",
        header: "Role",
      },
      ...(
        [
          "contentManagement",
          "userManagement",
          "settings",
          "analytics",
          "apiAccess",
        ] as const
      ).map((key) => ({
        accessorKey: key,
        header: key
          .replace(/([A-Z])/g, " $1")
          .replace(/^./, (str) => str.toUpperCase()),
        Cell: ({ row }) => (
          <Checkbox
            checked={row.original[key]}
            onChange={() => togglePermission(row.index, key)}
          />
        ),
      })),
    ],
    [permissions]
  );

  const handleSave = () => {
    console.log("Saved Permissions:", permissions);
    alert("Permissions saved!");
  };

  return (
    <>
      <Box>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          User Roles
        </Typography>
        <BasicTable
          data={roleData}
          columns={columns}
          topToolbarActions={() => (
            <Stack direction="row" spacing={2} padding={2}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => alert("Add New Role")}
              >
                Add New Role
              </Button>
            </Stack>
          )}
        />
      </Box>

      <Box sx={{ mt: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          Permission Matrix
        </Typography>
        <BasicTable data={permissions} columns={permission_columns} />
        <Box textAlign="right" sx={{ marginRight: "3rem", marginTop: "1rem" }}>
          <Button variant="contained" color="primary" onClick={handleSave}>
            Save Changes
          </Button>
        </Box>
      </Box>

      <Box>
        <Typography variant="h6" sx={{ fontWeight: 700, mt: 3 }}>
          Authentication Settings
        </Typography>
        <Box>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              mt: 3,
              fontSize: {
                xs: "1.1rem",
                sm: "1.25rem",
                md: "1.5rem",
              },
            }}
          >
            Authentication Settings
          </Typography>

          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              gap: 3,
              mt: 2,
            }}
          >
            {/* Login Method */}
            <Box
              sx={{
                border: "1px solid gray",
                borderRadius: "10px",
                p: 2,
                flex: 1,
              }}
            >
              <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>
                Login Method
              </Typography>

              {["Email/Password", "Google SSO", "Apple ID"].map(
                (label, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mt: index === 0 ? 0 : 2,
                    }}
                  >
                    <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                      <EmailIcon />
                      <Typography variant="subtitle1">{label}</Typography>
                    </Box>
                    <Switch />
                  </Box>
                )
              )}
            </Box>

            {/* Security Settings */}
            <Box
              sx={{
                border: "1px solid gray",
                borderRadius: "10px",
                p: 2,
                flex: 1,
              }}
            >
              <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>
                Security Settings
              </Typography>

              {[
                "Two-Factor Authentication",
                "Session Timeout",
                "Password Reset Expiration",
              ].map((label, index) => (
                <Box
                  key={index}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: { xs: "flex-start", sm: "center" },
                    gap: 2,
                    mt: index === 0 ? 0 : 3,
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <ShieldIcon />
                    <Typography variant="subtitle1">{label}</Typography>
                  </Box>

                  <Autocomplete
                    disablePortal
                    options={twoFactorAuth}
                    sx={{
                      width: {
                        xs: "87px",
                        sm: "87px",
                      },
                      maxWidth: "150px",
                    }}
                    renderInput={(params) => (
                      <TextField {...params} label="Status" size="small" />
                    )}
                  />
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
};

const tabData = [
  {
    label: "User Roles",
    content: <UserRole />,
  },
  {
    label: "Permission Matrix",
    content: <Typography>Pricing details here</Typography>,
  },
  {
    label: "Access Logs",
    content: <Typography>Frequently asked questions</Typography>,
  },
  {
    label: "Settings",
    content: <Typography>Frequently asked questions</Typography>,
  },
];

const Authentication = () => {
  return (
    <Box>
      <Typography
        variant="h4"
        sx={{
          fontWeight: 700,
          p: 2,
          fontSize: {
            xs: "1.5rem", // ~24px
            sm: "2rem", // ~32px
            md: "2.25rem", // ~36px
          },
        }}
      >
        Authentication & Authorization
      </Typography>
      <BasicTabs tabs={tabData} />
    </Box>
  );
};

export default Authentication;
