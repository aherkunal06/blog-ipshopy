"use client";

import { Box, Typography, CircularProgress } from "@mui/material";
import { useState, useEffect } from "react";

interface Terms_PageEntry {
  id: number;
  content: string;
  imageUrl?: string;
  title?: string;
}

const Terms_Page = () => {
  const [termsList, setTermsList] = useState<Terms_PageEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        const res = await fetch("/api/information/id?type=TERMS", { cache: "no-store" });
        if (!res.ok) throw new Error(`Failed to fetch Terms (${res.status})`);

        const data = await res.json();
        if (alive && Array.isArray(data)) setTermsList(data);
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
  if (termsList.length === 0) return <Typography>No Terms content available.</Typography>;

  return (
    <Box sx={{ maxWidth: 900, mx: "auto", p: 3, display: "flex", flexDirection: "column", gap: 4 }}>
      {termsList.map((term) => (
        <Box key={term.id}>
          {term.title && (
            <Typography variant="h3" fontWeight="bold" gutterBottom textAlign="center">
              {term.title}
            </Typography>
          )}

          {term.imageUrl && (
            <Box
              component="img"
              src={term.imageUrl}
              alt={term.title || "Terms Image"}
              sx={{ width: "100%", maxHeight: 400, objectFit: "cover", borderRadius: 3, mb: 2 }}
            />
          )}

          <Typography
            variant="body1"
            sx={{ lineHeight: 1.7 }}
            dangerouslySetInnerHTML={{ __html: term.content }}
          />
        </Box>
      ))}
    </Box>
  );
};

export default Terms_Page;
