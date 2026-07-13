const connectToMongo = require('./config');
const bodyParser = require('body-parser')
const express = require('express')
const cors = require('cors')
const path = require('path');

const authUser = require('./routes/authUserRoute');
const cart = require('./routes/cartRoute')
const wishlist = require('./routes/wishlistRoute')
const product = require('./routes/productRoute')
const review = require('./routes/reviewRoute')
const paymentRoute = require('./routes/paymentRoute')
const forgotPassword = require('./routes/forgotPassword')
const authAdmin = require('./routes/authAdminRoutes')
const dotenv = require('dotenv');
dotenv.config()

connectToMongo();

const port = 5000

const app = express()

// create application/json parser
app.use(bodyParser.json())
// create application/x-www-form-urlencoded parser
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.urlencoded({ extended: true }))



app.use(express.json())
app.use(cors());
app.use(express.static(path.join(__dirname, 'build')));

// app.get('/', function (req, res) {
//     res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
// });


app.use('/api/authUser', authUser)

app.use('/api/authAdmin', authAdmin)

app.use('/api/product', product)

app.use('/api/cart', cart)

app.use('/api/wishlist', wishlist)

app.use('/api/review', review)


app.use('/api', paymentRoute)


app.use('/api/password', forgotPassword)

app.listen(port, () => {
    console.log(`E-commerce backend listening at http://localhost:${port}`)
})
