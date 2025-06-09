import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  InputAdornment,
  IconButton,
  Alert,
  CircularProgress,
  Paper,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import LoginService from "../../Services/LoginService";
import { useNavigate } from "react-router-dom";

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [captchaImage, setCaptchaImage] = useState<string | null>(null); // CAPTCHA image
  const [captchaInput, setCaptchaInput] = useState(""); // User-entered CAPTCHA
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const toggleShowPassword = () => setShowPassword((prev) => !prev);

  // LoginForm.tsx
const fetchCaptcha = async () => {
  try {
    const captcha = await LoginService.getCaptcha();
    setCaptchaImage(captcha);
  } catch (error: any) {
    console.error("Failed to fetch CAPTCHA:", error);
    setError(error.message || "Failed to load CAPTCHA.");
  }
};

  useEffect(() => {
    fetchCaptcha();
  }, []);

  const handleApiError = (
    err: unknown
  ): { message: string; errors: { [key: string]: string } } => {
    if (err instanceof Error) {
      try {
        const parsed = JSON.parse(err.message);
        if (
          parsed &&
          typeof parsed === "object" &&
          parsed.message &&
          parsed.errors
        ) {
          const errors = Object.keys(parsed.errors).reduce((acc, key) => {
            acc[key] = parsed.errors[key][0];
            return acc;
          }, {} as { [key: string]: string });
          return { message: parsed.message, errors };
        }
      } catch {
        return {
          message: err.message || "An unexpected error occurred.",
          errors: {},
        };
      }
    }
    return { message: "An unexpected error occurred.", errors: {} };
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setGeneralError(null);
    setSuccessMessage(null);
    setFieldErrors({});
    setLoading(true);

    const currentFieldErrors: { [key: string]: string } = {};
    let isValid = true;

    if (!email) {
      currentFieldErrors.email = "Email is required.";
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      currentFieldErrors.email = "Invalid email format.";
      isValid = false;
    }

    if (!password) {
      currentFieldErrors.password = "Password is required.";
      isValid = false;
    } else if (password.length < 8) {
      currentFieldErrors.password = "Password must be at least 8 characters.";
      isValid = false;
    }

    if (!captchaInput) {
      currentFieldErrors.captcha = "CAPTCHA is required.";
      isValid = false;
    }

    if (!isValid) {
      setFieldErrors(currentFieldErrors);
      setLoading(false);
      return;
    }

    try {
      await LoginService.login({ email, password, captcha: captchaInput });
      setSuccessMessage("Login successful! Redirecting...");
      setTimeout(() => navigate("/"), 1500);
    } catch (err: unknown) {
      const { message, errors } = handleApiError(err);
      setGeneralError(message);
      setFieldErrors(errors);

      if (errors.captcha) {
        setCaptchaInput("");
        await fetchCaptcha();
        setFieldErrors((prevErrors) => ({
          ...prevErrors,
          captcha: "The CAPTCHA entered was incorrect. Please try again.",
        }));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        bgcolor: "#f5f5f5",
      }}
    >
      <Paper elevation={3} sx={{ p: 4, width: "100%", maxWidth: 400 }}>
        <Typography
          variant="h5"
          sx={{ py: 2, fontWeight: 600, textAlign: "center" }}
        >
          Secure Login
        </Typography>

        {generalError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {generalError}
          </Alert>
        )}
        {successMessage && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {successMessage}
          </Alert>
        )}

        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "16px" }}
        >
          <TextField
            label="Email"
            type="email"
            fullWidth
            required
            value={email}
            onChange={(e) => setEmail(e.target.value.trim())}
            disabled={loading}
            error={!!fieldErrors.email}
            helperText={fieldErrors.email}
            inputProps={{ "aria-label": "Email address" }}
          />

          <TextField
            label="Password"
            type={showPassword ? "text" : "password"}
            fullWidth
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            error={!!fieldErrors.password}
            helperText={fieldErrors.password}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={toggleShowPassword}
                    edge="end"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            inputProps={{ "aria-label": "Password" }}
          />

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mt: 1,
            }}
          >
            {captchaImage ? (
              <img
                src={captchaImage}
                alt="CAPTCHA image for verification"
                style={{ height: 50 }}
              />
            ) : (
              <CircularProgress size={30} />
            )}
            <Button size="small" onClick={fetchCaptcha} disabled={loading}>
              Reload
            </Button>
          </Box>

          <TextField
            label="Enter CAPTCHA"
            fullWidth
            required
            value={captchaInput}
            onChange={(e) => setCaptchaInput(e.target.value)}
            disabled={loading}
            error={!!fieldErrors.captcha}
            helperText={fieldErrors.captcha}
            inputProps={{ "aria-label": "Enter CAPTCHA text" }}
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={loading}
            sx={{
              backgroundColor: "#032f5b",
              color: "#fff",
              "&:hover": { backgroundColor: "#0254a0" },
              mt: 2,
            }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "Login"}
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default LoginForm;