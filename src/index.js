require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("./DB/index");
const express = require("express");
const app= express();
const port = process.env.PORT;
connectDB();

