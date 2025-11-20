"use client";

import React, { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Box, Button, TextField } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import TextEditor from "@/admin-components/TextEditor";

interface InformationPrivacyPolicyFormProps {
  existingData?: {
    id: number;
    title: string;
    content: string;
    createdDate?: string;
    updatedDate?: string;
  };
}

const InformationPrivatePolicy = ({
  existingData,
}: InformationPrivacyPolicyFormProps) => {
  const formik = useFormik({
    initialValues: {
      title: existingData?.title || "",
      content: existingData?.content || "",
      createdDate: existingData?.createdDate
        ? dayjs(existingData.createdDate).toDate()
        : null,
      updatedDate: existingData?.updatedDate
        ? dayjs(existingData.updatedDate).toDate()
        : null,
    },
    validationSchema: Yup.object({
      title: Yup.string().required("Title is required"),
      content: Yup.string().required("Content is required"),
      createdDate: Yup.date().nullable(),
      updatedDate: Yup.date().nullable(),
    }),
    onSubmit: async (values) => {
      console.log("Submitted values:", values);

      // Example POST request to your API
      const res = await fetch("/api/privacy", {
        method: existingData ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await res.json();
      console.log("Saved Policy:", data);
    },
  });

  // Auto-set createdDate when creating new
  useEffect(() => {
    if (!existingData) {
      formik.setFieldValue("createdDate", dayjs().toDate());
    }
  }, [existingData]);

  // Auto-set updatedDate when editing
  useEffect(() => {
    if (existingData) {
      formik.setFieldValue("updatedDate", dayjs().toDate());
    }
  }, [existingData]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <form onSubmit={formik.handleSubmit}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            width: 500,
            margin: "auto",
          }}
        >
          {/* ✅ Title (Formik bound) */}
          <TextField
            id="title"
            name="title"
            label="Title"
            variant="outlined"
            fullWidth
            value={formik.values.title}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={Boolean(formik.touched.title && formik.errors.title)}
            helperText={formik.touched.title && formik.errors.title}
          />

          {/* ✅ Content (TextEditor bound) */}
          <TextEditor
            name="content"
            value={formik.values.content}
            onChange={(value: string) => formik.setFieldValue("content", value)}
            onBlur={() => formik.setFieldTouched("content", true)}
            error={Boolean(formik.touched.content && formik.errors.content)}
            helperText={formik.touched.content && formik.errors.content}
          />

          {/* ✅ Created Date (auto, readonly) */}
          <DatePicker
            label="Created Date"
            value={
              formik.values.createdDate
                ? dayjs(formik.values.createdDate)
                : null
            }
            onChange={(newValue) =>
              formik.setFieldValue(
                "createdDate",
                newValue ? newValue.toDate() : null
              )
            }
            slotProps={{
              textField: {
                fullWidth: true,
                disabled: true,
                error: Boolean(
                  formik.touched.createdDate && formik.errors.createdDate
                ),
                helperText:
                  formik.touched.createdDate && formik.errors.createdDate,
              },
            }}
          />

          {/* ✅ Updated Date (auto, readonly) */}
          <DatePicker
            label="Updated Date"
            value={
              formik.values.updatedDate
                ? dayjs(formik.values.updatedDate)
                : null
            }
            onChange={(newValue) =>
              formik.setFieldValue(
                "updatedDate",
                newValue ? newValue.toDate() : null
              )
            }
            slotProps={{
              textField: {
                fullWidth: true,
                disabled: true,
                error: Boolean(
                  formik.touched.updatedDate && formik.errors.updatedDate
                ),
                helperText:
                  formik.touched.updatedDate && formik.errors.updatedDate,
              },
            }}
          />

          <Button type="submit" variant="contained">
            {existingData ? "Update" : "Create"}
          </Button>
        </Box>
      </form>
    </LocalizationProvider>
  );
};

export default InformationPrivatePolicy;
