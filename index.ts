
import express, { NextFunction, Request, Response } from "express"
import userRoute from "./src/api/routes/user_route";
import categoriesRoute from "./src/api/routes/categories_route";
import productsRoute from "./src/api/routes/product_route";
import cors from "cors"
import cartRoute from "./src/api/routes/cart_route";
import orderRoute from "./src/api/routes/order_route";
import deliveryRoute from "./src/api/routes/delivery_route";
import addressRoute from "./src/api/routes/address_route";
import cookieParser from "cookie-parser";


import dotenv from 'dotenv';
dotenv.config();
// const express = require('express')
const app = express()



app.use(express.json());
app.use(cors({
    origin:'*',// frontend URL
    credentials: true,                // allow cookies
}));
app.use(cookieParser());


app.use("/user", userRoute)
app.use("/categories",categoriesRoute)
app.use("/product", productsRoute)
app.use("/cart",cartRoute)
app.use("/order",orderRoute)
app.use("/delivery",deliveryRoute)
app.use("/address",addressRoute)

let port = process.env.PORT!;
app.listen(port, () => {
    console.log(`Running on http://localhost:${port}`)
})
    




