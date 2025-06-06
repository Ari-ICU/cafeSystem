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
import Grid from "@mui/material/Grid";
import { useNavigate } from "react-router-dom";
import Aside from "../Aside";
import { Footer } from "../../pages/Footer";
import { getProducts, deleteProduct } from "../../Services/ProductService";
import { getCategories } from "../../Services/CategoriesService";

// Define the Product interface to match API response
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

// Define the Category interface
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

        // Type guard for productRes
        if (
          typeof productRes === "object" &&
          productRes !== null &&
          "data" in productRes &&
          Array.isArray(productRes.data)
        ) {
          const formattedProducts = productRes.data.map((product) => ({
            ...product,
            category_id: product.category_id ? Number(product.category_id) : null,
          }));
          console.log("Products:", formattedProducts);
          console.log("Categories:", categoryRes.data);
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

  // Handle delete product
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

  // Handle edit product
  const handleEdit = (productId: number) => {
    navigate(`/edit-product/${productId}`);
  };

  // Filter products based on search query and category
  const filteredProducts = products.filter((product) => {
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
  });

  return (
    <div className="md:flex min-h-screen" id="main-wrapper">
      <Aside />
      <Box className="w-full page-wrapper overflow-hidden">
        <Box className="flex-grow text-white">
          <Box className="text-black py-4 px-6">
            <Typography variant="h4" className="font-bold">
              Product Management
            </Typography>
          </Box>
          <Box className="flex-grow w-full py-4">
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', flexDirection: 'column', p: 6 }}>
                  <div className="mb-6 flex flex-row justify-between items-start sm:items-center gap-4">
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
                        "&:hover": {
                          backgroundColor: "#021f3c",
                        },
                      }}
                    >
                      Add Product
                    </Button>
                  </div>
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
                          sx={{ flex: 1 }}
                          aria-label="Search products"
                        />
                        <FormControl sx={{ minWidth: 150 }}>
                          <InputLabel id="category-select-label">
                            Category
                          </InputLabel>
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
                      <Box sx={{ width: "100%", maxWidth: "100%" }}>
                        <div className="w-full overflow-x-auto">
                          <TableContainer
                            component={Paper}
                            sx={{
                              "&::-webkit-scrollbar": { height: "8px" },
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
                            <Table stickyHeader aria-label="product table">
                              <TableHead>
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
                                        fontSize: "18px",
                                        minWidth:
                                          head === "Description" ? 150 : 80,
                                        whiteSpace: "nowrap",
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
                                      colSpan={7}
                                      sx={{
                                        textAlign: "center",
                                        color: "#000",
                                        fontSize: "18px",
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
                                      sx={{ fontSize: "18px" }}
                                    >
                                      <TableCell
                                        sx={{ color: "#000", whiteSpace: "nowrap" }}
                                      >
                                        {index + 1}
                                      </TableCell>
                                      <TableCell
                                        sx={{ color: "#000", whiteSpace: "nowrap" }}
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
                                        sx={{ color: "#000", whiteSpace: "nowrap" }}
                                      >
                                        {product.name}
                                      </TableCell>
                                      <TableCell sx={{ color: "#000" }}>
                                        {product.description}
                                      </TableCell>
                                      <TableCell
                                        sx={{ color: "#000", whiteSpace: "nowrap" }}
                                      >
                                        ${product.price}
                                      </TableCell>
                                      <TableCell
                                        sx={{ color: "#000", whiteSpace: "nowrap" }}
                                      >
                                        {product.stock}
                                      </TableCell>
                                      <TableCell
                                        sx={{ color: "#000", whiteSpace: "nowrap" }}
                                      >
                                        {categories.length === 0
                                          ? `No categories loaded (category_id: ${product.category_id})`
                                          : product.category_id === null
                                          ? `No category assigned (category_id: null)`
                                          : categories.find(
                                              (cat) => cat.id === product.category_id
                                            )?.name ||
                                            `Uncategorized (category_id: ${product.category_id})`}
                                      </TableCell>
                                      <TableCell
                                        sx={{ color: "#000", whiteSpace: "nowrap" }}
                                      >
                                        <Button
                                          variant="outlined"
                                          color="primary"
                                          onClick={() => handleEdit(product.id)}
                                          sx={{ mr: 1 }}
                                        >
                                          Edit
                                        </Button>
                                        <Button
                                          variant="outlined"
                                          color="error"
                                          onClick={() => handleDelete(product.id)}
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
                        </div>
                      </Box>
                    </>
                  )}
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Box className="mt-auto">
          <Footer />
        </Box>
      </Box>
    </div>
  );
};

export default ProductList;