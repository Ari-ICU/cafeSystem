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
  Paper,
  CircularProgress,
  Alert,
} from "@mui/material";
import UploadIcon from "@mui/icons-material/Upload";
import DeleteIcon from "@mui/icons-material/Delete";
import Aside from "../Aside";
import Footer from "../../pages/Footer";
import {
  getProducts,
  addProduct,
  updateProduct,
} from "../../Services/ProductService";
import { getCategories } from "../../Services/CategoriesService";

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
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const categoryRes = await getCategories();
        setCategories((categoryRes as { data: Category[] }).data);

        if (isEditMode) {
          const productRes = await getProducts();
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
          const typedProductRes = productRes as { data: ProductData[] };
          const productData = typedProductRes.data.find(
            (p: ProductData) => p.id === Number(id)
          );
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
      } catch (err) {
        setError(
          isEditMode
            ? "Failed to load product or categories."
            : "Failed to load categories."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, isEditMode]);

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

    const errors = [];
    if (!product.name.trim()) errors.push("Product name is required");
    if (product.price <= 0) errors.push("Price must be positive");
    if (product.stock < 0) errors.push("Stock must be non-negative");
    if (!product.category_id) errors.push("Category is required");

    if (errors.length > 0) {
      setError(errors.join(", "));
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
    } else if (isEditMode && product.image_url && !imagePreview) {
      payload.append("image", ""); // clear image if deleted
    }else{
      payload.append("image_deleted", "1");
    }

    try {
      if (isEditMode) {
        await updateProduct(Number(id), payload);
        setSuccess("Product updated successfully");
      } else {
        await addProduct(payload);
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
    } catch (error: unknown) {
      if (
        error &&
        typeof error === "object" &&
        "response" in error &&
        error.response &&
        typeof error.response === "object" &&
        "data" in error.response
      ) {
        setError(
          (error as { response: { data: string } }).response.data ||
            (isEditMode
              ? "Failed to update product."
              : "Failed to add product.")
        );
      } else {
        setError(
          isEditMode ? "Failed to update product." : "Failed to add product."
        );
      }
    }
  };

  return (
    <div className="md:flex min-h-screen" id="main-wrapper">
      <Aside />
      <Box className="flex flex-col flex-grow w-full p-6">
        <Box display="flex" justifyContent="space-between" py={2}>
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
            sx={{
              backgroundColor: "#032f5b",
              "&:hover": { backgroundColor: "#021f3c" },
            }}
          >
            {isEditMode ? "Update Product" : "Save Product"}
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
          <Box display="flex" justifyContent="center" my={4}>
            <CircularProgress />
          </Box>
        ) : (
          <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
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
                        alt="Preview"
                        className="w-full h-full object-contain rounded"
                      />
                      <div className="image-overlay flex gap-4 justify-center mt-2">
                        <label
                          htmlFor="image-upload"
                          className="cursor-pointer text-black hover:text-green-600"
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
                        value={product.category_id || ""}
                        label="Category"
                        onChange={(event) => {
                          const value =
                            String(event.target.value) === ""
                              ? null
                              : Number(event.target.value);
                          setProduct((prev) => ({
                            ...prev,
                            category_id: value,
                          }));
                        }}
                        required
                      >
                        {categories.map((cat) => (
                          <MenuItem key={cat.id} value={cat.id}>
                            {cat.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </div>
                </div>
              </Box>
            </form>
          </Paper>
        )}

        <Footer />
      </Box>
    </div>
  );
};

export default ProductField;
