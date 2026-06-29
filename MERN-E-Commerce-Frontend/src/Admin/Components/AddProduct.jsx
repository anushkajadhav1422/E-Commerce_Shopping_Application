// Components/Admin/AddProduct.jsx

import React, { useState } from 'react'
import {
    Box, Button, Dialog, DialogActions, DialogContent, DialogTitle,
    Divider, Grid, TextField, Typography, InputLabel, MenuItem,
    FormControl, Select,
} from '@mui/material';
import { toast } from 'react-toastify';
import axios from 'axios';
import { Transition } from '../../Constants/Constant';
import { MdOutlineCancel, MdProductionQuantityLimits } from 'react-icons/md';

const AddProduct = ({ getProductInfo, data }) => {

    const [open, setOpen] = useState(false);

    let authToken = localStorage.getItem("Authorization")

    const [productInfo, setProductInfo] = useState({
        name: "",
        image: "",
        price: "",
        rating: "",
        category: "",
        type: "",
        description: "",
        author: "",
        brand: ""
    });

    const handleOnchange = (e) => {
        setProductInfo({ ...productInfo, [e.target.name]: e.target.value })
    }

    const handleClickOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            // ✅ FIX: validation condition
            if (!productInfo.name || !productInfo.image || !productInfo.price || !productInfo.type) {
                toast.error("Please fill required fields", { autoClose: 500, theme: 'colored' })
                return;
            }

            if (productInfo.rating < 0 || productInfo.rating > 5) {
                toast.error("Please add valid rating", { autoClose: 500, theme: 'colored' })
                return;
            }

            const { data } = await axios.post(
                `${process.env.REACT_APP_BASE_URL}/api/admin/addproduct`,
                {
                    name: productInfo.name,
                    brand: productInfo.brand,
                    price: productInfo.price,
                    category: productInfo.category,
                    image: productInfo.image,
                    rating: productInfo.rating,
                    type: productInfo.type,
                    author: productInfo.author,
                    description: productInfo.description,
                },
                {
                    headers: {
                        Authorization: `Bearer ${authToken}` // ✅ FIXED
                    }
                }
            );
            console.log(data);

            setOpen(false);

            // ✅ FIX: correct backend response check
            if (data.success) {
                await getProductInfo();

                toast.success("Product added successfully", {
                    autoClose: 500,
                    theme: 'colored'
                });

                setProductInfo({
                    name: "",
                    image: "",
                    price: "",
                    rating: "",
                    category: "",
                    type: "",
                    description: "",
                    author: "",
                    brand: ""
                });

            } else {
                toast.error("Something went wrong", {
                    autoClose: 500,
                    theme: 'colored'
                });
            }

        } catch (error) {
            console.log(error);

            toast.error(
                error.response?.data?.message || "Server Error",
                { autoClose: 500, theme: 'colored' }
            );
        }
    }

    const productFilter = []

    if (productInfo.type === 'book') {
        productFilter.push('scifi', 'business', 'mystery', 'cookbooks', 'accessories')
    }
    else if (productInfo.type === 'cloths') {
        productFilter.push('men', 'women')
    }
    else if (productInfo.type === 'shoe') {
        productFilter.push('running', 'football', 'formal', 'casual')
    }
    else if (productInfo.type === 'electronics') {
        productFilter.push('monitor', 'ssd', 'hdd')
    }
    else {
        productFilter.push('all')
    }

    const typeDropdown = ['book', 'cloths', 'shoe', 'electronics'];
    const shoeBrand = ['adidas', 'hushpuppies', 'nike', 'reebok', 'vans']

    return (
        <>
            <Box sx={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', margin: "20px 0" }} >
                <Typography variant='h6' textAlign='center' color="#1976d2" fontWeight="bold">
                    Add new product
                </Typography>
                <Button variant='contained' endIcon={<MdProductionQuantityLimits />} onClick={handleClickOpen}>
                    Add
                </Button>
            </Box>

            <Divider sx={{ mb: 5 }} />

            <Dialog open={open} onClose={handleClose} keepMounted TransitionComponent={Transition}>
                <DialogTitle sx={{ textAlign: "center", fontWeight: 'bold', color: "#1976d2" }}>
                    Add new product
                </DialogTitle>

                <DialogContent>
                    <Box sx={{ mt: 2 }}>
                        <form onSubmit={handleSubmit}>
                            <Grid container spacing={2}>

                                <Grid item xs={12}>
                                    <TextField label="Name" name='name' value={productInfo.name} onChange={handleOnchange} fullWidth />
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <FormControl fullWidth>
                                        <InputLabel>Product Type</InputLabel>
                                        <Select value={productInfo.type} name='type' onChange={handleOnchange}>
                                            {typeDropdown.map(item => (
                                                <MenuItem value={item} key={item}>{item}</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <FormControl fullWidth>
                                        <InputLabel>Product Category</InputLabel>
                                        <Select value={productInfo.category} name='category' onChange={handleOnchange}>
                                            {productFilter.map(item => (
                                                <MenuItem value={item} key={item}>{item}</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>

                                {productInfo.type === 'book' && (
                                    <Grid item xs={12}>
                                        <TextField label="Author" name='author' value={productInfo.author} onChange={handleOnchange} fullWidth />
                                    </Grid>
                                )}

                                {productInfo.type === 'shoe' && (
                                    <Grid item xs={12}>
                                        <FormControl fullWidth>
                                            <InputLabel>Shoe Brand</InputLabel>
                                            <Select value={productInfo.brand} name='brand' onChange={handleOnchange}>
                                                {shoeBrand.map(item => (
                                                    <MenuItem value={item} key={item}>{item}</MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                )}

                                <Grid item xs={12}>
                                    <TextField label="Image URL" name='image' value={productInfo.image} onChange={handleOnchange} fullWidth />
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <TextField label="Price" name='price' value={productInfo.price} onChange={handleOnchange} fullWidth />
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <TextField label="Rating" name='rating' value={productInfo.rating} onChange={handleOnchange} fullWidth />
                                </Grid>

                                <Grid item xs={12}>
                                    <TextField
                                        label="Description"
                                        multiline
                                        name='description'
                                        value={productInfo.description}
                                        onChange={handleOnchange}
                                        fullWidth
                                    />
                                </Grid>

                            </Grid>

                            <DialogActions sx={{ mt: 2 }}>
                                <Button fullWidth color='error' onClick={handleClose} endIcon={<MdOutlineCancel />}>
                                    Cancel
                                </Button>
                                <Button type="submit" fullWidth variant="contained" endIcon={<MdProductionQuantityLimits />}>
                                    Add
                                </Button>
                            </DialogActions>

                        </form>
                    </Box>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default AddProduct;