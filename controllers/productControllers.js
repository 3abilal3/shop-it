const { body, validationResult } = require("express-validator");
const apiResponse = require("../helpers/apiResponse");
const Product = require("../models/product");

exports.ProductListing = [
    body("name").isString().withMessage("Product name must be a string."),
    body("price").isFloat({ gt: 0 }).withMessage("Price must be a number greater than 0."),
    body("description").optional().isString().withMessage("Description must be a string."),
    body("category").optional().isString().withMessage("Category must be a string."),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return apiResponse.validationErrorWithData(res, "Validation Error.", errors.array());
        }

        try {
            const product = new Product(req.body);

            const savedProduct = await product.save(); 
            return apiResponse.successResponseWithData(res, "Successfully registered product", savedProduct);
        } catch (err) {
            console.error(err);
            return apiResponse.ErrorResponse(res, "An error occurred while registering the product.");
        }
    }
];


exports.AllProducts=[
    async (req, res) => {
    try {
        // Fetch all products from the database
        const products = await Product.find();
        if(!products){
            return apiResponse.notFoundResponse(res,"No Product found!")
        }
        // Return success response with data
        return apiResponse.successResponseWithData(res, 'Products retrieved successfully.', products);
      } catch (error) {
        console.error('Error fetching products:', error.message);
        return apiResponse.ErrorResponse(res, 'An error occurred while retrieving products.');
      }
    }
]

exports.getProduct=[
    async (req, res) => {
    try {
        // Fetch all products from the database
        const product = await Product.findById(req?.params?.id);
        if(!product){
            return apiResponse.notFoundResponse(res,"No Product found with this id!")
        }
        // Return success response with data
        return apiResponse.successResponseWithData(res, 'Product retrieved successfully.', product);
      } catch (error) {
        console.error('Error fetching products:', error.message);
        return apiResponse.ErrorResponse(res, 'An error occurred while retrieving products.');
      }
    }
]

exports.updateProduct=[
    async (req, res) => {
    try {
        // Fetch all products from the database
        const product = await Product.findByIdAndUpdate(req?.params?.id,req.body,{
            new:true
        });
        if(!product){
            return apiResponse.notFoundResponse(res,"No Product found with this id!")
        }
        // Return success response with data
        return apiResponse.successResponseWithData(res, 'Product updated successfully.', product);
      } catch (error) {
        console.error('Error fetching products:', error.message);
        return apiResponse.ErrorResponse(res, 'An error occurred while updating products.');
      }
    }
]

exports.DeleteProduct=[
    async (req, res) => {
    try {
        // Fetch all products from the database
        const product = await Product.findByIdAndDelete(req?.params?.id);
        if(!product){
            return apiResponse.notFoundResponse(res,"No Product found with this id!")
        }
        // Return success response with data
        return apiResponse.successResponseWithData(res,`Product with the  id ${req.params.id}Deleted successfully.`);
      } catch (error) {
        console.error('Error fetching products:', error.message);
        return apiResponse.ErrorResponse(res, 'An error occurred while Deleting products.');
      }
    }
]