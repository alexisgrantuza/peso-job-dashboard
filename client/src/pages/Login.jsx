import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  TextField,
  Button,
  Typography,
  Container,
  Alert,
} from "@mui/material";
import axios from "axios";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        formData
      );

      // Log the response to debug
      console.log(response.data);

      // Store the token and role
      const { token, role } = response.data;
      localStorage.setItem("token", token);
      localStorage.setItem("userRole", role);

      // Redirect based on role
      if (role === "superadmin") {
        navigate("/superadminDashboard");
      } else if (role === "admin") {
        navigate("/adminDashboard");
      } else {
        setError("Invalid role");
      }
    } catch (error) {
      setError(error.response?.data?.message || "An error occurred");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        bgcolor: "#f5f5f5",
      }}
    >
      {/* Left Section */}
      <Box
        sx={{
          flex: 1,
          bgcolor: "#CE2029",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          p: 4,
          color: "white",
        }}
      >
        <img
          src="/logo.png"
          alt="PESO Logo"
          style={{ width: 550, marginBottom: 62 }}
        />
        <Typography
          variant="h3"
          component="h1"
          sx={{ fontWeight: "bold", mb: 2 }}
        >
          JUANPLOYMENT
        </Typography>
        <Typography variant="h6" sx={{ textAlign: "center" }}>
          <span style={{ color: "#cccccc" }}>
            Jobs for Every <span style={{ color: "white" }}>Juan</span>, Hope
            for Everyone.
          </span>
        </Typography>
      </Box>

      {/* Right Section */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          p: 4,
        }}
      >
        <Container maxWidth="sm">
          <Typography variant="h4" sx={{ mb: 4, fontWeight: "bold" }}>
            Welcome back, Admin!
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{ mb: 3, color: "text.secondary" }}
          >
            Only employees
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              sx={{ mb: 2 }}
              placeholder="Enter your email"
            />
            <TextField
              fullWidth
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
              sx={{ mb: 3 }}
              placeholder="Enter your password"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                bgcolor: "#DC3545",
                "&:hover": {
                  bgcolor: "#CE2029",
                },
                py: 1.5,
                fontSize: "1rem",
              }}
            >
              LOG IN
            </Button>
          </form>
        </Container>
      </Box>
    </Box>
  );
}

export default Login;
