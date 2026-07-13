import './login.css'
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

const AdminLogin = () => {

  const [credentials, setCredentials] = useState({
    email: "",
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

  // ✅ Already logged in → go to dashboard
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
        `${process.env.REACT_APP_BASE_URL}/api/authAdmin/login`,
        credentials
      )

      if (data.success) {
        toast.success("Login Successful")

        // ✅ STORE TOKEN HERE
        localStorage.setItem("Authorization", data.token)

        navigate("/admin/home")
      } else {
        toast.error(data.data || "Login failed")
      }

    } catch (error) {
      console.log(error.response?.data)
      toast.error(error.response?.data?.data || "Invalid credentials")
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
          Admin Login
        </Typography>

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>

          <TextField fullWidth label="Email" name="email"
            value={credentials.email} onChange={handleOnChange} />

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

          <TextField
            fullWidth
            label="Admin Code"
            name="key"
            value={credentials.key}
            onChange={handleOnChange}
            type="password"
          />

          <FormControlLabel control={<Checkbox />} label="Remember me" />

          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3 }}>
            Login
          </Button>

          <Grid container>
            <Grid item xs>
              <Link to="/forgotpassword">Forgot password?</Link>
            </Grid>
            <Grid item>
              <Link to="/admin/register">Register</Link>
            </Grid>
          </Grid>

        </Box>
      </Box>

      <CopyRight />
    </Container>
  )
}

export default AdminLogin