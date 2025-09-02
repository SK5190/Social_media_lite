require('dotenv').config();
const express = require('express')
const cookieParser = require('cookie-parser')
const cors = require('cors');
const app = express()
const authRoutes = require('./routes/auth.routes')
const postRoutes = require('./routes/post.routes')

app.use(cors({
    origin: 'http://localhost:5174', // Replace with your frontend's origin
    credentials: true,
}));
app.use(express.json())
app.use(cookieParser())


app.use('/api/auth', authRoutes);
app.use('/api/post', postRoutes);




module.exports = app;