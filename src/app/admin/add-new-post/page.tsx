
import {
  Autocomplete,
  Box,
  Button,
  TextField,
  Typography,
} from "@mui/material";
import {
  useFormik,
  FieldArray,
  FormikProvider,
} from "formik";
import * as yup from "yup";
import Inputs from "@/admin-components/Inputs";
import TextEditor from "@/admin-components/TextEditor";
import ImageUploader from "@/admin-components/ImageUploader";
import ButtonComp from "@/admin-components/ButtonComp";

// Types
type CardMoreDetail = {
  headlineForCard: string;
  description: string;
};

type FaqItem = {
  headlineForFAQ: string;
  headlineFaqDescription: string;
};

type RelatedArticle = {
  articleTitle: string;
  relatedArticleImage: File | null;
};

type FormValues = {
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string[];
  // tags: string;
  mainHeading: string;
  // shortDescription: string;
  // title: string;
  // subTitle: string;
  // subDescription: string;
  image: File | null;
  cardMoreDetails: CardMoreDetail[];
  faq: FaqItem[];
  relatedArticles: RelatedArticle[];
  categories: string[];
};

const metaData = [
  { name: "metaTitle", label: "Meta Title" },
  {
    name: "metaDescription",
    label: "Meta Description",
    multiline: true,
    rows: 2,
  },
  { name: "metaKeywords", label: "Meta Keywords", type: "chips" },
  // { name: "tags", label: "Tags" },
  { name: "mainHeading", label: "Main Heading" },
  // {
  //   name: "shortDescription",
  //   label: "Short Description",
  //   multiline: true,
  //   rows: 4,
  // },
];

// const cardDetails = [
//   { name: "title", label: "Title" },
//   { name: "subTitle", label: "Sub Title", multiline: true, rows: 3 },
//   {
//     name: "subDescription",
//     label: "Sub Description",
//     multiline: true,
//     rows: 4,
//   },
// ];

const validationSchema = yup.object({
  metaTitle: yup.string().required("Meta Title is required"),
  metaDescription: yup.string().required("Meta Description is required"),
  metaKeywords: yup.array().of(yup.string().required()).min(1, "Add keywords"),
  // tags: yup.string().required("Tags are required"),
  mainHeading: yup.string().required("Main Heading is required"),
  // shortDescription: yup.string().required("Short Description is required"),
  // title: yup.string().required("Title is required"),
  // subTitle: yup.string().required("Sub Title is required"),
  // subDescription: yup.string().required("Sub Description is required"),
  image: yup.mixed().required("Image is required"),
  cardMoreDetails: yup.array().of(
    yup.object({
      headlineForCard: yup.string().required("Headline is required"),
      description: yup.string().required("Description is required"),
    })
  ),
  faq: yup.array().of(
    yup.object({
      headlineForFAQ: yup.string().required("Headline For FAQ is required"),
      headlineFaqDescription: yup
        .string()
        .required("FAQ description is required"),
    })
  ),
  relatedArticles: yup.array().of(
    yup.object({
      articleTitle: yup.string().nullable(),
      relatedArticleImage: yup.mixed().nullable(),
    })
  ),
  categories: yup
    .array()
    .of(yup.string().required())
    .min(1, "Select at least one category")
    .required("Category is required"),
});

const categoryOptions: string[] = [
  "Technology",
  "Fashion",
  "Makeup",
  "Health",
  "Finance",
  "Education",
  "Travel",
  "Food",
  "Entertainment",
];

const AddNewPost = () => {
  const formik = useFormik<FormValues>({
    initialValues: {
      metaTitle: "",
      metaDescription: "",
      metaKeywords: [],
      // tags: "",
      mainHeading: "",
      // shortDescription: "",
      // title: "",
      // subTitle: "",
      // subDescription: "",
      image: null,
      cardMoreDetails: [{ headlineForCard: "", description: "" }],
      faq: [{ headlineForFAQ: "", headlineFaqDescription: "" }],
      relatedArticles: [{ articleTitle: "", relatedArticleImage: null }],
      categories: [],
    },
    validationSchema,
    onSubmit: async (values: FormValues) => {
      console.log("onSubmit triggered", values);
      try {
        const formData = {
          ...values,
        };

        const res = await fetch("/api/blogs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        if (res.ok) {
          const data = await res.json();
          alert("Blog created successfully!");
          console.log("Blog created:", data);
        } else {
          const err = await res.json();
          alert(`Error: ${err.message}`);
        }
      } catch (err) {
        console.error("Submission error:", err);
        alert("Something went wrong.");
      }
    },

  });

  return (
    <FormikProvider value={formik}>
      <Box component="form" onSubmit={formik.handleSubmit}>
        <Box mt={4}>
          <Typography variant="h5" gutterBottom>
            Meta Details
          </Typography>
          <Inputs data={metaData} formik={formik} />
        </Box>

        <Box mt={4}>
          <Typography variant="h5" gutterBottom>
            Card Details
          </Typography>
          {/* <Inputs data={cardDetails} formik={formik} /> */}

          <ImageUploader
            label="Card Image"
            name="image"
            value={
              formik.values.image
                ? URL.createObjectURL(formik.values.image)
                : ""
            }
            touched={formik.touched.image as boolean}
            error={formik.errors.image as string}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              const file = e.currentTarget.files?.[0];
              if (file) formik.setFieldValue("image", file);
            }}
          />
        </Box>

        {/* Card More Details */}
        <Box mt={4}>
          <Typography variant="h5" gutterBottom>
            Card More Details
          </Typography>
          <FieldArray name="cardMoreDetails">
            {({ push, remove }) => (
              <>
                {formik.values.cardMoreDetails.map((_, index) => (
                  <Box key={index} mb={2} p={2} border={1} borderRadius={2}>
                    <Inputs
                      data={[
                        {
                          name: `cardMoreDetails[${index}].headlineForCard`,
                          label: "Headline for Card",
                        },
                      ]}
                      formik={formik}
                    />
                    <TextEditor
                      name={`cardMoreDetails[${index}].description`}
                      value={formik.values.cardMoreDetails[index].description}
                      onChange={(value: string) =>
                        formik.setFieldValue(
                          `cardMoreDetails[${index}].description`,
                          value
                        )
                      }
                      onBlur={() =>
                        formik.setFieldTouched(
                          `cardMoreDetails[${index}].description`,
                          true
                        )
                      }
                      error={
                        !!formik.touched.cardMoreDetails?.[index]
                          ?.description &&
                        !!formik.errors.cardMoreDetails?.[index]?.description
                      }
                      helperText={
                        formik.touched.cardMoreDetails?.[index]?.description &&
                        formik.errors.cardMoreDetails?.[index]?.description
                      }
                    />
                    <Box mt={2} display="flex" gap={2}>
                      {index > 0 && (
                        <ButtonComp
                          name="Delete Section"
                          variant="outlined"
                          color="error"
                          onClick={() => remove(index)}
                        />
                      )}
                      <ButtonComp
                        name="Add Section"
                        variant="outlined"
                        onClick={() =>
                          push({ headlineForCard: "", description: "" })
                        }
                      />
                    </Box>
                  </Box>
                ))}
              </>
            )}
          </FieldArray>
        </Box>

        {/* FAQ */}
        <Box mt={4}>
          <Typography variant="h5" gutterBottom>
            FAQ
          </Typography>
          <FieldArray name="faq">
            {({ push, remove }) => (
              <>
                {formik.values.faq.map((_, index) => (
                  <Box key={index} mb={2} p={2} border={1} borderRadius={2}>
                    <Inputs
                      data={[
                        {
                          name: `faq[${index}].headlineForFAQ`,
                          label: "Headline for FAQ",
                        },
                        {
                          name: `faq[${index}].headlineFaqDescription`,
                          label: "FAQ Description",
                          multiline: true,
                          rows: 3,
                        },
                      ]}
                      formik={formik}
                    />
                    <Box mt={2} display="flex" gap={2}>
                      {index > 0 && (
                        <ButtonComp
                          name="Delete FAQ"
                          variant="outlined"
                          color="error"
                          onClick={() => remove(index)}
                        />
                      )}
                      <ButtonComp
                        name="Add FAQ"
                        variant="outlined"
                        onClick={() =>
                          push({
                            headlineForFAQ: "",
                            headlineFaqDescription: "",
                          })
                        }
                      />
                    </Box>
                  </Box>
                ))}
              </>
            )}
          </FieldArray>
        </Box>

        {/* Related Articles */}
        <Box mt={4}>
          <Typography variant="h5" gutterBottom>
            Related Articles (Optional)
          </Typography>
          <FieldArray name="relatedArticles">
            {({ push, remove }) => (
              <>
                {formik.values.relatedArticles.map((_, index) => (
                  <Box key={index} mb={2} p={2} border={1} borderRadius={2}>
                    <Inputs
                      data={[
                        {
                          name: `relatedArticles[${index}].articleTitle`,
                          label: "Article Title",
                        },
                      ]}
                      formik={formik}
                    />
                    <ImageUploader
                      label="Related Article Image"
                      name={`relatedArticles[${index}].relatedArticleImage`}
                      value={
                        formik.values.relatedArticles[index].relatedArticleImage
                          ? URL.createObjectURL(
                            formik.values.relatedArticles[index]
                              .relatedArticleImage as File
                          )
                          : ""
                      }
                      touched={
                        formik.touched.relatedArticles?.[index]
                          ?.relatedArticleImage as boolean
                      }
                      error={
                        formik.errors.relatedArticles?.[index]
                          ?.relatedArticleImage as string
                      }
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        const file = e.currentTarget.files?.[0];
                        if (file) {
                          formik.setFieldValue(
                            `relatedArticles[${index}].relatedArticleImage`,
                            file
                          );
                        }
                      }}
                    />
                    <Box mt={2} display="flex" gap={2}>
                      {index > 0 && (
                        <ButtonComp
                          name="Delete Article"
                          variant="outlined"
                          color="error"
                          onClick={() => remove(index)}
                        />
                      )}
                      <ButtonComp
                        name="Add Article"
                        variant="outlined"
                        onClick={() =>
                          push({ articleTitle: "", relatedArticleImage: null })
                        }
                      />
                    </Box>
                  </Box>
                ))}
              </>
            )}
          </FieldArray>
        </Box>

        {/* Categories */}
        <Box mt={4}>
          <Typography variant="h5" gutterBottom>
            Categories
          </Typography>
          <Autocomplete
            multiple
            options={categoryOptions}
            value={formik.values.categories}
            onChange={(_, value) => formik.setFieldValue("categories", value)}
            onBlur={() => formik.setFieldTouched("categories", true)}
            filterSelectedOptions
            getOptionLabel={(option: string) => option}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Categories"
                fullWidth
                error={
                  formik.touched.categories && Boolean(formik.errors.categories)
                }
                helperText={
                  formik.touched.categories && formik.errors.categories
                    ? String(formik.errors.categories)
                    : ""
                }
              />
            )}
          />
        </Box>

        {/* Submit */}
        <Box mt={4}>
          <Button type="submit" variant="contained">
            Submit
          </Button>
        </Box>
      </Box>
    </FormikProvider>
  );
};

export default AddNewPost;
