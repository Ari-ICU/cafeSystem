import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  CircularProgress,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import Aside from "../Aside";
import { Footer } from "../../pages/Footer";
import { getProducts, deleteProduct } from "../../Services/ProductService";
import { getCategories } from "../../Services/CategoriesService";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  category_id: number | null;
  image?: string;
  image_url?: string;
}

interface Category {
  id: number;
  name: string;
}

const ProductList: React.FC = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProductsAndCategories = async () => {
      try {
        setLoading(true);
        const [productRes, categoryRes] = (await Promise.all([
          getProducts(),
          getCategories(),
        ])) as [{ data: Product[] }, { data: Category[] }];

        if (
          typeof productRes === "object" &&
          productRes !== null &&
          "data" in productRes &&
          Array.isArray(productRes.data)
        ) {
          const formattedProducts = productRes.data.map((product) => ({
            ...product,
            category_id: product.category_id
              ? Number(product.category_id)
              : null,
          }));
          setProducts(formattedProducts);
          setCategories(categoryRes.data);
        } else {
          throw new Error("Invalid product response format");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load products or categories. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProductsAndCategories();
  }, []);

  const handleDelete = async (productId: number) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteProduct(productId);
        setProducts(products.filter((product) => product.id !== productId));
        setError(null);
      } catch (error) {
        console.error("Error deleting product:", error);
        setError("Failed to delete product. Please try again.");
      }
    }
  };

  const handleEdit = (productId: number) => {
    navigate(`/edit-product/${productId}`);
  };

  const filteredProducts = products
    .filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase());

      const categoryName =
        product.category_id !== null
          ? categories.find((cat) => cat.id === product.category_id)?.name || ""
          : "";

      const matchesCategory =
        selectedCategory === "All" || categoryName === selectedCategory;

      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <Box className="flex min-h-screen flex-col md:flex-row" id="main-wrapper">
      <Aside />
      <Box className="flex-grow overflow-x-auto min-w-0">
        <Box className="text-black py-4 px-4 sm:px-6">
          <Typography variant="h4" className="font-bold">
            Product Management
          </Typography>
        </Box>
        <Box className="w-full py-4 px-4 sm:px-6">
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <Box className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <Typography
                variant="h5"
                className="font-semibold text-black mb-2 sm:mb-0"
              >
                Product List
              </Typography>
              <Button
                variant="contained"
                onClick={() => navigate("/add-product")}
                sx={{
                  backgroundColor: "#032f5b",
                  color: "#fff",
                  "&:hover": { backgroundColor: "#021f3c" },
                  whiteSpace: "nowrap",
                }}
              >
                Add Product
              </Button>
            </Box>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            {loading ? (
              <Box display="flex" justifyContent="center" my={4}>
                <CircularProgress />
              </Box>
            ) : (
              <>
                <Box className="mb-6 flex flex-col sm:flex-row gap-4">
                  <TextField
                    label="Search by Name or Description"
                    variant="outlined"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    sx={{ flex: 1, minWidth: 200 }}
                    aria-label="Search products"
                  />
                  <FormControl sx={{ minWidth: 150 }}>
                    <InputLabel id="category-select-label">Category</InputLabel>
                    <Select
                      labelId="category-select-label"
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      label="Category"
                      aria-label="Filter by category"
                    >
                      <MenuItem value="All">All</MenuItem>
                      {categories.map((category) => (
                        <MenuItem key={category.id} value={category.name}>
                          {category.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
                <Box sx={{ width: "100%" }}>
                  <TableContainer
                    component={Paper}
                    sx={{
                      overflowX: "auto", // Enable horizontal scrolling
                      overflowY: "auto", // Enable vertical scrolling
                      maxHeight: "70vh", // Limit height for vertical scrolling
                      // Custom scrollbar styles (optional, browser-dependent)
                      "&::-webkit-scrollbar": {
                        width: "8px",
                        height: "8px",
                      },
                      "&::-webkit-scrollbar-track": {
                        background: "#f1f1f1",
                      },
                      "&::-webkit-scrollbar-thumb": {
                        background: "#888",
                        borderRadius: "4px",
                      },
                      "&::-webkit-scrollbar-thumb:hover": {
                        background: "#555",
                      },
                    }}
                  >
                    <Table
                      sx={{
                        minWidth: 1000, // Ensure table is wide enough to trigger horizontal scrolling
                      }}
                      aria-label="product table"
                    >
                      <TableHead
                        sx={{
                          position: "sticky", // Make header sticky
                          top: 0,
                          zIndex: 1,
                          backgroundColor: "#032f5b", // Keep header visible
                        }}
                      >
                        <TableRow>
                          {[
                            "ID",
                            "Image",
                            "Name",
                            "Description",
                            "Price",
                            "Stock",
                            "Category",
                            "Actions",
                          ].map((head) => (
                            <TableCell
                              key={head}
                              sx={{
                                fontWeight: "bold",
                                color: "#cdd7e1",
                                backgroundColor: "#032f5b",
                                fontSize: { xs: "14px", sm: "16px" },
                                minWidth:
                                  head === "Description"
                                    ? 200
                                    : head === "Actions"
                                    ? 180
                                    : head === "Image"
                                    ? 80
                                    : 100,
                                whiteSpace: "nowrap",
                                padding: { xs: "8px", sm: "16px" },
                              }}
                            >
                              {head}
                            </TableCell>
                          ))}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {filteredProducts.length === 0 ? (
                          <TableRow>
                            <TableCell
                              colSpan={8}
                              sx={{
                                textAlign: "center",
                                color: "#000",
                                fontSize: { xs: "14px", sm: "16px" },
                                padding: "16px",
                              }}
                            >
                              No products available
                            </TableCell>
                          </TableRow>
                        ) : (
                          filteredProducts.map((product, index) => (
                            <TableRow
                              key={product.id}
                              hover
                              sx={{ fontSize: { xs: "14px", sm: "16px" } }}
                            >
                              <TableCell
                                sx={{
                                  color: "#000",
                                  whiteSpace: "nowrap",
                                  padding: { xs: "8px", sm: "16px" },
                                }}
                              >
                                {index + 1}
                              </TableCell>
                              <TableCell
                                sx={{
                                  color: "#000",
                                  whiteSpace: "nowrap",
                                  padding: { xs: "8px", sm: "16px" },
                                }}
                              >
                                {product.image ? (
                                  <img
                                    src={`${product.image_url}`}
                                    alt={product.name}
                                    style={{
                                      width: "50px",
                                      height: "50px",
                                      borderRadius: "4px",
                                      objectFit: "cover",
                                    }}
                                    onError={(e) => {
                                      e.currentTarget.src =
                                        "/fallback-image.jpg";
                                    }}
                                  />
                                ) : (
                                  "No Image"
                                )}
                              </TableCell>
                              <TableCell
                                sx={{
                                  color: "#000",
                                  whiteSpace: "nowrap",
                                  padding: { xs: "8px", sm: "16px" },
                                }}
                              >
                                {product.name}
                              </TableCell>
                              <TableCell
                                sx={{
                                  color: "#000",
                                  maxWidth: 200,
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  padding: { xs: "8px", sm: "16px" },
                                }}
                              >
                                {product.description}
                              </TableCell>
                              <TableCell
                                sx={{
                                  color: "#000",
                                  whiteSpace: "nowrap",
                                  padding: { xs: "8px", sm: "16px" },
                                }}
                              >
                                ${product.price}
                              </TableCell>
                              <TableCell
                                sx={{
                                  color: "#000",
                                  whiteSpace: "nowrap",
                                  padding: { xs: "8px", sm: "16px" },
                                }}
                              >
                                {product.stock}
                              </TableCell>
                              <TableCell
                                sx={{
                                  color: "#000",
                                  whiteSpace: "nowrap",
                                  padding: { xs: "8px", sm: "16px" },
                                }}
                              >
                                {categories.length === 0
                                  ? `No categories loaded (category_id: ${product.category_id})`
                                  : product.category_id === null
                                  ? `No category assigned`
                                  : categories.find(
                                      (cat) => cat.id === product.category_id
                                    )?.name || `Uncategorized`}
                              </TableCell>
                              <TableCell
                                sx={{
                                  color: "#000",
                                  whiteSpace: "nowrap",
                                  padding: { xs: "8px", sm: "16px" },
                                }}
                              >
                                <Button
                                  variant="outlined"
                                  color="primary"
                                  onClick={() => handleEdit(product.id)}
                                  sx={{
                                    mr: 1,
                                    minWidth: { xs: 60, sm: 80 },
                                    fontSize: { xs: "12px", sm: "14px" },
                                  }}
                                >
                                  Edit
                                </Button>
                                <Button
                                  variant="outlined"
                                  color="error"
                                  onClick={() => handleDelete(product.id)}
                                  sx={{
                                    minWidth: { xs: 60, sm: 80 },
                                    fontSize: { xs: "12px", sm: "14px" },
                                  }}
                                >
                                  Delete
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              </>
            )}
          </Box>
        </Box>
        <Box className="mt-auto">
          <Footer />
        </Box>
      </Box>
    </Box>
  );
};

export default ProductList;