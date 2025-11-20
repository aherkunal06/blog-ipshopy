"use client";

import {
  Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Checkbox,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  Drawer,
  FormControl,
  FormControlLabel,
  FormGroup,
  Grid,
  IconButton,
  InputAdornment,
  Radio,
  RadioGroup,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import Image from "next/image";
import DownloadIcon from "@mui/icons-material/Download";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import FilterListIcon from "@mui/icons-material/FilterList";
import CloseIcon from "@mui/icons-material/Close";

const MediaManager = () => {
  const theme = useTheme();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width:768px)");
  const [openDrawer, setOpenDrawer] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  // const [selectedMedia, setSelectedMedia] = useState(null);

  const [selectedMedia, setSelectedMedia] = useState(null);

  const drawerWidth = 240;
  const navbarHeight = 64;

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  useEffect(() => {
    if (isMobile && selectedMedia) {
      setDialogOpen(true);
    }
  }, [selectedMedia, isMobile]);

  return (
    <Box>
      <MediaManagerHeader />

      {/* Mobile Filter Button */}
      {isMobile && (
        <Box sx={{ p: 1 }}>
          <Button
            variant="outlined"
            startIcon={<FilterListIcon />}
            onClick={() => setOpenDrawer(true)}
          >
            Filter
          </Button>
        </Box>
      )}

      <hr />

      <Box sx={{ display: "flex", width: "100%" }}>
        {/* Left section */}
        {!isMobile && (
          <Box sx={{ width: "20%" }}>
            <MediaManagerFilter />
            <Button variant="text" startIcon={<AddIcon />}>
              Create New Category
            </Button>
          </Box>
        )}

        {/* Center */}
        <Box sx={{ width: isMobile ? "100%" : "60%" }}>
          <MediaManagerImage
            setSelectedMedia={setSelectedMedia}
            selectedMedia={selectedMedia}
          />
        </Box>

        {/* Right section */}
        {!isMobile && (
          <Box sx={{ width: "20%" }}>
            {selectedMedia ? (
              <>
                <MediaManagerDetails media={selectedMedia} />
                <MediaManagerFileInfo media={selectedMedia} />
                <MediaAction />
              </>
            ) : (
              <Typography sx={{ p: 2, color: "text.secondary" }}>
                Select a media to view details
              </Typography>
            )}
          </Box>
        )}
      </Box>

      {/* Drawer for mobile filter */}
      <Drawer
        anchor="left"
        open={openDrawer}
        onClose={() => setOpenDrawer(false)}
        sx={{
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            marginTop: `${navbarHeight}px`, // Push below navbar
            height: `calc(100% - ${navbarHeight}px)`,
            overflowY: "auto", // scrollable content
          },
        }}
      >
        <Box sx={{ p: 2 }}>
          <MediaManagerFilter />
          <Button variant="text" startIcon={<AddIcon />}>
            Create New Category
          </Button>
        </Box>
      </Drawer>

      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle sx={{ display: "flex", justifyContent: "space-between" }}>
          Media Details
          <IconButton onClick={() => setDialogOpen(false)} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {selectedMedia && (
            <>
              <MediaManagerDetails media={selectedMedia} />
              <MediaManagerFileInfo media={selectedMedia} />
              <MediaAction />
            </>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default MediaManager;

const MediaManagerHeader = () => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      {/* Left Side */}
      <Typography variant="h3">Media Manager</Typography>

      {/* Right Side */}
      <Box sx={{ display: "flex", gap: 2 }}>
        <Button variant="contained" startIcon={<FileUploadIcon />}>
          Upload New
        </Button>
        {/* <Button variant="outlined">Bulk Actions</Button> */}
      </Box>
    </Box>
  );
};

const top100Films = [
  { label: "Newest First" },
  { label: "The Godfather" },
  { label: "The Godfather: Part II" },
];

const MediaManagerFilter = () => {
  return (
    <Box
      sx={{
        p: 1,
        display: "flex",
        flexDirection: "column",
        gap: 3,
        borderRight: "1px solid",
        borderColor: "divider",
        maxWidth: 280,
      }}
    >
      {/* Search */}
      <TextField
        size="small"
        label="Search"
        fullWidth
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
        variant="outlined"
      />

      {/* File Type */}
      <Box>
        <Typography variant="subtitle1" fontWeight={600} gutterBottom>
          File Type
        </Typography>
        <FormControl>
          <RadioGroup defaultValue="all" name="file-type">
            <FormControlLabel value="all" control={<Radio />} label="All" />
            <FormControlLabel
              value="images"
              control={<Radio />}
              label="Images"
            />
            <FormControlLabel value="pdf" control={<Radio />} label="PDF" />
            <FormControlLabel
              value="documents"
              control={<Radio />}
              label="Documents"
            />
            <FormControlLabel
              value="others"
              control={<Radio />}
              label="Others"
            />
          </RadioGroup>
        </FormControl>
      </Box>

      {/* Sort By */}
      <Box>
        <Typography variant="subtitle1" fontWeight={600} gutterBottom>
          Sort By
        </Typography>
        <Autocomplete
          disablePortal
          options={top100Films}
          size="small"
          renderInput={(params) => (
            <TextField {...params} label="Sort By" fullWidth />
          )}
        />
      </Box>

      {/* Categories */}
      <Box>
        <Typography variant="subtitle1" fontWeight={600} gutterBottom>
          Categories
        </Typography>
        <FormGroup>
          <FormControlLabel control={<Checkbox />} label="Banners" />
          <FormControlLabel control={<Checkbox />} label="Blog Covers" />
          <FormControlLabel control={<Checkbox />} label="Avatars" />
          <FormControlLabel control={<Checkbox />} label="Icons" />
        </FormGroup>
      </Box>
    </Box>
  );
};

const MediaManagerData = [
  {
    image:
      "https://i.pinimg.com/1200x/23/32/26/23322609c8346acdca899619d55e7d94.jpg",
    title: "title",
    size: "2.4MB",
    time: "2 days ago",
    tags: ["aadfdfd", "badfdf", "c"],
  },
  {
    image:
      "https://i.pinimg.com/1200x/23/32/26/23322609c8346acdca899619d55e7d94.jpg",
    title: "title",
    size: "2.4MB",
    time: "2 days ago",
    tags: ["a", "b", "c"],
  },
  {
    image:
      "https://i.pinimg.com/1200x/23/32/26/23322609c8346acdca899619d55e7d94.jpg",
    title: "title",
    size: "2.4MB",
    time: "2 days ago",
    tags: ["a", "b", "c"],
  },
  {
    image:
      "https://i.pinimg.com/1200x/23/32/26/23322609c8346acdca899619d55e7d94.jpg",
    title: "title",
    size: "2.4MB",
    time: "2 days ago",
    tags: ["a", "b", "c"],
  },
  {
    image:
      "https://i.pinimg.com/1200x/23/32/26/23322609c8346acdca899619d55e7d94.jpg",
    title: "title",
    size: "2.4MB",
    time: "2 days ago",
    tags: ["a", "b", "c"],
  },
  {
    image:
      "https://i.pinimg.com/1200x/23/32/26/23322609c8346acdca899619d55e7d94.jpg",
    title: "title",
    size: "2.4MB",
    time: "2 days ago",
    tags: ["a", "b", "c"],
  },
  {
    image:
      "https://i.pinimg.com/1200x/23/32/26/23322609c8346acdca899619d55e7d94.jpg",
    title: "title",
    size: "2.4MB",
    time: "2 days ago",
    tags: ["a", "b", "c"],
  },
  {
    image:
      "https://i.pinimg.com/1200x/23/32/26/23322609c8346acdca899619d55e7d94.jpg",
    title: "title",
    size: "2.4MB",
    time: "2 days ago",
    tags: ["a", "b", "c"],
  },
  {
    image:
      "https://i.pinimg.com/1200x/23/32/26/23322609c8346acdca899619d55e7d94.jpg",
    title: "title",
    size: "2.4MB",
    time: "2 days ago",
    tags: ["a", "b", "c"],
  },
  {
    image:
      "https://i.pinimg.com/1200x/23/32/26/23322609c8346acdca899619d55e7d94.jpg",
    title: "title",
    size: "2.4MB",
    time: "2 days ago",
    tags: ["a", "b", "c"],
  },
  {
    image:
      "https://i.pinimg.com/1200x/23/32/26/23322609c8346acdca899619d55e7d94.jpg",
    title: "title",
    size: "2.4MB",
    time: "2 days ago",
    tags: ["a", "b", "c"],
  },
];

const MediaManagerImage = ({ setSelectedMedia, selectedMedia }) => {
  return (
    <Box
      sx={{
        p: 1,
        display: "flex",
        flexDirection: "column",
        gap: 3,
        borderRight: "1px solid",
        borderColor: "divider",
      }}
    >
      <Grid
        container
        spacing={{ xs: 2, md: 3 }}
        columns={{ xs: 4, sm: 8, md: 12 }}
      >
        {MediaManagerData.map((item, index) => (
          <Grid item key={index} xs={2} sm={4} md={3}>
            <MediaManagerCard
              data={item}
              selectedMedia={selectedMedia}
              setSelectedMedia={setSelectedMedia}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

const MediaManagerCard = ({ data, selectedMedia, setSelectedMedia }) => {
  const { image, title, size, time, tags } = data;
  const [checked, setChecked] = useState(false);
  const isChecked = selectedMedia === data;

  const handleCheck = (e) => {
    const isChecked = e.target.checked;
    setChecked(isChecked);
    if (isChecked) {
      setSelectedMedia(data); // ✅ send data to right panel
    } else {
      setSelectedMedia(null); // deselect
    }
  };

  return (
    <Card sx={{ width: 150, position: "relative" }}>
      <Box sx={{ position: "absolute", top: 8, right: 8, zIndex: 1 }}>
        <Checkbox size="small" checked={isChecked} onChange={handleCheck} />
      </Box>

      <CardMedia sx={{ height: 140 }} image={image} title={title} />

      <CardContent>
        <Typography gutterBottom variant="h6" noWrap>
          {title}
        </Typography>

        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="body2" color="text.secondary">
            {size}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {time}
          </Typography>
        </Box>

        {/* <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mt: 1 }}>
          {tags?.map((tag, idx) => (
            <Typography
              key={idx}
              variant="caption"
              sx={{
                px: 0.5,
                py: 0.2,
                bgcolor: "action.selected",
                borderRadius: 1,
              }}
            >
              {tag}
            </Typography>
          ))}
        </Box> */}
      </CardContent>
    </Card>
  );
};

const MediaManagerDetails = ({ media }) => {
  const [chips, setChips] = useState(media?.tags || []);
  const [inputValue, setInputValue] = useState("");

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && inputValue.trim()) {
      e.preventDefault();
      if (!chips.includes(inputValue.trim())) {
        setChips([...chips, inputValue.trim()]);
      }
      setInputValue("");
    }
  };

  const handleDelete = (chipToDelete) => {
    setChips(chips.filter((chip) => chip !== chipToDelete));
  };

  return (
    <>
      {/* <Box sx={{ p: 1, display: "flex", flexDirection: "column", gap: 2 }}>
      <Box
        component="img"
        src="https://i.pinimg.com/736x/20/cc/f7/20ccf73437ab5d2e13742ed9bb564bb7.jpg"
        alt="headphone"
        sx={{
          width: "100%",
          maxWidth: 250,
          height: 300,
          borderRadius: 2,
          objectFit: "cover",
          alignSelf: "center",
        }}
      
      <TextField label="File Name" variant="outlined" size="small" fullWidth 
      <TextField label="Alt Text" variant="outlined" size="small" fullWidth 
      <Box>
        <Typography variant="h6" sx={{ mb: 1 }}>
          Tags
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 1,
            mb: 1,
            minHeight: "40px",
            p: 0.5,
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 1,
          }}
        >
          {chips.map((chip, index) => (
            <Chip
              key={index}
              label={chip}
              onDelete={() => handleDelete(chip)}
              color="primary"
              size="small"
            />
          ))}
        </Box>
        <TextField
          label="Add tags..."
          variant="outlined"
          size="small"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          fullWidth
        />
      </Box>
    </Box> */}
      <Box sx={{ p: 1, display: "flex", flexDirection: "column", gap: 2 }}>
        {/* <Box
        component="img"
        src={media.image}
        alt={media.title}
        sx={{
          width: "100%",
          maxWidth: 250,
          height: 300,
          borderRadius: 2,
          objectFit: "cover",
          alignSelf: "center",
        }}
      /> */}
        <Image
          src={media.image}
          alt={media.title}
          width={250} // matches maxWidth
          height={300} // required
          style={{
            width: "100%",
            maxWidth: 250,
            height: 300,
            borderRadius: 8, // sx borderRadius={2} → 8px
            objectFit: "cover",
            display: "block",
            margin: "0 auto", // replaces alignSelf: "center"
          }}
        />

        {/* File Name */}
        <TextField
          label="File Name"
          defaultValue={media.title}
          variant="outlined"
          size="small"
          fullWidth
        />

        {/* Alt Text */}
        <TextField label="Alt Text" variant="outlined" size="small" fullWidth />

        {/* Tags Section */}
        <Typography variant="h6" sx={{ mb: 1 }}>
          Tags
        </Typography>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 1 }}>
          {chips.map((chip, index) => (
            <Chip key={index} label={chip} color="primary" size="small" />
          ))}
        </Box>
      </Box>
    </>
  );
};

const fileInfo = [
  {
    field: "Size",
    val: "2.4 MB",
  },
  {
    field: "Dimensions",
    val: "1920 x 1080",
  },
  {
    field: "Uploaded",
    val: "2 days ago",
  },
];

const MediaManagerFileInfo = () => {
  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6">File Information</Typography>
      {fileInfo.map((info, index) => (
        <Box
          key={index}
          sx={{
            display: "flex",
            justifyContent: "space-between",
            py: 0.5,
            borderBottom:
              index !== fileInfo.length - 1 ? "1px solid #e0e0e0" : "none",
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            {info.field}
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            {info.val}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

const MediaAction = () => {
  return (
    <Box sx={{ p: 2, display: "flex", justifyContent: "space-between" }}>
      <Button variant="contained" startIcon={<DownloadIcon />}>
        Contained
      </Button>
      <Box sx={{ display: "flex", gap: 1 }}>
        <IconButton color="primary">
          <EditIcon />
        </IconButton>
        <IconButton color="error">
          <DeleteIcon />
        </IconButton>
      </Box>
    </Box>
  );
};
