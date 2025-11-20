"use client";

import BasicTable from "@/admin-components/BasicTable";
import {
  Autocomplete,
  Avatar,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { MRT_ColumnDef } from "material-react-table";
import React, { useMemo, useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import BasicTabs from "@/admin-components/BasicTabs";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";

type Role = {
  name: string;
  username: string;
  posts: number;
  role: "Admin" | "Editor" | "Contributor" | "Viewer";
  status: "Active" | "Inactive";
};

const roleData: Role[] = [
  {
    name: "Alice Johnson",
    username: "alice@example.com",
    posts: 5,
    role: "Admin",
    status: "Active",
  },
  {
    name: "Bob Smith",
    username: "bob@example.com",
    posts: 12,
    role: "Editor",
    status: "Inactive",
  },
  {
    name: "Charlie Lee",
    username: "charlie@example.com",
    posts: 28,
    role: "Contributor",
    status: "Active",
  },
  {
    name: "Diana Ross",
    username: "diana@example.com",
    posts: 45,
    role: "Viewer",
    status: "Inactive",
  },
];

const validationSchema = Yup.object().shape({
  name: Yup.string().required("Full Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .min(6, "Minimum 6 characters")
    .required("Password is required"),
  role: Yup.string().required("Role is required"),
  bio: Yup.string().required("Bio is required"),
  profilePicture: Yup.mixed().required("Profile picture is required"),
});

const roleAction = [
  { label: "Admin" },
  { label: "Editor" },
  { label: "Contributor" },
];

const AllUsers = () => {
  const [open, setOpen] = useState(false);
  const [preview, setPreview] = useState(null);

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setPreview(null);
  };

  const initialValues = {
    name: "",
    email: "",
    password: "",
    role: "",
    bio: "",
    profilePicture: null,
  };

  const handleSubmit = (values, { resetForm }) => {
    console.log("Form Submitted", values);
    resetForm();
    handleClose();
  };

  const columns = useMemo<MRT_ColumnDef<Role>[]>(
    () => [
      {
        accessorKey: "name",
        header: "User",
        Cell: ({ row }) => (
          <Stack direction="row" alignItems="center" spacing={1}>
            <Avatar sx={{ bgcolor: "primary.main" }}>
              {row.original.name.charAt(0)}
            </Avatar>
            <Box>
              <Typography variant="body2">{row.original.name}</Typography>
            </Box>
          </Stack>
        ),
      },
      {
        accessorKey: "username",
        header: "Username",
        Cell: ({ cell }) => (
          <Typography variant="body2" color="text.secondary">
            @{cell.getValue<string>()}
          </Typography>
        ),
      },
      {
        accessorKey: "role",
        header: "Role",
        Cell: ({ cell }) => (
          <Chip
            label={cell.getValue()}
            size="small"
            sx={{
              bgcolor:
                cell.getValue() === "Admin"
                  ? "#f44336"
                  : cell.getValue() === "Editor"
                  ? "#1976d2"
                  : cell.getValue() === "Contributor"
                  ? "#9c27b0"
                  : "#e0e0e0",
              color: "#fff",
            }}
          />
        ),
      },
      {
        accessorKey: "status",
        header: "Status",
        Cell: ({ cell }) => (
          <Chip
            label={cell.getValue()}
            size="small"
            sx={{
              bgcolor: cell.getValue() === "Active" ? "#4caf50" : "#e0e0e0",
              color: cell.getValue() === "Active" ? "#fff" : "#000",
            }}
          />
        ),
      },
      {
        accessorKey: "posts",
        header: "Posts",
      },
      {
        id: "actions",
        header: "Actions",
        Cell: ({ row }) => (
          <>
            <Tooltip title="Edit">
              <IconButton
                color="primary"
                onClick={() => alert(`Edit ${row.original.name}`)}
              >
                <EditIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete">
              <IconButton
                color="error"
                onClick={() => alert(`Delete ${row.original.name}`)}
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

  return (
    <>
      <BasicTable
        data={roleData}
        columns={columns}
        enableRowSelection={true}
        onRowSelectionChange={(selectedRows) => {
          console.log("Selected Rows:", selectedRows);
        }}
        topToolbarActions={() => (
          <Stack direction="row" spacing={2} padding={2}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleClickOpen}
            >
              Add New Role
            </Button>
          </Stack>
        )}
      />
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Create New User</DialogTitle>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            setFieldValue,
          }) => (
            <Form>
              <DialogContent
                sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
              >
                <TextField
                  label="Full Name"
                  name="name"
                  value={values.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.name && Boolean(errors.name)}
                  helperText={touched.name && errors.name}
                  fullWidth
                  required
                />

                <TextField
                  label="Email"
                  name="email"
                  type="email"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.email && Boolean(errors.email)}
                  helperText={touched.email && errors.email}
                  fullWidth
                  required
                />

                <TextField
                  label="Password"
                  name="password"
                  type="password"
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.password && Boolean(errors.password)}
                  helperText={touched.password && errors.password}
                  fullWidth
                  required
                />

                <Autocomplete
                  options={roleAction}
                  getOptionLabel={(option) => option.label}
                  value={
                    roleAction.find((opt) => opt.label === values.role) || null
                  }
                  onChange={(e, value) =>
                    setFieldValue("role", value ? value.label : "")
                  }
                  onBlur={handleBlur}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Role"
                      name="role"
                      error={touched.role && Boolean(errors.role)}
                      helperText={touched.role && errors.role}
                      fullWidth
                      required
                    />
                  )}
                />

                <TextField
                  rows={3}
                  multiline
                  label="Bio"
                  name="bio"
                  value={values.bio}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.bio && Boolean(errors.bio)}
                  helperText={touched.bio && errors.bio}
                  fullWidth
                  required
                />

                <Stack direction="row" spacing={2} alignItems="center">
                  <Button variant="outlined" component="label">
                    Upload Profile Picture
                    <input
                      type="file"
                      accept="image/*"
                      hidden
                      onChange={(event) => {
                        const file = event.currentTarget.files[0];
                        if (file) {
                          setFieldValue("profilePicture", file);
                          setPreview(URL.createObjectURL(file));
                        }
                      }}
                    />
                  </Button>
                  {preview && <Avatar src={preview} alt="Preview" />}
                </Stack>
                {touched.profilePicture && errors.profilePicture && (
                  <Typography color="error" variant="caption">
                    {errors.profilePicture}
                  </Typography>
                )}
              </DialogContent>

              <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button type="submit" variant="contained">
                  Create
                </Button>
              </DialogActions>
            </Form>
          )}
        </Formik>
      </Dialog>
    </>
  );
};

const tabData = [
  {
    label: "All Users",
    content: <AllUsers />,
  },
  {
    label: "Admins",
    content: <Typography>Pricing details here</Typography>,
  },
  {
    label: "Contributors/Editors",
    content: <Typography>Frequently asked questions</Typography>,
  },
];

const UserAuthorManagement = () => {
  return (
    <div>
      <Typography variant="h4" sx={{ mb: 3 }}>
        User & Author Management
      </Typography>
      <BasicTabs tabs={tabData} />
    </div>
  );
};

export default UserAuthorManagement;
