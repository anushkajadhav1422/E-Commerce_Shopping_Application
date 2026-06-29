import '../Login/login.css'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import {
  Avatar, Button, Checkbox, CssBaseline,
  FormControlLabel, Grid, InputAdornment,
  TextField, Typography
} from '@mui/material'
import { MdLockOutline } from 'react-icons/md'
import { Box, Container } from '@mui/system'
import { toast } from 'react-toastify'
import { RiEyeFill, RiEyeOffFill } from 'react-icons/ri';

import CopyRight from '../../../Components/CopyRight/CopyRight'

const AdminRegister = () => {

  const [credentials, setCredentials] = useState({
    firstName: "",
    lastName: '',
    email: "",
    phoneNumber: '',
    password: "",
    key: ""
  })

  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword)
  }

  const handleOnChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value })
  }

  // ✅ If already logged in → go to admin home
  useEffect(() => {
    let auth = localStorage.getItem('Authorization')
    if (auth) {
      navigate("/admin/home")
    }
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/api/admin/register`,
        credentials
      )

      if (data.success) {
        toast.success("Registered Successfully")

        // ❌ DO NOT STORE TOKEN HERE
        navigate("/admin/login")
      } else {
        toast.error(data.data || "Registration failed")
      }

    } catch (error) {
      console.log(error.response?.data)
      toast.error(error.response?.data?.data || "Something went wrong")
    }
  }

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />

      <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Avatar sx={{ m: 1, bgcolor: '#1976d2' }}>
          <MdLockOutline />
        </Avatar>

        <Typography component="h1" variant="h5">
          Admin Sign Up
        </Typography>

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={2}>

            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="First Name" name="firstName"
                value={credentials.firstName} onChange={handleOnChange} />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Last Name" name="lastName"
                value={credentials.lastName} onChange={handleOnChange} />
            </Grid>

            <Grid item xs={12}>
              <TextField fullWidth label="Email" name="email"
                value={credentials.email} onChange={handleOnChange} />
            </Grid>

            <Grid item xs={12}>
              <TextField fullWidth label="Phone Number" name="phoneNumber"
                value={credentials.phoneNumber} onChange={handleOnChange} />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Password"
                name="password"
                value={credentials.password}
                onChange={handleOnChange}
                type={showPassword ? "text" : "password"}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end" onClick={handleClickShowPassword}>
                      {showPassword ? <RiEyeFill /> : <RiEyeOffFill />}
                    </InputAdornment>
                  )
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Admin Code"
                name="key"
                value={credentials.key}
                onChange={handleOnChange}
                type="password"
              />
            </Grid>

            <Grid item xs={12}>
              <FormControlLabel
                control={<Checkbox />}
                label="Receive updates"
              />
            </Grid>

          </Grid>

          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3 }}>
            Sign Up
          </Button>

          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link to="/admin/login">Already have account? Login</Link>
            </Grid>
          </Grid>
        </Box>
      </Box>

      <CopyRight />
    </Container>
  )
}

export default AdminRegister