require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const mongoose = require("mongoose");
const connectDB = require("./config/db");

const app = express();

const authRoutes = require("./routes/authRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const clientRoutes = require("./routes/clientRoutes");



app.use(cors());
app.use(morgan("dev"));
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));


connectDB();



app.use("/api/auth", authRoutes);
app.use('/api', uploadRoutes);
app.use("/client", clientRoutes);



app.get("/", (req, res) => res.send("E-commerce API Running"));

const PORT = process.env.PORT || 5000;

app.listen(PORT,()=>{
    console.log('app is running on --->',PORT)
})