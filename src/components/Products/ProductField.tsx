import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Button,
  MenuItem,
  Select,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  CircularProgress,
  Alert,
  Skeleton,
} from "@mui/material";
import UploadIcon from "@mui/icons-material/Upload";
import DeleteIcon from "@mui/icons-material/Delete";
import Aside from "../Aside";
import Footer from "../../pages/Footer";
import ProductService from "../../Services/ProductService";
import CategoriesService from "../../Services/CategoriesService";

interface Category {
  id: number;
  name: string;
}

interface Product {
  name: string;
  description: string;
  price: number;
  stock: number;
  is_available: boolean;
  category_id: number | null;
  image?: File | null;
  image_url?: string;
}

interface ProductData {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  is_available: boolean;
  category_id: number | null;
  image_url?: string;
}

const ProductField: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;

  const [product, setProduct] = useState<Product>({
    name: "",
    description: "",
    price: 0,
    stock: 0,
    is_available: true,
    category_id: null,
    image: null,
    image_url: "",
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const categoryRes = await CategoriesService.getCategories();
        console.log("Category response:", categoryRes); // Debug log
        const categoryData = Array.isArray(categoryRes.data)
          ? categoryRes.data
          : Array.isArray(categoryRes)
          ? categoryRes
          : [];
        console.log("Processed categories:", categoryData); // Debug log
        setCategories(categoryData);

        if (isEditMode) {
          const productRes = await ProductService.getProductById(Number(id));
          console.log("Product response:", productRes); // Debug log
          const productData = productRes.data;
          if (!productData) throw new Error("Product not found");

          setProduct({
            name: productData.name || "",
            description: productData.description || "",
            price: Number(productData.price) || 0,
            stock: Number(productData.stock) || 0,
            is_available: Boolean(productData.is_available),
            category_id: productData.category_id
              ? Number(productData.category_id)
              : null,
            image: null,
            image_url: productData.image_url || "",
          });
          setImagePreview(productData.image_url || null);
        }
      } catch (err: any) {
        console.error("Fetch error:", err);
        setError(
          err.message ||
            (isEditMode
              ? "Failed to load product or categories."
              : "Failed to load categories.")
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, isEditMode]);

  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const target = e.target as
      | HTMLInputElement
      | HTMLTextAreaElement
      | HTMLSelectElement;
    const { name, value } = target;
    const files = (target as HTMLInputElement).files;

    if (name === "image" && files && files[0]) {
      const file = files[0];
      if (file.type.startsWith("image/")) {
        if (file.size > 5 * 1024 * 1024) {
          setError("Image size must be less than 5MB.");
          return;
        }
        setProduct((prev) => ({ ...prev, image: file }));
        setImagePreview(URL.createObjectURL(file));
      } else {
        setError("Selected file is not an image.");
      }
    } else {
      setProduct((prev) => ({
        ...prev,
        [name]:
          name === "price" || name === "stock"
            ? Number(value)
            : name === "category_id"
            ? value === ""
              ? null
              : Number(value)
            : value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setSubmitting(true);

    const errors = [];
    if (!product.name.trim()) errors.push("Product name is required");
    if (product.name.length > 100)
      errors.push("Product name must be under 100 characters");
    if (!/^\d+(\.\d{1,2})?$/.test(product.price.toString())) {
      errors.push("Price must be a valid number with up to 2 decimal places");
    }
    if (product.price <= 0) errors.push("Price must be positive");
    if (product.stock < 0) errors.push("Stock must be non-negative");
    if (!product.category_id) errors.push("Category is required");

    if (errors.length > 0) {
      setError(errors.join(", "));
      setSubmitting(false);
      return;
    }

    const payload = new FormData();
    payload.append("name", product.name.trim());
    payload.append("description", product.description.trim());
    payload.append("price", String(product.price));
    payload.append("stock", String(product.stock));
    payload.append("category_id", String(product.category_id));
    payload.append("is_available", product.is_available ? "1" : "0");

    if (product.image instanceof File) {
      payload.append("image", product.image);
    } else if (isEditMode && !imagePreview && product.image_url) {
      payload.append("image_deleted", "1");
    }

    try {
      if (isEditMode) {
        await ProductService.updateProduct(Number(id), payload);
        setSuccess("Product updated successfully");
      } else {
        await ProductService.addProduct(payload);
        setSuccess("Product added successfully");
        setProduct({
          name: "",
          description: "",
          price: 0,
          stock: 0,
          is_available: true,
          category_id: null,
          image: null,
          image_url: "",
        });
        setImagePreview(null);
      }
      setTimeout(() => navigate("/product"), 2000);
    } catch (error: any) {
      setError(
        error.message ||
          (isEditMode ? "Failed to update product." : "Failed to add product.")
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="md:flex" id="main-wrapper">
      <Aside />
      <div className="flex flex-col flex-grow w-full">
        <Box display="flex" px={2} justifyContent="space-between" py={2}>
          <Button
            variant="outlined"
            color="inherit"
            onClick={() => navigate("/product")}
            sx={{ borderColor: "#032f5b", color: "#032f5b" }}
          >
            Back
          </Button>
          <Button
            variant="contained"
            color="primary"
            type="submit"
            form="product-form"
            disabled={submitting}
            sx={{
              backgroundColor: "#032f5b",
              "&:hover": { backgroundColor: "#021f3c" },
            }}
          >
            {submitting ? (
              <CircularProgress size={24} />
            ) : isEditMode ? (
              "Update Product"
            ) : (
              "Save Product"
            )}
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        {loading ? (
          <Box>
            <Skeleton variant="rectangular" height={50} sx={{ mb: 2 }} />
            <Skeleton variant="rectangular" height={50} sx={{ mb: 2 }} />
            <Skeleton variant="rectangular" height={200} />
          </Box>
        ) : (
          <div className="p-4">
            <Typography
              variant="h4"
              gutterBottom
              sx={{ fontWeight: "bold", color: "#032f5b" }}
            >
              {isEditMode ? "Edit Product" : "Add New Product"}
            </Typography>
            <form onSubmit={handleSubmit} id="product-form">
              <Box mb={4}>
                <div className="flex flex-wrap gap-4">
                  <div className="w-full md:w-1/2 lg:w-1/3">
                    <TextField
                      fullWidth
                      label="Product Name"
                      name="name"
                      value={product.name}
                      onChange={handleChange}
                      required
                      inputProps={{ maxLength: 100 }}
                    />
                  </div>
                  <div className="w-full md:w-1/2 lg:w-1/3">
                    <TextField
                      fullWidth
                      label="Price"
                      name="price"
                      type="number"
                      inputProps={{ step: "0.01", min: "0" }}
                      value={product.price}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              </Box>

              <div className="flex sm:flex-row flex-col gap-4">
                <div className="w-full sm:w-1/2">
                  <TextField
                    fullWidth
                    multiline
                    rows={10}
                    name="description"
                    label="Description"
                    value={product.description}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="w-full sm:w-1/2 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 p-6 flex flex-col items-center justify-center text-center min-h-[240px]">
                  {imagePreview ? (
                    <div className="relative w-full h-52">
                      <img
                        src={imagePreview}
                        alt="Product preview"
                        className="w-full h-full object-contain rounded"
                      />
                      <div className="image-overlay flex gap-4 justify-center mt-2">
                        <label
                          htmlFor="image-upload"
                          className="cursor-pointer text-black hover:text-green-600"
                          aria-label="Upload new image"
                        >
                          <UploadIcon style={{ fontSize: 28 }} />
                        </label>
                        <input
                          id="image-upload"
                          type="file"
                          name="image"
                          accept="image/*"
                          hidden
                          onChange={handleChange}
                          aria-label="Select image file"
                        />
                        <button
                          type="button"
                          title="Delete image"
                          onClick={() => {
                            setImagePreview(null);
                            setProduct((prev) => ({
                              ...prev,
                              image: null,
                              image_url: "",
                            }));
                          }}
                          className="text-black hover:text-red-500"
                          aria-label="Delete image"
                        >
                          <DeleteIcon style={{ fontSize: 28 }} />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-12 w-12 text-gray-400 mb-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M12 16V8m0 0l-3 3m3-3l3 3M20 16.58A5.5 5.5 0 0018 7h-1.26A8 8 0 104 15.25"
                        />
                      </svg>
                      <p className="text-gray-500 text-sm mb-4">
                        Drag & Drop an image to upload
                      </p>
                      <Button
                        variant="outlined"
                        component="label"
                        sx={{
                          borderColor: "#27ae60",
                          color: "#27ae60",
                          textTransform: "none",
                          fontWeight: 500,
                          "&:hover": {
                            backgroundColor: "#eafaf1",
                            borderColor: "#219653",
                          },
                        }}
                      >
                        Upload Image
                        <input
                          type="file"
                          name="image"
                          accept="image/*"
                          hidden
                          onChange={handleChange}
                          aria-label="Select image file"
                        />
                      </Button>
                    </>
                  )}
                </div>
              </div>

              <Box mt={4}>
                <div className="flex flex-wrap gap-4">
                  <div className="w-full md:w-1/2 lg:w-1/3">
                    <TextField
                      fullWidth
                      label="Stock"
                      name="stock"
                      type="number"
                      inputProps={{ min: "0" }}
                      value={product.stock}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="w-full md:w-1/2 lg:w-1/3">
                    <FormControl fullWidth>
                      <InputLabel>Category</InputLabel>
                      <Select
                        name="category_id"
                        value={
                          product.category_id !== null
                            ? String(product.category_id)
                            : ""
                        }
                        label="Category"
                        onChange={(e) => {
                          const value =
                            e.target.value === ""
                              ? null
                              : Number(e.target.value);
                          console.log("Selected category_id:", value); // Debug log
                          setProduct((prev) => ({
                            ...prev,
                            category_id: value,
                          }));
                        }}
                        required
                        disabled={
                          !(
                            categories &&
                            Array.isArray(categories) &&
                            categories.length > 0
                          )
                        }
                      >
                        {!(
                          categories &&
                          Array.isArray(categories) &&
                          categories.length > 0
                        ) ? (
                          <MenuItem value="" disabled>
                            No categories available
                          </MenuItem>
                        ) : (
                          [
                            <MenuItem key="select" value="">
                              Select a category
                            </MenuItem>,
                            ...categories.map((cat) => (
                              <MenuItem key={cat.id} value={String(cat.id)}>
                                {cat.name}
                              </MenuItem>
                            )),
                          ]
                        )}
                      </Select>
                    </FormControl>
                  </div>
                </div>
              </Box>
            </form>
          </div>
        )}

        <Footer />
      </div>
    </div>
  );
};

export default ProductField;
