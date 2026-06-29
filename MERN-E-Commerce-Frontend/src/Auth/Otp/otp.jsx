import React, { useState } from 'react';
import { Avatar, Button, Checkbox, CssBaseline, FormControlLabel, Grid, InputAdornment, TextField, Typography } from '@mui/material'
import { Box, Container } from '@mui/system'
import { verify } from '../../actions/userActions';
import { useNavigate } from 'react-router-dom';
import { MdLockOutline } from 'react-icons/md'
import { RiEyeFill, RiEyeOffFill } from 'react-icons/ri';
import { toast } from 'react-toastify';

const VerifyOtp = () => {
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();

  const email = localStorage.getItem("verifyEmail");

const handleVerify = async () => {
  if (!otp) {
    toast.error("Please enter OTP");
    return;
  }

  try {
    const response = await verify(email, otp);

    if (response.success) {
      toast.success(response.data || "Verified successfully");

      // ✅ clear email
      localStorage.removeItem("verifyEmail");

      // ✅ go to login
      navigate("/login");
    } else {
      toast.error(response.data || "Invalid OTP");
    }
  } catch (error) {
    toast.error("Verification failed");
  }
};

  return (
     <Container component="main" maxWidth="xs">
    <CssBaseline />
    <Box
      sx={{
        marginTop: 8,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Avatar sx={{ m: 1, bgcolor: '#1976d2' }}>
        <MdLockOutline />
      </Avatar>

      <Typography component="h1" variant="h5">
        Verify OTP
      </Typography>

      <Typography variant="body2" sx={{ mt: 1, textAlign: 'center' }}>
        Enter the OTP sent to your email
      </Typography>

      <Box sx={{ mt: 3 }}>
        <TextField
          margin="normal"
          required
          fullWidth
          id="otp"
          label="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          autoFocus
        />

        <Button
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
          onClick={handleVerify}
        >
          Verify OTP
        </Button>
      </Box>
    </Box>
  </Container>
);
};

export default VerifyOtp;