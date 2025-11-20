import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Skeleton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import Image from "next/image";
import React, { Suspense } from "react";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

interface Article {
  img: string;
  title: string;
  amount: number;
}

const relatedArticles: Article[] = [
  { img: "/related1.png", title: "Hair Dryer", amount: 1999 },
  { img: "/related2.png", title: "Curling Iron", amount: 2499 },
];

type BudgetItem = {
  img: string;
  title: string;
  amount: number;
  subtitle: string;
};

const budgetFriendly: BudgetItem[] = [
  {
    img: "budget1.png",
    title: "Havells Biotin Infused Wide Plates Hair Straightener",
    amount: 2499,
    subtitle:
      "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sint aperiam eveniet nisi eos velit adipisci explicabo unde qui molestiae inventore architecto, ipsam minima accusantium necessitatibus dicta tempora rerum quidem iure.",
  },
  {
    img: "budget2.png",
    title: "Philips Kerashine Hair Straightener",
    amount: 3299,
    subtitle:
      "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sint aperiam eveniet nisi eos velit adipisci explicabo unde qui molestiae inventore architecto, ipsam minima accusantium necessitatibus dicta tempora rerum quidem iure.",
  },
];

type AccordionItem = {
  title: string;
  content: string;
};

const accordionData: AccordionItem[] = [
  {
    title: "Accordion 1",
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex, sit amet blandit leo lobortis eget.",
  },
  {
    title: "Accordion 2",
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex, sit amet blandit leo lobortis eget.",
  },
  {
    title: "Accordion Actions",
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex, sit amet blandit leo lobortis eget.",
  },
];

const blogData = [
  {
    image: "/static/images/cards/contemplative-reptile.jpg",
    title: "Building a Successful E-commerce Strategy",
    author: "Emma Wilson",
    avatar: "/static/images/avatar/1.jpg",
    readTime: "5 min read",
    likes: "1.2k",
    views: "1.2k",
  },
  {
    image: "/static/images/cards/tech.jpg",
    title: "Leveraging AI in Online Retail",
    author: "Liam Carter",
    avatar: "/static/images/avatar/2.jpg",
    readTime: "6 min read",
    likes: "980",
    views: "850",
  },
];

const ArticlesSkeleton = () => {
  return (
    <Box sx={{ backgroundColor: "#B9D4DF", p: 3 }}>
      <Box
        sx={{
          width: "100%",
          mt: 9,
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 3,
        }}
      >
        {/* Main Content - 70% */}
        <Box sx={{ width: { xs: "100%", md: "70%" } }}>
          <Box>
            <Box sx={{ position: "relative", width: "100%", height: 400 }}>
              <Skeleton variant="rectangular" width={"100%"} height={400} />
            </Box>
            <Skeleton />
            <Skeleton width="60%" />

            <Box display="flex" alignItems="center" gap={1}>
              <Skeleton variant="circular" width={40} height={40} />
              <Box>
                <Skeleton width="60%" />
                <Box display="flex" flexWrap="wrap" gap={3}>
                  <Skeleton />
                </Box>
              </Box>
            </Box>

            <Box sx={{ mt: 3 }}>
              <Skeleton />
            </Box>

            <Box sx={{ mt: 3 }}>
              <Skeleton width="60%" />
              <Skeleton />
            </Box>
          </Box>

          {/* <Box sx={{ mt: 4 }}>
              <Typography variant="h5">
                Top 10 Budget-Friendly Styling Tools
              </Typography>
              <Stack spacing={4} sx={{ mt: 4 }}>
                {budgetFriendly.map((item, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: "flex",
                      flexDirection: { xs: "column", sm: "row" },
                      gap: 3,
                      backgroundColor: "white",
                      borderRadius: "10px",
                      p: 3,
                      alignItems: { xs: "center", sm: "flex-start" },
                      boxShadow: 1,
                    }}
                  >
                    <Box
                      sx={{
                        width: { xs: "100%", sm: 230 },
                        height: { xs: "auto", sm: 230 },
                        position: "relative",
                        flexShrink: 0,
                      }}
                    >
                      <img
                        src={`/${item.img}`}
                        alt={item.title}
                        // fill
                        style={{
                          borderRadius: 8,
                          objectFit: "cover",
                        }}
                      />
                    </Box>

                    <Stack spacing={2} flex={1}>
                      <Typography variant="h6" fontWeight={600}>
                        {item.title}
                      </Typography>

                      <Typography
                        variant="h6"
                        sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                      >
                        <CurrencyRupeeIcon sx={{ fontSize: 20 }} />
                        {item.amount.toLocaleString("en-IN")}
                      </Typography>

                      <Typography variant="subtitle1" color="text.secondary">
                        {item.subtitle}
                      </Typography>

                      <Button
                        variant="contained"
                        size="small"
                        sx={{
                          backgroundColor: "#953A96",
                          textTransform: "none",
                          minWidth: "120px",
                          width: "fit-content",
                        }}
                      >
                        View on ipshopyBlogs
                      </Button>
                    </Stack>
                  </Box>
                ))}
              </Stack>
            </Box>

            <Box sx={{ mt: 4 }}>
              <Typography variant="h5">Frequently Asked Questions</Typography>
              <Box sx={{ mt: 3 }}>
                {accordionData.map((item, index) => (
                  <Accordion key={index}>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls={`panel${index + 1}-content`}
                      id={`panel${index + 1}-header`}
                    >
                      <Typography component="span">{item.title}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography variant="body2" color="text.secondary">
                        {item.content}
                      </Typography>
                    </AccordionDetails>
                  </Accordion>
                ))}
              </Box>
            </Box> */}
        </Box>

        {/* Sidebar - 30% */}
        <Stack sx={{ width: { xs: "100%", md: "30%" } }} spacing={4}>
          {/* Related Products */}
          <Box
            sx={{
              backgroundColor: "white",
              borderRadius: "10px",
              p: 3,
            }}
          >
            <Skeleton width="60%" />
            <Box display="flex" flexDirection="column" gap={2}>
              <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                <Skeleton variant="rectangular" width={210} height={118} />
                <Box>
                  <Skeleton width="60%" />
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Skeleton width="60%" />
                  </Box>
                </Box>
              </Box>
              <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                <Skeleton variant="rectangular" width={210} height={118} />
                <Box>
                  <Skeleton width="60%" />
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Skeleton width="60%" />
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>

          {/* Newsletter */}
          <Box
            sx={{
              backgroundColor: "#143A7A",
              borderRadius: "10px",
              p: 4,
              color: "white",
            }}
          >
            <Skeleton width="60%" />
            <Skeleton width="60%" />
            <Skeleton width="60%" />
            <Stack direction="column" spacing={2} mt={3}>
              <Skeleton />
              <Skeleton />
            </Stack>
          </Box>

          {/* Blog Cards */}
          {/* <Stack spacing={3}>
              {blogData.map((item, index) => (
                <Card
                  key={index}
                  sx={{
                    width: "100%",
                    height: 300,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    borderRadius: 3,
                    boxShadow: 3,
                  }}
                >
                  <CardMedia
                    sx={{ height: 180 }}
                    image={item.image}
                    title={item.title}
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h6" fontWeight={600}>
                      {item.title}
                    </Typography>
                  </CardContent>
                  <Box sx={{ px: 2, pb: 2 }}>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Avatar alt={item.author} src={item.avatar} />
                      <Box
                        flex={1}
                        display="flex"
                        justifyContent="space-between"
                      >
                        <Box>
                          <Typography variant="subtitle1" fontWeight={600}>
                            {item.author}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {item.readTime}
                          </Typography>
                        </Box>
                        <Box textAlign="right">
                          <Typography variant="body2" color="text.secondary">
                            ❤️ {item.likes}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            👁️ {item.views}
                          </Typography>
                        </Box>
                      </Box>
                    </Stack>
                  </Box>
                </Card>
              ))}
            </Stack> */}
        </Stack>
      </Box>
    </Box>
  );
};
const Articles: React.FC = () => {
  return (
    <Suspense fallback={<ArticlesSkeleton />}>
      <Box sx={{ backgroundColor: "#B9D4DF", p: 3 }}>
        <Box
          sx={{
            width: "100%",
            mt: 9,
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: 3,
          }}
        >
          {/* Main Content - 70% */}
          <Box sx={{ width: { xs: "100%", md: "70%" } }}>
            <Box>
              <Box sx={{ position: "relative", width: "100%", height: 400 }}>
                <Image
                  src="/articles.png"
                  alt=""
                  fill
                  style={{ objectFit: "cover", borderRadius: 8 }}
                />
              </Box>
              {/* <Image src={"/articles.png"} alt="" width='840' height="400" /> */}
              <Typography
                variant="h3"
                gutterBottom
                sx={{
                  pt: 2,
                  fontSize: {
                    xs: "1.4rem", // small mobile
                    sm: "2.2rem", // tablets
                    md: "2.5rem", // desktops
                  },
                  fontWeight: 700,
                }}
              >
                Top 10 Affordable Hair Styling <br /> Tools for Beginners
              </Typography>

              <Box display="flex" alignItems="center" gap={1}>
                <Avatar
                  alt="Sarah Mitchell"
                  src="/static/images/avatar/1.jpg"
                />
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Sarah Mitchell
                  </Typography>
                  <Box display="flex" flexWrap="wrap" gap={3}>
                    <Typography
                      variant="subtitle2"
                      color="text.secondary"
                      display="flex"
                      alignItems="center"
                      gap={0.5}
                    >
                      January 15, 2025
                    </Typography>
                    <Typography
                      variant="subtitle2"
                      color="text.secondary"
                      display="flex"
                      alignItems="center"
                      gap={0.5}
                    >
                      <AccessTimeIcon fontSize="small" />
                      12 min read
                    </Typography>
                    <Typography
                      variant="subtitle2"
                      color="text.secondary"
                      display="flex"
                      alignItems="center"
                      gap={0.5}
                    >
                      1.2k
                      <FavoriteBorderIcon fontSize="small" />
                    </Typography>
                    <Typography
                      variant="subtitle2"
                      color="text.secondary"
                      display="flex"
                      alignItems="center"
                      gap={0.5}
                    >
                      150
                      <RemoveRedEyeIcon fontSize="small" />
                    </Typography>
                  </Box>
                </Box>
              </Box>

              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle1">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Reiciendis, veniam eum necessitatibus rem laboriosam alias!
                  Necessitatibus culpa commodi ad nemo! Hic.
                </Typography>
              </Box>

              <Box sx={{ mt: 3 }}>
                <Typography variant="h5">
                  Why Beginners Need Affordable Tools
                </Typography>
                <Typography variant="subtitle1">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Reprehenderit in commodi temporibus, aliquam suscipit incidunt
                  rem adipisci doloremque autem quasi eligendi repellat, nostrum
                  exercitationem corporis optio.
                </Typography>
              </Box>
            </Box>

            <Box sx={{ mt: 4 }}>
              <Typography variant="h5">
                Top 10 Budget-Friendly Styling Tools
              </Typography>
              <Stack spacing={4} sx={{ mt: 4 }}>
                {budgetFriendly.map((item, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: "flex",
                      flexDirection: { xs: "column", sm: "row" },
                      gap: 3,
                      backgroundColor: "white",
                      borderRadius: "10px",
                      p: 3,
                      alignItems: { xs: "center", sm: "flex-start" },
                      boxShadow: 1,
                    }}
                  >
                    <Box
                      sx={{
                        width: { xs: "100%", sm: 230 },
                        height: { xs: "auto", sm: 230 },
                        position: "relative",
                        flexShrink: 0,
                      }}
                    >
                      {/* <img
                      src={`/${item.img}`}
                      alt={item.title}
                      // fill
                      style={{
                        borderRadius: 8,
                        objectFit: "cover",
                      }}
                    /> */}
                      <Image
                        src={`/${item.img}`}
                        alt={item.title}
                        width={400} // required
                        height={300} // required
                        style={{
                          borderRadius: 8,
                          objectFit: "cover",
                        }}
                      />
                    </Box>

                    <Stack spacing={2} flex={1}>
                      <Typography variant="h6" fontWeight={600}>
                        {item.title}
                      </Typography>

                      <Typography
                        variant="h6"
                        sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                      >
                        <CurrencyRupeeIcon sx={{ fontSize: 20 }} />
                        {item.amount.toLocaleString("en-IN")}
                      </Typography>

                      <Typography variant="subtitle1" color="text.secondary">
                        {item.subtitle}
                      </Typography>

                      <Button
                        variant="contained"
                        size="small"
                        sx={{
                          backgroundColor: "#953A96",
                          textTransform: "none",
                          minWidth: "120px",
                          width: "fit-content",
                        }}
                      >
                        View on ipshopyBlogs
                      </Button>
                    </Stack>
                  </Box>
                ))}
              </Stack>
            </Box>

            {/* faq */}
            <Box sx={{ mt: 4 }}>
              <Typography variant="h5">Frequently Asked Questions</Typography>
              <Box sx={{ mt: 3 }}>
                {accordionData.map((item, index) => (
                  <Accordion key={index}>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls={`panel${index + 1}-content`}
                      id={`panel${index + 1}-header`}
                    >
                      <Typography component="span">{item.title}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography variant="body2" color="text.secondary">
                        {item.content}
                      </Typography>
                    </AccordionDetails>
                  </Accordion>
                ))}
              </Box>
            </Box>
          </Box>

          {/* Sidebar - 30% */}
          <Stack sx={{ width: { xs: "100%", md: "30%" } }} spacing={4}>
            {/* Related Products */}
            <Box
              sx={{
                backgroundColor: "white",
                borderRadius: "10px",
                p: 3,
              }}
            >
              <Typography variant="h5" gutterBottom>
                Related Product
              </Typography>
              <Box display="flex" flexDirection="column" gap={2}>
                {relatedArticles.map((item, index) => (
                  <Box
                    key={index}
                    sx={{ display: "flex", gap: 2, alignItems: "center" }}
                  >
                    <Image
                      src={item.img}
                      alt={item.title}
                      width={80}
                      height={80}
                      style={{ borderRadius: 8, objectFit: "cover" }}
                    />
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {item.title}
                      </Typography>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <CurrencyRupeeIcon sx={{ fontSize: 18, mr: 0.5 }} />
                        <Typography
                          variant="subtitle1"
                          sx={{ fontWeight: 500 }}
                        >
                          {item.amount.toLocaleString("en-IN")}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>

            {/* Newsletter */}
            <Box
              sx={{
                backgroundColor: "#143A7A",
                borderRadius: "10px",
                p: 4,
                color: "white",
              }}
            >
              <Typography variant="h5" gutterBottom>
                Stay Updated!
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                Subscribe to our newsletter for the latest hair care tips and
                exclusive offers.
              </Typography>
              <Stack direction="column" spacing={2} mt={3}>
                <TextField
                  fullWidth
                  label="Enter your email"
                  variant="outlined"
                  sx={{
                    backgroundColor: "white",
                    borderRadius: "5px",
                  }}
                />
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: "white",
                    color: "#143A7A",
                    fontWeight: 600,
                    px: 3,
                    "&:hover": {
                      backgroundColor: "#f0f0f0",
                    },
                  }}
                >
                  Subscribe
                </Button>
              </Stack>
            </Box>

            {/* Blog Cards */}
            <Stack spacing={3}>
              {blogData.map((item, index) => (
                <Card
                  key={index}
                  sx={{
                    width: "100%",
                    height: 300,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    borderRadius: 3,
                    boxShadow: 3,
                  }}
                >
                  <CardMedia
                    sx={{ height: 180 }}
                    image={item.image}
                    title={item.title}
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h6" fontWeight={600}>
                      {item.title}
                    </Typography>
                  </CardContent>
                  <Box sx={{ px: 2, pb: 2 }}>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Avatar alt={item.author} src={item.avatar} />
                      <Box
                        flex={1}
                        display="flex"
                        justifyContent="space-between"
                      >
                        <Box>
                          <Typography variant="subtitle1" fontWeight={600}>
                            {item.author}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {item.readTime}
                          </Typography>
                        </Box>
                        <Box textAlign="right">
                          <Typography variant="body2" color="text.secondary">
                            ❤️ {item.likes}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            👁️ {item.views}
                          </Typography>
                        </Box>
                      </Box>
                    </Stack>
                  </Box>
                </Card>
              ))}
            </Stack>
          </Stack>
        </Box>
      </Box>
    </Suspense>
  );
};

export default Articles;
