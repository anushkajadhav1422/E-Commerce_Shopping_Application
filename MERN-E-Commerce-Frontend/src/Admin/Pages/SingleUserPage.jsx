import axios from 'axios';
import React from 'react'
import UserInfoItem from '../Components/UserData/UserInfoItem';
import UserCartItem from '../Components/UserData/UserCartItem';
import UserWishlistItem from '../Components/UserData/UserWishlistItem';
import UserReviewItem from '../Components/UserData/UserReviewItem';
import { useParams } from 'react-router-dom';
import { Container } from '@mui/material';
import UserOrderItem from '../Components/UserData/UserOrderItem';
import CopyRight from '../../Components/CopyRight/CopyRight';

const SingleUserPage = () => {
    const { id } = useParams();
    let authToken = localStorage.getItem("Authorization")

    // ✅ Added correct BASE URL here
    const BASE_URL = "http://localhost:5000/api/admin/getuser";

    const commonGetRequest = async (url, userId, setData) => {
        try {
            const { data } = await axios.get(`${url}/${userId}`, {
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            });
            console.log(data);
            setData(data)
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <>
            <Container>
                <UserInfoItem commonGetRequest={commonGetRequest} authToken={authToken} id={id} url={BASE_URL} />
                <UserOrderItem commonGetRequest={commonGetRequest} authToken={authToken} id={id} url={BASE_URL} />
                <UserCartItem commonGetRequest={commonGetRequest} authToken={authToken} id={id} url={BASE_URL} />
                <UserWishlistItem commonGetRequest={commonGetRequest} authToken={authToken} id={id} url={BASE_URL} />
                <UserReviewItem commonGetRequest={commonGetRequest} authToken={authToken} id={id} url={BASE_URL} />
            </Container >
            <CopyRight sx={{ mt: 8, mb: 10 }} />
        </>
    )
}

export default SingleUserPage