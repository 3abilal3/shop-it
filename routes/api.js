var express = require("express");
const productRoutes=require('../routes/productRoutes')

var app = express();
app.use(express.json());

// app.use("/auth/", authRouter);
// app.use("/book/", bookRouter);
app.use("/product",productRoutes)

module.exports = app;