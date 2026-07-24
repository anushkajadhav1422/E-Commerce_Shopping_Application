import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Box,
  Typography,
  Button,
  Paper,
} from "@mui/material";

const RoleSelection = () => {
  const navigate = useNavigate();

  const handleUserLogin = () => {
    navigate("/login"); // User Login Route
  };

  const handleAdminLogin = () => {
    navigate("/admin/login"); // Admin Login Route
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Paper
          elevation={5}
          sx={{
            p: 5,
            width: "100%",
            textAlign: "center",
            borderRadius: 3,
          }}
        >
          <Typography
            variant="h4"
            gutterBottom
            fontWeight="bold"
          >
            Welcome to ShopIT
          </Typography>

          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ mb: 4 }}
          >
            Choose how you would like to continue
          </Typography>

          <Button
            variant="contained"
            fullWidth
            size="large"
            sx={{ mb: 2 }}
            onClick={handleUserLogin}
          >
            Login as User
          </Button>

          <Button
            variant="outlined"
            fullWidth
            size="large"
            onClick={handleAdminLogin}
          >
            Login as Admin
          </Button>
        </Paper>
      </Box>
    </Container>
  );
};

export default RoleSelection;