"use client";

import {
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Grid,
  IconButton,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import LinkIcon from "@mui/icons-material/Link";
import BasicTable from "@/admin-components/BasicTable";
import { MRT_ColumnDef } from "material-react-table";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";

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

type Subscriber = {
  email: string;
  dateSubscribed: string;
  source: string;
};

const subscriberData: Subscriber[] = [
  {
    email: "john.doe@example.com",
    dateSubscribed: "2025-08-01",
    source: "Inline Form",
  },
  {
    email: "jane.smith@example.com",
    dateSubscribed: "2025-08-10",
    source: "Popup",
  },
  {
    email: "mike.ross@example.com",
    dateSubscribed: "2025-08-15",
    source: "Referral",
  },
  {
    email: "mike.ross@example.com",
    dateSubscribed: "2025-08-15",
    source: "Referral",
  },
  {
    email: "mike.ross@example.com",
    dateSubscribed: "2025-08-15",
    source: "Referral",
  },
  {
    email: "mike.ross@example.com",
    dateSubscribed: "2025-08-15",
    source: "Referral",
  },
];

const integrations = [
  {
    id: "mailchimp",
    icon: <LinkIcon color="primary" />,
    status: "Connected",
    dotColor: "green",
    buttonLabel: "Reconnect",
  },
  {
    id: "sendinblue",
    icon: <LinkIcon color="primary" />,
    status: "Not Connected",
    dotColor: "gray",
    buttonLabel: "Connect",
  },
  {
    id: "sendgrid",
    icon: <LinkIcon color="primary" />,
    status: "Not Connected",
    dotColor: "gray",
    buttonLabel: "Connect",
  },
];

const NewsletterIntegration = () => {
  const detailsColumns: MRT_ColumnDef<Subscriber>[] = [
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "dateSubscribed",
      header: "Date Subscribed",
    },
    {
      accessorKey: "source",
      header: "Source",
    },
    {
      header: "Action",
      Cell: ({ row }) => (
        <Box sx={{ display: "flex", gap: 1 }}>
          {/* 👁️ View Icon */}
          <Tooltip title="View">
            <IconButton
              color="primary"
              onClick={() => alert(`Viewing ${row.original.email}`)}
            >
              <VisibilityIcon />
            </IconButton>
          </Tooltip>

          {/* 🗑️ Delete Icon */}
          <Tooltip title="Delete">
            <IconButton
              color="error"
              onClick={() => alert(`Deleting ${row.original.email}`)}
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  return (
    <Box>
      <Typography variant="h4">Newsletter & Lead Capture</Typography>

      <Box sx={{ mt: 2 }}>
        <Cards data={cardsData} />
      </Box>

      <Box sx={{ mt: 2 }}>
        <BasicTable<Subscriber>
          data={subscriberData}
          columns={detailsColumns}
          topToolbarActions={() => (
            <Typography variant="h5" sx={{ p: 2 }}>
              Subscribers List
            </Typography>
          )}
          enableExport
          exportFileName="subscribers.xlsx"
          enableRowSelection // 👈 enable checkboxes
          onRowSelectionChange={(rowSelection) => {
            console.log("Selected rows:", rowSelection);
          }}
        />
      </Box>

      <Box sx={{ mt: 2 }}>
        <Grid
          container
          spacing={{ xs: 2, md: 3 }}
          columns={{ xs: 4, sm: 8, md: 12 }}
          justifyContent="center"
        >
          {integrations.map((integration) => (
            <Grid key={integration.id} xs={12} sm={4} md={4} item>
              <Mailchimp
                icon={integration.icon}
                status={integration.status}
                dotColor={integration.dotColor}
                buttonLabel={integration.buttonLabel}
              />
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* <Box sx={{ mt: 4, mb: 4, display: "flex", gap: 4, width: "100%" }}>
        <Box sx={{ width: "50%", mt: 2 }}>
          <FormEmbedGen />
        </Box>
        <Box sx={{ width: "50%", mt: 2 }}>
          <Help_Tips />
        </Box>
      </Box> */}
      <Box
        sx={{
          mt: 4,
          mb: 4,
          display: "flex",
          gap: 4,
          width: "100%",
          flexDirection: { xs: "column", md: "row" }, // 👈 responsive
        }}
      >
        <Box sx={{ flex: 1, mt: 2 }}>
          <FormEmbedGen />
        </Box>
        <Box sx={{ flex: 1, mt: 2 }}>
          <Help_Tips />
        </Box>
      </Box>
    </Box>
  );
};

export default NewsletterIntegration;

// 🎴 Cards Component
interface CardData {
  icon: React.ReactNode;
  title: string;
  value: string;
  change: string;
}

interface CardsProps {
  data?: CardData[];
}

const Cards: React.FC<CardsProps> = ({ data }: CardsProps) => {
  if (!data || !Array.isArray(data)) return null;

  return (
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
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                  {item.icon}
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    // color: isPositive ? "success.main" : "error.main",
                  }}
                >
                  <Typography variant="h5" sx={{ fontWeight: 500, ml: 0.5 }}>
                    {/* {isPositive ? "+" : ""}
                    {item.change}% */}
                    {item.value}
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
  );
};

interface IntegrationCardProps {
  icon: React.ReactNode;
  status: string;
  dotColor: string;
  buttonLabel: string;
}

const Mailchimp: React.FC<IntegrationCardProps> = ({
  icon,
  status,
  dotColor,
  buttonLabel,
}) => {
  return (
    <Card sx={{ width: "100%", p: 2, borderRadius: 2, boxShadow: 3 }}>
      <CardContent>
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          {icon}
          <Typography
            variant="h6"
            sx={{ display: "flex", alignItems: "center", gap: 1 }}
          >
            {status}
            <Box
              component="span"
              sx={{
                display: "inline-block",
                width: 12,
                height: 12,
                borderRadius: "50%",
                bgcolor: dotColor,
              }}
            />
          </Typography>
        </Box>

        {/* API Key Input */}
        <TextField
          fullWidth
          label="API Key"
          variant="outlined"
          size="small"
          sx={{ mb: 2 }}
        />

        {/* Action Button */}
        <Box sx={{ width: "100%", mt: 2 }}>
          <Button
            fullWidth
            variant={buttonLabel === "Connect" ? "contained" : "outlined"}
            color="primary"
          >
            {buttonLabel}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

const FormEmbedGen = () => {
  const [selected, setSelected] = useState("Inline Form");

  const buttons = ["Inline Form", "Popup Modal", "Footer Bar"];

  const renderContent = () => {
    switch (selected) {
      case "Inline Form":
        return (
          <Box sx={{ mt: 2, display: "flex", justifyContent: "space-between" }}>
            <FormGroup>
              <FormControlLabel
                control={<Checkbox />}
                label="Name (Optional)"
              />
              <FormControlLabel
                control={<Checkbox />}
                label="Email (Optional)"
              />
            </FormGroup>
            <Box>
              <TextField
                fullWidth
                label="Button Text"
                variant="outlined"
                size="small"
              />
            </Box>
          </Box>
        );
      case "Popup Modal":
        return (
          <Typography sx={{ mt: 2 }}>
            This is the Popup Modal content
          </Typography>
        );
      case "Footer Bar":
        return (
          <Typography sx={{ mt: 2 }}>This is the Footer Bar content</Typography>
        );
      default:
        return null;
    }
  };

  return (
    <Box>
      <Typography variant="h6">Form Embed Generator</Typography>
      <Typography variant="body1">Form Type</Typography>

      <Box sx={{ mt: 2 }}>
        <Box>
          <Box sx={{ display: "flex", gap: 2 }}>
            {buttons.map((label) => (
              <Button
                key={label}
                variant={selected === label ? "contained" : "outlined"}
                onClick={() => setSelected(label)}
              >
                {label}
              </Button>
            ))}
          </Box>

          <Box>{renderContent()}</Box>
        </Box>
        <Box></Box>
      </Box>
    </Box>
  );
};

const Help_Data = [
  {
    id: 1,
    icon: <LinkIcon />,
    title: "Best Practices",
    description: "Check out our documentation for more help.",
  },
  {
    id: 2,
    icon: <LinkIcon />,
    title: "Need Support?",
    description: "Contact our support team for assistance.",
  },
  {
    id: 3,
    icon: <LinkIcon />,
    title: "Get Started",
    description: "Follow our quick start guide to integrate easily.",
  },
];

const Help_Tips = () => {
  return (
    <Box>
      <Typography variant="h6">Help & Tips</Typography>

      <Grid
        container
        spacing={{ xs: 2, md: 3 }}
        columns={{ xs: 4, sm: 8, md: 12 }}
        sx={{ mt: 2 }}
      >
        {Help_Data.map((item) => (
          <Grid item xs={12} sm={12} md={12} key={item.id}>
            <Help_Card
              icon={item.icon}
              title={item.title}
              description={item.description}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

const Help_Card = ({ icon, title, description }) => {
  return (
    <Card>
      <CardContent sx={{ display: "flex", gap: 2 }}>
        {icon}
        <Box>
          <Typography variant="h6">{title}</Typography>
          <Typography variant="body2">{description}</Typography>
        </Box>
      </CardContent>
    </Card>
  );
};
