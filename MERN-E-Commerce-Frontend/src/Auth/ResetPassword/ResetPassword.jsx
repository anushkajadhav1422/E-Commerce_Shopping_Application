import "../Login/login.css";
import {
  Avatar,
  Box,
  Button,
  Container,
  CssBaseline,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { MdLockOutline } from "react-icons/md";
import { RiEyeFill, RiEyeOffFill } from "react-icons/ri";

import CopyRight from "../../Components/CopyRight/CopyRight";

const ResetPassword = () => {

  const navigate = useNavigate();
  const { token } = useParams();

  const [showPassword, setShowPassword] = useState(false);

  const [passwords, setPasswords] = useState({
    password: "",
    confirmPassword: "",
  });

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleChange = (e) => {
    setPasswords({
      ...passwords,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      if (!passwords.password || !passwords.confirmPassword) {
        return toast.error("All fields are required.");
      }

      if (passwords.password !== passwords.confirmPassword) {
        return toast.error("Passwords do not match.");
      }

      const passwordRegex =
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

      if (!passwordRegex.test(passwords.password)) {
        return toast.error(
          "Password must contain uppercase, lowercase, number and special character."
        );
      }

      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/api/authUser/resetPassword`,
        {
          token,
          password: passwords.password,
          confirmPassword: passwords.confirmPassword,
        }
      );

      if (response.data.success) {

        toast.success(response.data.message);

        setTimeout(() => {
          navigate("/login");
        }, 1500);

      }

    } catch (error) {

      toast.error(
        error.response?.data?.message ||
        "Something went wrong."
      );

    }

  };

  return (
    <Container component="main" maxWidth="xs">

      <CssBaseline />

      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >

        <Avatar sx={{ m: 1, bgcolor: "#1976d2" }}>
          <MdLockOutline />
        </Avatar>

        <Typography component="h1" variant="h5">
          Reset Password
        </Typography>

        <Typography
          variant="body2"
          sx={{ mt: 1, color: "gray" }}
        >
          Enter your new password
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit}
          noValidate
          sx={{ mt: 2 }}
        >

          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="New Password"
            type={showPassword ? "text" : "password"}
            value={passwords.password}
            onChange={handleChange}
            InputProps={{
              endAdornment: (
                <InputAdornment
                  position="end"
                  onClick={handleClickShowPassword}
                  sx={{ cursor: "pointer" }}
                >
                  {showPassword ? (
                    <RiEyeFill />
                  ) : (
                    <RiEyeOffFill />
                  )}
                </InputAdornment>
              ),
            }}
          />

          <TextField
            margin="normal"
            required
            fullWidth
            name="confirmPassword"
            label="Confirm Password"
            type={showPassword ? "text" : "password"}
            value={passwords.confirmPassword}
            onChange={handleChange}
            InputProps={{
              endAdornment: (
                <InputAdornment
                  position="end"
                  onClick={handleClickShowPassword}
                  sx={{ cursor: "pointer" }}
                >
                  {showPassword ? (
                    <RiEyeFill />
                  ) : (
                    <RiEyeOffFill />
                  )}
                </InputAdornment>
              ),
            }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Reset Password
          </Button>

        </Box>

      </Box>

      <CopyRight sx={{ mt: 8, mb: 4 }} />

    </Container>
  );
};

export default ResetPassword;