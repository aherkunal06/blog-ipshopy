"use client";

import { Box, Button, Card, CardContent, IconButton, Typography } from "@mui/material";
import React, { useMemo, useState } from "react";
import LinkIcon from "@mui/icons-material/Link";
import { MRT_ColumnDef } from "material-react-table";
import BasicTable from "@/admin-components/BasicTable";
import SimpleLineChart from "@/admin-components/SimpleLineChart";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import TinyBarChart from "@/admin-components/TinyBarChart";
import CustomPieChart from "@/admin-components/CustomPieChart";

const cardsData = [
  {
    icon: <LinkIcon />,
    title: "Total Internal Links",
    value: "2847",
    change: "12",
  },
  {
    icon: <LinkIcon />,
    title: "Total Backlinks",
    value: "1236",
    change: "8",
  },
  {
    icon: <LinkIcon />,
    title: "Posts with 10+ Links",
    value: "156",
    change: "5",
  },
  {
    icon: <LinkIcon />,
    title: "Broken Links",
    value: "23",
    change: "-3",
  },
];

type Post = {
  id: number;
  title: string;
  suggestedLinks: string;
  status: string;
  action: "Auto-Link" | "Linked";
};

const postData: Post[] = [
  {
    id: 1,
    title: "10 SEO Tips for 2025",
    suggestedLinks:
      "https://example.com/seo-guide, https://example.com/keyword-research",
    status: "Linked",
    action: "Linked",
  },
  {
    id: 2,
    title: "Internal Linking Strategies",
    suggestedLinks:
      "https://example.com/link-building, https://example.com/site-structure",
    status: "UnLinked",
    action: "Auto-Link",
  },
  {
    id: 3,
    title: "Backlink Building Guide",
    suggestedLinks:
      "https://example.com/backlinks, https://example.com/outreach",
    status: "Linked",
    action: "Linked",
  },
];

type PostData = {
  blogPostTitle: string;
  linkedPage: string;
  anchorText: string;
  linkedType: string;
  lastUpdated: string;
};

const postDetails: PostData[] = [
  {
    blogPostTitle: "How to Use Next.js with MUI",
    linkedPage: "https://example.com/nextjs-mui",
    anchorText: "Next.js with MUI guide",
    linkedType: "Internal",
    lastUpdated: "2025-08-10",
  },
  {
    blogPostTitle: "SEO Best Practices",
    linkedPage: "https://example.com/seo/internal-linking",
    anchorText: "internal linking",
    linkedType: "Internal",
    lastUpdated: "2025-08-15",
  },
  {
    blogPostTitle: "React Performance Tips",
    linkedPage: "https://react.dev/performance",
    anchorText: "React docs",
    linkedType: "External",
    lastUpdated: "2025-08-17",
  },
];

type BacklinkData = {
  referringDomain: string;
  targetUrl: string;
  anchorText: string;
  linkType: string;
  qualityScore: number;
  dateDetected: string;
};

const backlinkData: BacklinkData[] = [
  {
    referringDomain: "example.com",
    targetUrl: "https://yourwebsite.com/blog/seo-tips",
    anchorText: "SEO Tips",
    linkType: "DoFollow",
    qualityScore: 85,
    dateDetected: "2025-08-10",
  },
  {
    referringDomain: "techblog.io",
    targetUrl: "https://yourwebsite.com/tools/keyword-research",
    anchorText: "Keyword Research Tool",
    linkType: "NoFollow",
    qualityScore: 72,
    dateDetected: "2025-08-12",
  },
  {
    referringDomain: "marketinghub.net",
    targetUrl: "https://yourwebsite.com/case-studies/seo-growth",
    anchorText: "SEO Growth Case Study",
    linkType: "DoFollow",
    qualityScore: 90,
    dateDetected: "2025-08-15",
  },
];


const BacklinkIntrnalLink = () => {
  const columns: MRT_ColumnDef<Post>[] = [
    {
      accessorKey: "title",
      header: "Blog Title",
    },
    {
      accessorKey: "suggestedLinks",
      header: "Suggested Links",
    },
    {
      accessorKey: "status",
      header: "Status",
      Cell: ({ cell }) => {
        const value = cell.getValue<string>();

        let bgColor = "";
        let textColor = "#fff";

        if (value === "Linked") {
          bgColor = "#4caf50"; // green
        } else if (value === "UnLinked") {
          bgColor = "#f44336"; // red
        } else {
          bgColor = "#ff9800"; // orange (for Pending/other)
        }

        return (
          <Box
            sx={{
              backgroundColor: bgColor,
              color: textColor,
              px: 2,
              py: 0.5,
              borderRadius: "12px",
              display: "inline-block",
              fontWeight: "bold",
              textAlign: "center",
              minWidth: "80px",
            }}
          >
            {value}
          </Box>
        );
      },
    },
    {
      accessorKey: "action",
      header: "Actions",
      Cell: ({ cell }) => {
        const action = cell.getValue<"Auto-Link" | "Linked">();
        return (
          <Button
            variant="text"
            size="small"
            // color={action === "Linked" ? "success" : "primary"}
          >
            {action}
          </Button>
        );
      },
    },
  ];

  const detailsColumns: MRT_ColumnDef<PostData>[] = [
    {
      accessorKey: "blogPostTitle",
      header: "Blog Post Title",
    },
    {
      accessorKey: "linkedPage",
      header: "Linked Page",
      Cell: ({ cell }) => {
        const url = cell.getValue<string>();
        return (
          <a href={url} target="_blank" rel="noopener noreferrer">
            {url}
          </a>
        );
      },
    },
    {
      accessorKey: "anchorText",
      header: "Anchor Text",
    },
    {
      accessorKey: "linkedType",
      header: "Linked Type",
    },
    {
      accessorKey: "lastUpdated",
      header: "Last Updated",
    },
  ];

  const backlinkColumns: MRT_ColumnDef<BacklinkData>[] = [
    { accessorKey: "referringDomain", header: "Referring Domain" },
    { accessorKey: "targetUrl", header: "Target URL" },
    { accessorKey: "anchorText", header: "Anchor Text" },
    { accessorKey: "linkType", header: "Link Type" },
    { accessorKey: "qualityScore", header: "Quality Score" },
    { accessorKey: "dateDetected", header: "Date Detected" },

    {
    accessorKey: "actions",
    header: "Actions",
    Cell: ({ row }) => (
      <Box sx={{ display: "flex", gap: 1 }}>
        <IconButton
          color="primary"
          onClick={() => console.log("View", row.original)}
        >
          <VisibilityIcon />
        </IconButton>
        <IconButton
          color="error"
          onClick={() => console.log("Remove", row.original)}
        >
          <DeleteIcon />
        </IconButton>
      </Box>
    ),
  },
  ];

  return (
    <Box>
      <Box>
        <Typography variant="h3" gutterBottom>
          Backlink & Internal Link Monitoring
        </Typography>
      </Box>

      <Box>
        <Cards data={cardsData} />
      </Box>

      <Box sx={{ mt: 2 }}>
        {/* <Typography variant="h6">Internal Linking Suggestions</Typography> */}
        <BasicTable<Post>
          data={postData}
          columns={columns}
          topToolbarActions={() => (
            <Typography variant="h6" sx={{ p: 2 }}>
              Internal Linking Suggestions
            </Typography>
          )}
        />
      </Box>

      <Box sx={{ mt: 2 }}>
        <SelectableButtonList />
      </Box>

      <Box sx={{ mt: 2 }}>
        <Typography variant="h6">Link Activity Overview</Typography>
        <SimpleLineChart />
      </Box>

      <Box sx={{ mt: 2 }}>
        <BasicTable<PostData>
          data={postDetails}
          columns={detailsColumns}
          topToolbarActions={() => (
            <Typography variant="h5" sx={{ p: 2 }}>
              Link Details Table
            </Typography>
          )}
          enableExport
          exportFileName="users-report.xlsx"
        />
      </Box>

      <Box sx={{ mt: 2 }}>
        <BasicTable<BacklinkData>
          data={backlinkData}
          columns={backlinkColumns}
          topToolbarActions={() => (
            <Typography variant="h5" sx={{ p: 2 }}>
              Backlink Tracker
            </Typography>
          )}
        />
      </Box>

      <Box sx={{display:'flex', mt:2}}>
        <TinyBarChart/>
        <CustomPieChart/>
      </Box>
    </Box>
  );
};

export default BacklinkIntrnalLink;

interface CardData {
  icon: React.ReactNode;
  title: string;
  value: string;
  change: string; // or number
}

interface CardsProps {
  data?: CardData[];
}

const Cards: React.FC<CardsProps> = ({ data }: CardsProps) => {
  if (!data || !Array.isArray(data)) return null;
  // console.log("Cards data:", data);
  return (
    <>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "repeat(2, 1fr)",
            sm: "repeat(4, 1fr)",
            md: "repeat(4, 1fr)",
          },
          gap: 2,
        }}
      >
        {data.map((item, index) => {
          const isPositive = !item.change.startsWith("-");

          return (
            <Card key={index} elevation={3} sx={{ borderRadius: 2 }}>
              <CardContent>
                <Box>{item.icon}</Box>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                    {item.value}
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      color: isPositive ? "success.main" : "error.main",
                    }}
                  >
                    {/* {isPositive ? (
                    <ArrowUpwardIcon fontSize="small" />
                  ) : (
                    <ArrowDownwardIcon fontSize="small" />
                  )} */}
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: 500, ml: 0.5 }}
                    >
                      {isPositive ? "+" : ""}
                      {item.change}%
                    </Typography>
                  </Box>
                </Box>

                <Typography variant="body1" color="text.secondary" gutterBottom>
                  {item.title}
                </Typography>
              </CardContent>
            </Card>
          );
        })}
      </Box>
    </>
  );
};

const items = ["Internal Links", "Backlinks", "Suggestions"];

const SelectableButtonList = () => {
  const [selected, setSelected] = useState<string>(items[0]);

  return (
    <Box sx={{ display: "flex", gap: 2 }}>
      {items.map((item) => (
        <Button
          key={item}
          variant={selected === item ? "contained" : "text"}
          onClick={() => setSelected(item)}
        >
          {item}
        </Button>
      ))}
    </Box>
  );
};
