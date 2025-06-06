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
  CircularProgress,
  Alert,
  Card,
  CardContent,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import Aside from "../Aside"; // Adjust path as needed
import { Footer } from "../../pages/Footer"; // Adjust path as needed
import {
  getCategories,
  deleteCategory,
} from "../../Services/CategoriesService"; // Adjust path as needed

interface Category {
  id: number;
  name: string;
}

const CategoryList: React.FC = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await getCategories();
        if (
          typeof response === "object" &&
          response !== null &&
          "data" in response &&
          Array.isArray((response as { data: unknown }).data)
        ) {
          setCategories((response as { data: Category[] }).data);
        } else {
          throw new Error("Invalid response format");
        }
      } catch (err) {
        console.error("Error fetching categories:", err);
        setError("Failed to load categories.");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        await deleteCategory(id);
        setCategories(categories.filter((c) => c.id !== id));
        setError(null);
      } catch (err) {
        console.error("Error deleting category:", err);
        setError("Failed to delete category.");
      }
    }
  };

  const handleEdit = (id: number) => {
    navigate(`/edit-category/${id}`);
  };

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="md:flex " id="category-wrapper">
      <Aside />
      <Box className="w-full page-wrapper overflow-hidden">
        <Box className="text-black py-4">
          <Typography variant="h4" className="font-bold">
            Category Management
          </Typography>
        </Box>

        <Box className="flex-grow w-full py-4">
          <div>
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <Box className="mb-6 flex flex-row justify-between items-start sm:items-center gap-4">
                <Typography variant="h5" className="font-semibold text-black">
                  Category List
                </Typography>
                <Button
                  variant="contained"
                  onClick={() => navigate("/add-category")}
                  sx={{
                    backgroundColor: "#032f5b",
                    color: "#fff",
                    "&:hover": { backgroundColor: "#021f3c" },
                  }}
                  aria-label="Add new category"
                >
                  Add Category
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
                  <Box className="mb-6">
                    <TextField
                      label="Search by Name"
                      variant="outlined"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      sx={{ width: { xs: "100%", sm: "300px" } }}
                      aria-label="Search categories"
                    />
                  </Box>

                  <Box sx={{ width: "100%" }}>
                    {/* Desktop Table */}
                    <Box sx={{ display: { xs: "none", sm: "block" } }}>
                      <TableContainer
                        component={Paper}
                        sx={{
                          maxHeight: 600,
                          "&::-webkit-scrollbar": { height: "8px" },
                          "&::-webkit-scrollbar-thumb": {
                            background: "#888",
                            borderRadius: "4px",
                          },
                        }}
                      >
                        <Table stickyHeader aria-label="category table">
                          <TableHead>
                            <TableRow>
                              <TableCell
                                sx={{
                                  backgroundColor: "#032f5b",
                                  color: "#fff",
                                  fontWeight: "bold",
                                  minWidth: 50,
                                }}
                              >
                                ID
                              </TableCell>
                              <TableCell
                                sx={{
                                  backgroundColor: "#032f5b",
                                  color: "#fff",
                                  fontWeight: "bold",
                                  minWidth: 200,
                                }}
                              >
                                Name
                              </TableCell>
                              <TableCell
                                sx={{
                                  backgroundColor: "#032f5b",
                                  color: "#fff",
                                  fontWeight: "bold",
                                  minWidth: 160,
                                  position: "sticky",
                                  right: 0,
                                  zIndex: 2,
                                }}
                              >
                                Actions
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {filteredCategories.length === 0 ? (
                              <TableRow>
                                <TableCell colSpan={3} align="center">
                                  <Card sx={{ maxWidth: 400, mx: "auto", my: 2 }}>
                                    <CardContent>
                                      <Typography>No categories found.</Typography>
                                    </CardContent>
                                  </Card>
                                </TableCell>
                              </TableRow>
                            ) : (
                              filteredCategories.map((category, index) => (
                                <TableRow key={category.id} hover>
                                  <TableCell>{index + 1}</TableCell>
                                  <TableCell>{category.name}</TableCell>
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
                                      onClick={() => handleEdit(category.id)}
                                      sx={{ mr: 1 }}
                                    >
                                      Edit
                                    </Button>
                                    <Button
                                      variant="outlined"
                                      color="error"
                                      size="small"
                                      onClick={() => handleDelete(category.id)}
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
                      {filteredCategories.length === 0 ? (
                        <Card sx={{ maxWidth: 400, mx: "auto", mt: 2 }}>
                          <CardContent>
                            <Typography>No categories found.</Typography>
                          </CardContent>
                        </Card>
                      ) : (
                        filteredCategories.map((category) => (
                          <Card
                            key={category.id}
                            sx={{ mb: 2, border: "1px solid #e0e0e0" }}
                          >
                            <CardContent>
                              <Typography variant="h6">{category.name}</Typography>
                              <Box sx={{ mt: 1, display: "flex", gap: 1 }}>
                                <Button
                                  variant="outlined"
                                  color="primary"
                                  size="small"
                                  onClick={() => handleEdit(category.id)}
                                >
                                  Edit
                                </Button>
                                <Button
                                  variant="outlined"
                                  color="error"
                                  size="small"
                                  onClick={() => handleDelete(category.id)}
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

          <Box className="mt-auto">
            <Footer />
          </Box>
        </Box>
      </Box>
    </div>
  );
};

export default CategoryList;