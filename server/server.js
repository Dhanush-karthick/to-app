const express = require('express');
const mongoose = require('mongoose');
const todoRoutes=require('./routes/todo.js')
const connectMongoDB=require('./config/db.js')
const cors=require('cors')
require('dotenv').config();
const app = express();
app.use(express.json());
connectMongoDB()

app.use(cors({
    origin: [
        "http://localhost:3000"
    ],
    credentials: true
}));
const PORT=process.env.PORT

app.use('/api/todo',todoRoutes)

app.listen(PORT, function() {
    console.log(`Todo app server is listening on port ${PORT}`);
});
