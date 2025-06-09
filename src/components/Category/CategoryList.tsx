import React, { useEffect, useState, useMemo } from "react";
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
  Card,
  CardContent,
  Snackbar,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import Aside from "../Aside"; // Adjust path if needed
import { Footer } from "../../pages/Footer"; // Adjust path if needed
import CategoriesService from "../../Services/CategoriesService";

interface Category {
  id: number;
  name: string;
}

const CategoryList: React.FC = () => {
  const navigate = useNavigate();

  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState<{
    message: string;
    severity: "success" | "error";
  } | null>(null);

  // Fetch categories from API
  const fetchCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await CategoriesService.getCategories();

      if (Array.isArray(response)) {
        setCategories(response);
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

  useEffect(() => {
    fetchCategories();
  }, []);

  // Delete category with confirmation
  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this category?"))
      return;

    setLoading(true);
    try {
      await CategoriesService.deleteCategory(id);
      setCategories((prev) => prev.filter((c) => c.id !== id));
      setSnackbar({
        message: "Category deleted successfully.",
        severity: "success",
      });
    } catch (err) {
      console.error("Error deleting category:", err);
      setSnackbar({ message: "Failed to delete category.", severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  // Navigate to edit page
  const handleEdit = (id: number) => {
    navigate(`/edit-category/${id}`);
  };

  // Filter categories by search query
  const filteredCategories = useMemo(() => {
    return categories.filter((category) =>
      category.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [categories, searchQuery]);

  const handleCloseSnackbar = () => setSnackbar(null);

  return (
    <div className="md:flex" id="category-wrapper">
      <Aside />

      <Box
        sx={{
          flexGrow: 1,
          p: 3,
          bgcolor: "#fafafa",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          sx={{ mb: 3, fontWeight: "bold", color: "#032f5b" }}
        >
          Category Management
        </Typography>

        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: "600", color: "#032f5b" }}>
            Category List
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate("/add-category")}
            sx={{
              bgcolor: "#032f5b",
              "&:hover": { bgcolor: "#021f3c" },
              color: "#fff",
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

        <TextField
          label="Search by Name"
          variant="outlined"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ mb: 3, maxWidth: 320 }}
          aria-label="Search categories"
          disabled={loading}
        />

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", my: 5 }}>
            <CircularProgress />
          </Box>
        ) : filteredCategories.length === 0 ? (
          <Card sx={{ maxWidth: 400, mx: "auto", p: 2, mt: 5 }}>
            <CardContent>
              <Typography align="center">No categories found.</Typography>
            </CardContent>
          </Card>
        ) : (
          <TableContainer component={Paper} sx={{ maxHeight: 600 }}>
            <Table stickyHeader aria-label="category table">
              <TableHead>
                <TableRow sx={{ bgcolor: "#032f5b" }}>
                 <TableCell
                    sx={{
                      color: "#fff",
                      fontWeight: "bold",
                      minWidth: 160,
                      position: "sticky",
                      right: 0,
                      bgcolor: "#032f5b",
                      zIndex: 2,
                    }}
                  >
                    #
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "#fff",
                      fontWeight: "bold",
                      minWidth: 160,
                      position: "sticky",
                      right: 0,
                      bgcolor: "#032f5b",
                      zIndex: 2,
                    }}
                  >
                    Name
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "#fff",
                      fontWeight: "bold",
                      minWidth: 160,
                      position: "sticky",
                      right: 0,
                      bgcolor: "#032f5b",
                      zIndex: 2,
                    }}
                  >
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredCategories.map((category, index) => (
                  <TableRow key={category.id} hover>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{category.name}</TableCell>
                    <TableCell
                      sx={{
                        position: "sticky",
                        right: 0,
                        bgcolor: "#fff",
                        zIndex: 1,
                      }}
                    >
                      <Button
                        variant="outlined"
                        size="small"
                        color="primary"
                        sx={{ mr: 1 }}
                        onClick={() => handleEdit(category.id)}
                        aria-label={`Edit category ${category.name}`}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outlined"
                        size="small"
                        color="error"
                        onClick={() => handleDelete(category.id)}
                        aria-label={`Delete category ${category.name}`}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        <Footer />

        {/* Snackbar for feedback */}
        {snackbar && (
          <Snackbar
            open={!!snackbar}
            autoHideDuration={4000}
            onClose={handleCloseSnackbar}
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          >
            <Alert
              onClose={handleCloseSnackbar}
              severity={snackbar.severity}
              sx={{ width: "100%" }}
            >
              {snackbar.message}
            </Alert>
          </Snackbar>
        )}
      </Box>
    </div>
  );
};

export default CategoryList;
