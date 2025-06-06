import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  CircularProgress,
  Alert,
} from "@mui/material";
import Aside from "../Aside"; // Adjust path as needed
import Footer from "../../pages/Footer"; // Adjust path as needed
import {
  getCategories,
  addCategory,
  updateCategory,
} from "../../Services/CategoriesService"; // Adjust path as needed

interface Category {
  id: number;
  name: string;
}

const CategoryField: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;

  const [category, setCategory] = useState<{ name: string }>({ name: "" });
  const [loading, setLoading] = useState<boolean>(isEditMode);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (isEditMode) {
      const fetchCategory = async () => {
        try {
          setLoading(true);
          const response = await getCategories();
          if (
            typeof response === "object" &&
            response !== null &&
            "data" in response &&
            Array.isArray((response as { data: Category[] }).data)
          ) {
            const categoryData = (response as { data: Category[] }).data.find(
              (cat) => cat.id === Number(id)
            );
            if (!categoryData) throw new Error("Category not found");
            setCategory({ name: categoryData.name });
          } else {
            throw new Error("Invalid response format");
          }
        } catch (err) {
          console.error("Error fetching category:", err);
          setError("Failed to load category.");
        } finally {
          setLoading(false);
        }
      };

      fetchCategory();
    }
  }, [id, isEditMode]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCategory((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!category.name.trim()) {
      setError("Category name is required");
      return;
    }

    try {
      if (isEditMode) {
        const formData = new FormData();
        formData.append("name", category.name.trim());
        await updateCategory(Number(id), formData);
        setSuccess("Category updated successfully");
      } else {
        const formData = new FormData();
        formData.append("name", category.name.trim());
        await addCategory(formData);
        setSuccess("Category created successfully");
        setCategory({ name: "" });
      }
      setTimeout(() => navigate("/category"), 2000);
    } catch (error: unknown) {
      console.error("Error saving category:", error);
      setError(
        error instanceof Error
          ? error.message
          : isEditMode
          ? "Failed to update category."
          : "Failed to create category."
      );
    }
  };

  return (
    <div className="md:flex " id="category-wrapper">
      <Aside />
      <div className="flex-grow w-full">
        <Box display="flex" justifyContent="space-between" py={2}>
          <Button
            variant="outlined"
            color="inherit"
            onClick={() => navigate("/category")}
            sx={{ borderColor: "#032f5b", color: "#032f5b" }}
          >
            Back
          </Button>
          <Button
            variant="contained"
            color="primary"
            type="submit"
            form="category-form"
            sx={{
              backgroundColor: "#032f5b",
              "&:hover": { backgroundColor: "#021f3c" },
            }}
          >
            {isEditMode ? "Update Category" : "Save Category"}
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
          <div className="py-4 ">
            <Typography
              variant="h4"
              gutterBottom
              sx={{ fontWeight: "bold", color: "#032f5b" }}
            >
              {isEditMode ? "Edit Category" : "Add New Category"}
            </Typography>
            <form onSubmit={handleSubmit} id="category-form">
              <Box mb={4}>
                <TextField
                  fullWidth
                  label="Category Name"
                  name="name"
                  value={category.name}
                  onChange={handleChange}
                  required
                  error={!!error && error.includes("Category name is required")}
                  helperText={
                    error && error.includes("Category name is required")
                      ? "Category name is required"
                      : ""
                  }
                />
              </Box>
            </form>
          </div>
        )}

        <Footer />
      </div>
    </div>
  );
};

export default CategoryField;