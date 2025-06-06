import React, { useState } from "react";
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

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [verifyCode, setVerifyCode] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"login" | "verify">("login");

  const toggleShowPassword = () => setShowPassword((prev) => !prev);

  const handleLoginSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) throw new Error("Invalid credentials or server error.");

      const data = await response.json();
      console.log("Step 1 success", data);

      // Move to verification step
      setStep("verify");
    } catch (err: any) {
      setError(err.message || "Login failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifySubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!verifyCode) {
      setError("Verification code is required.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("/api/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, code: verifyCode }),
      });

      if (!response.ok) throw new Error("Invalid verification code.");

      const data = await response.json();
      console.log("Verification successful", data);
      // Proceed to redirect or dashboard
    } catch (err: any) {
      setError(err.message || "Verification failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className="flex items-center justify-center min-h-screen ">
      <Paper elevation={3} className="p-6 space-y-4 w-full max-w-md">
        <Typography variant="h5" className="py-4 font-semibold">
          {step === "login" ? "Secure Login" : "Enter Verification Code"}
        </Typography>

        {error && <Alert severity="error">{error}</Alert>}

        {step === "login" ? (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
           <div>
             <TextField
              label="Email"
              type="email"
              fullWidth
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
           </div>
            <div>
                <TextField
              label="Password"
              type={showPassword ? "text" : "password"}
              fullWidth
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={toggleShowPassword} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            </div>
            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading}
              sx={{ backgroundColor: "#032f5b", color: "#fff" }}
            >
              {loading ? <CircularProgress size={24} /> : "Login"}
            </Button>
          </form>
        ) : (
          <form onSubmit={handleVerifySubmit} className="space-y-4">
            <div>
 <TextField
              label="Verification Code"
              type="text"
              fullWidth
              required
              value={verifyCode}
              onChange={(e) => setVerifyCode(e.target.value)}
            />
            </div>
           
            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading}
              sx={{ backgroundColor: "#032f5b", color: "#fff" }}
            >
              {loading ? <CircularProgress size={24} /> : "Verify Code"}
            </Button>
          </form>
        )}
      </Paper>
    </Box>
  );
};

export default LoginForm;
