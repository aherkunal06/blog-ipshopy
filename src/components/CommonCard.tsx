import {
  Avatar,
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
} from "@mui/material";
import React from "react";

export interface CommonCardData {
  img: string;
  title: string;
  subTitle?: string;
  category?: string;
  avatarImg?: string;
  name?: string;
  dec?: string;
  read?: string;
  view?: string;
  like?: number;
  layout?: "horizontal" | "verticalSmall" | "verticalLarge";
}

const CommonCard: React.FC<{ data: CommonCardData }> = ({ data }) => {
  const {
    img,
    title,
    subTitle,
    category,
    avatarImg,
    name,
    dec,
    read,
    view,
    like,
    layout,
  } = data;

  // Horizontal Layout
  if (layout === "horizontal") {
    return (
      <Card
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          height: { sm: 240 },
          overflow: "hidden",
          transition: "transform 0.3s ease, box-shadow 0.3s ease",
          "&:hover": {
            transform: "scale(1.03)",
            boxShadow: 6,
            cursor: "pointer",
          },
        }}
      >
        <CardMedia
          component="img"
          image={img}
          alt={title}
          sx={{
            width: { xs: "100%", sm: 300 },
            height: { xs: 180, sm: "100%" },
            objectFit: "cover",
          }}
        />
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <CardContent>
            {category && (
              <Typography variant="overline" color="text.secondary">
                {category}
              </Typography>
            )}
            <Typography variant="h6" gutterBottom fontWeight={600}>
              {title}
            </Typography>
            {subTitle && (
              <Typography variant="body2" color="text.secondary">
                {subTitle}
              </Typography>
            )}
          </CardContent>
          <Footer
            avatarImg={avatarImg}
            name={name}
            read={read || dec}
            view={view}
            like={like}
          />
        </Box>
      </Card>
    );
  }

  // Vertical Layout
  return (
    <Card
      sx={{
        borderRadius: "1rem",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
        "&:hover": {
          transform: "scale(1.03)",
          boxShadow: 6,
          cursor: "pointer",
        },
      }}
    >
      <CardMedia
        component="img"
        height={layout === "verticalSmall" ? "110" : "180"}
        image={img}
        alt={title}
      />
      <CardContent>
        {category && (
          <Typography variant="overline" color="text.secondary">
            {category}
          </Typography>
        )}
        <Typography variant="h6" gutterBottom fontWeight={600}>
          {title}
        </Typography>
        {subTitle && (
          <Typography variant="body2" color="text.secondary">
            {subTitle}
          </Typography>
        )}
      </CardContent>
      <Footer
        avatarImg={avatarImg}
        name={name}
        read={read || dec}
        view={view}
        like={like}
      />
    </Card>
  );
};

const Footer = ({
  avatarImg,
  name,
  read,
  view,
  like,
}: {
  avatarImg?: string;
  name?: string;
  read?: string;
  view?: string;
  like?: number;
}) => {
  if (!name && !read && !view && !like) return null;
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        px: 2,
        pb: 2,
      }}
    >
      <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
        {avatarImg && <Avatar alt={name} src={avatarImg} />}
        <Box>
          {name && (
            <Typography variant="subtitle2" fontWeight={600}>
              {name}
            </Typography>
          )}
          {read && (
            <Typography variant="caption" color="text.secondary">
              {read}
            </Typography>
          )}
        </Box>
      </Box>
      {(view || like) && (
        <Box sx={{ textAlign: "right" }}>
          {view && (
            <Typography variant="caption" color="text.secondary">
              {view} views
            </Typography>
          )}
          <br />
          {like !== undefined && (
            <Typography variant="caption" color="text.secondary">
              {like} likes
            </Typography>
          )}
        </Box>
      )}
    </Box>
  );
};

export default CommonCard;
