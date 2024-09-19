const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const userRoutes = require("./routes/userRoutes");

const connectDB = require("./config/db");
const app = express();
app.use(express.json());

connectDB();
app.use("/api/user", userRoutes);

const port = process.env.PORT || 5000;
app.listen(port, console.log(`server Started on port ${port}`));
