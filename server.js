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
const paymentRoutes = require("./routes/paymentRoutes");




app.use(cors());
app.use(morgan("dev"));
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));


connectDB();



app.use("/auth", authRoutes);
app.use('/upload', uploadRoutes);
app.use("/client", clientRoutes);
app.use("/payments", paymentRoutes);




app.get("/", (req, res) => res.send("E-commerce API Running"));

const PORT = process.env.PORT || 8080;

app.listen(PORT,()=>{
    console.log('app is running on --->',PORT)
})