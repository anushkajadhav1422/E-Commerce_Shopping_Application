import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { Container } from '@mui/system';
import { Box, Button, Dialog, DialogActions, DialogContent, Typography } from '@mui/material';
import { AiFillCloseCircle, AiOutlineLogin } from 'react-icons/ai';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

import CartCard from '../../Components/Card/CartCard/CartCard';
import CopyRight from '../../Components/CopyRight/CopyRight';
import { ContextFunction } from '../../Context/Context';
import { EmptyCart } from '../../Assets/Images/Image';
import { Transition } from '../../Constants/Constant';

const Wishlist = () => {
    const { wishlistData, setWishlistData } = useContext(ContextFunction);

    const [openAlert, setOpenAlert] = useState(false);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    const authToken = localStorage.getItem("Authorization");

    useEffect(() => {
        getWishList();
    }, [authToken]);

    const getWishList = async () => {
        if (!authToken) {
            setLoading(false);
            setOpenAlert(true);
            return;
        }

        try {
            setLoading(true);

            const { data } = await axios.get(
                `${process.env.REACT_APP_BASE_URL}/api/wishlist/fetchwishlist`,
                {
                    headers: {
                        Authorization: `Bearer ${authToken}`
                    }
                }
            );

            setWishlistData(data);
        } catch (error) {
            console.log(error);

            toast.error(
                error.response?.data?.message || "Unable to fetch wishlist",
                {
                    autoClose: 1000,
                    theme: "colored"
                }
            );
        } finally {
            setLoading(false);
        }
    };

    const removeFromWishlist = async (product) => {
        try {
            await axios.delete(
                `${process.env.REACT_APP_BASE_URL}/api/wishlist/deletewishlist/${product._id}`,
                {
                    headers: {
                        Authorization: `Bearer ${authToken}`
                    }
                }
            );

            setWishlistData(prev =>
                prev.filter(item => item._id !== product._id)
            );

            toast.success("Removed From Wishlist", {
                autoClose: 700,
                theme: "colored"
            });

        } catch (error) {
            console.log(error);

            toast.error(
                error.response?.data?.message || "Unable to remove product",
                {
                    autoClose: 1000,
                    theme: "colored"
                }
            );
        }
    };

    const handleClose = () => {
        setOpenAlert(false);
        navigate("/");
    };

    const handleToLogin = () => {
        navigate("/login");
    };

    return (
        <>
            <Typography
                variant="h3"
                sx={{
                    textAlign: "center",
                    margin: "10px 0",
                    color: "#1976d2",
                    fontWeight: "bold"
                }}
            >
                Wishlist
            </Typography>

            {loading ? (
                <Typography
                    variant="h6"
                    align="center"
                    sx={{ mt: 5 }}
                >
                    Loading...
                </Typography>
            ) : wishlistData.length === 0 ? (
                <Box
                    sx={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center"
                    }}
                >
                    <div className="main-card">
                        <img
                            src={EmptyCart}
                            alt="Empty Cart"
                            className="empty-cart-img"
                        />

                        <Typography
                            variant="h6"
                            sx={{
                                textAlign: "center",
                                color: "#1976d2",
                                fontWeight: "bold"
                            }}
                        >
                            No products in wishlist
                        </Typography>
                    </div>
                </Box>
            ) : (
                <Container
                    maxWidth="xl"
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        flexWrap: "wrap",
                        pb: 3
                    }}
                >
                    {wishlistData.map(product => (
                        <CartCard
                            key={product._id}
                            product={product}
                            removeFromCart={removeFromWishlist}
                        />
                    ))}
                </Container>
            )}

            <Dialog
                open={openAlert}
                keepMounted
                onClose={handleClose}
                TransitionComponent={Transition}
            >
                <DialogContent
                    sx={{
                        width: { xs: 280, md: 350, xl: 400 },
                        display: "flex",
                        justifyContent: "center"
                    }}
                >
                    <Typography variant="h5">
                        Please Login To Proceed
                    </Typography>
                </DialogContent>

                <DialogActions
                    sx={{
                        display: "flex",
                        justifyContent: "space-evenly"
                    }}
                >
                    <Button
                        variant="contained"
                        onClick={handleToLogin}
                        endIcon={<AiOutlineLogin />}
                    >
                        Login
                    </Button>

                    <Button
                        variant="contained"
                        color="error"
                        onClick={handleClose}
                        endIcon={<AiFillCloseCircle />}
                    >
                        Close
                    </Button>
                </DialogActions>
            </Dialog>

            <CopyRight sx={{ mt: 8, mb: 10 }} />
        </>
    );
};

export default Wishlist;