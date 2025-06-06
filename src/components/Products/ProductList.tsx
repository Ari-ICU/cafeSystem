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
  Card,
  CardContent,
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
    <div className="md:flex" id="product-wrapper">
      <Aside />
      <div className="w-full page-wrapper overflow-hidden">
        <Box className="text-black py-4">
          <Typography variant="h4" className="font-bold">
            Product Management
          </Typography>
        </Box>
        <div className="py-4 px-4 sm:px-6">
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <Box className="mb-6 flex flex-row justify-between items-start sm:items-center gap-4">
              <Typography
                variant="h5"
                className="font-semibold text-black"
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
                }}
                aria-label="Add new product"
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
                    sx={{ width: { xs: "100%", sm: "300px" } }}
                    aria-label="Search products"
                  />
                  <FormControl sx={{ width: { xs: "100%", sm: "150px" } }}>
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
                  {/* Desktop Table */}
                  <Box sx={{ display: { xs: "none", sm: "block" } }}>
                    <TableContainer
                      component={Paper}
                      sx={{
                        maxHeight: 600,
                        "&::-webkit-scrollbar": { height: "8px", width: "8px" },
                        "&::-webkit-scrollbar-thumb": {
                          background: "#888",
                          borderRadius: "4px",
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
                                  backgroundColor: "#032f5b",
                                  color: "#fff",
                                  fontWeight: "bold",
                                  minWidth:
                                    head === "Description"
                                      ? 200
                                      : head === "Actions"
                                      ? 160
                                      : head === "Image"
                                      ? 80
                                      : 100,
                                  position: head === "Actions" ? "sticky" : "static",
                                  right: head === "Actions" ? 0 : undefined,
                                  zIndex: head === "Actions" ? 2 : 1,
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
                              <TableCell colSpan={8} align="center">
                                <Card sx={{ maxWidth: 400, mx: "auto", my: 2 }}>
                                  <CardContent>
                                    <Typography>No products found.</Typography>
                                  </CardContent>
                                </Card>
                              </TableCell>
                            </TableRow>
                          ) : (
                            filteredProducts.map((product, index) => (
                              <TableRow key={product.id} hover>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell>
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
                                <TableCell>{product.name}</TableCell>
                                <TableCell
                                  sx={{
                                    maxWidth: 200,
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                  }}
                                >
                                  {product.description}
                                </TableCell>
                                <TableCell>${product.price}</TableCell>
                                <TableCell>{product.stock}</TableCell>
                                <TableCell>
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
                                    position: "sticky",
                                    right: 0,
                                    background: "#fff",
                                    zIndex: 1,
                                  }}
                                >
                                  <Button
                                    variant="outlined"
                                    color="primary"
                                    size="small"
                                    onClick={() => handleEdit(product.id)}
                                    sx={{ mr: 1 }}
                                  >
                                    Edit
                                  </Button>
                                  <Button
                                    variant="outlined"
                                    color="error"
                                    size="small"
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
                  </Box>

                  {/* Mobile Card View */}
                  <Box sx={{ display: { xs: "block", sm: "none" } }}>
                    {filteredProducts.length === 0 ? (
                      <Card sx={{ maxWidth: 400, mx: "auto", mt: 2 }}>
                        <CardContent>
                          <Typography>No products found.</Typography>
                        </CardContent>
                      </Card>
                    ) : (
                      filteredProducts.map((product) => (
                        <Card
                          key={product.id}
                          sx={{ mb: 2, border: "1px solid #e0e0e0" }}
                        >
                          <CardContent className=" ">
                            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                              {product.image ? (
                                <img
                                  src={`${product.image_url}`}
                                  alt={product.name}
                                  className="w-full"
                                  style={{
                                    height: "200px",
                                    borderRadius: "4px",
                                    objectFit: "cover",
                                    marginRight: "8px",
                                  }}
                                  onError={(e) => {
                                    e.currentTarget.src = "/fallback-image.jpg";
                                  }}
                                />
                              ) : (
                                <Typography sx={{ mr: 1 }}>No Image</Typography>
                              )}
                             
                            </Box>
                             <Typography variant="h5">{product.name}</Typography>
                            <Typography variant="body1" color="text.secondary">
                              {product.description}
                            </Typography>
                            <Typography variant="body1" sx={{ mt: 1 }}>
                              Price: ${product.price}
                            </Typography>
                            <Typography variant="body1">
                              Stock: {product.stock}
                            </Typography>
                            <Typography variant="body1">
                              Category:{" "}
                              {categories.length === 0
                                ? `No categories loaded (category_id: ${product.category_id})`
                                : product.category_id === null
                                ? `No category assigned`
                                : categories.find(
                                    (cat) => cat.id === product.category_id
                                  )?.name || `Uncategorized`}
                            </Typography>
                            <Box sx={{ mt: 1, display: "flex", gap: 1 }}>
                              <Button
                                variant="outlined"
                                color="primary"
                                size="small"
                                onClick={() => handleEdit(product.id)}
                              >
                                Edit
                              </Button>
                              <Button
                                variant="outlined"
                                color="error"
                                size="small"
                                onClick={() => handleDelete(product.id)}
                              >
                                Delete
                              </Button>
                            </Box>
                          </CardContent>
                        </Card>
                      ))
                    )}
                  </Box>
                </Box>
              </>
            )}
          </Box>
        </div>
        <Box className="">
          <Footer />
        </Box>
      </div>
    </div>
  );
};

export default ProductList;