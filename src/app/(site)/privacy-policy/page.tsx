"use client";

import { Box, Typography, CircularProgress } from "@mui/material";
import { useState, useEffect } from "react";

interface Privacy_PoliciesEntry {
  id: number;
  content: string;
  imageUrl?: string;
  title?: string;
}

const Privacy_Policies = () => {
  const [privacyPoliciesList, setPrivacyPoliciesList] = useState<Privacy_PoliciesEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        const res = await fetch("/api/information/id?type=PRIVACY_POLICIES", { cache: "no-store" });
        if (!res.ok) throw new Error(`Failed to fetch Privacy Policies (${res.status})`);

        const data = await res.json();
        if (alive && Array.isArray(data)) setPrivacyPoliciesList(data);
      } catch (err: unknown) {
        if (err instanceof Error) setError(err.message);
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => { alive = false; };
  }, []);

  if (loading) return <CircularProgress sx={{ display: "block", mx: "auto", mt: 4 }} />;
  if (error) return <Typography color="error">{error}</Typography>;
  if (privacyPoliciesList.length === 0) return <Typography>No Privacy Policies content available.</Typography>;

  return (
    <Box sx={{ maxWidth: 900, mx: "auto", p: 3, display: "flex", flexDirection: "column", gap: 4 }}>
      {privacyPoliciesList.map((policy) => (
        <Box key={policy.id}>
          {policy.title && (
            <Typography className="text-red-600"  variant="h3" fontWeight="bold" gutterBottom textAlign="center">
              {policy.title}
            </Typography>
          )}

          {policy.imageUrl && (
            <Box
              component="img"
              src={policy.imageUrl}
              alt={policy.title || "Privacy Policy Image"}
              sx={{ width: "100%", maxHeight: 400, objectFit: "cover", borderRadius: 3, mb: 2 }}
            />
          )}

          <Typography
            variant="body1"
            sx={{ lineHeight: 1.7 }}
            dangerouslySetInnerHTML={{ __html: policy.content }}
          />
        </Box>
      ))}
    </Box>
  );
};

export default Privacy_Policies;
