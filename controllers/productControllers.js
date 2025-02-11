const { body, validationResult } = require("express-validator");
const apiResponse = require("../helpers/apiResponse");
const Product = require("../models/product");
const APIFilters = require("../utils/apiFilters");

// Helper function to include stack trace in development
function includeStack(error, resData) {
  if (process.env.NODE_ENV === "development") {
    resData.stack = error.stack;
  }
  return resData;
}

exports.createProduct = [
  body("name").isString().withMessage("Product name must be a string."),
  body("price").isFloat({ gt: 0 }).withMessage("Price must be a number greater than 0."),
  body("description").optional().isString().withMessage("Description must be a string."),
  body("category").optional().isString().withMessage("Category must be a string."),
  async (req, res ,next) => {
    // Handle validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return apiResponse.validationErrorWithData(res, "Validation Error.", errors.array());
    }

    try {
      // Create and save product
      const product = new Product(req.body);
      const savedProduct = await product.save();

      return apiResponse.successResponseWithData(
        res,
        "Product created successfully.",
        savedProduct
      );
    } catch (err) {
      next(err);
      console.error("Error while creating product:", err.message);
      return apiResponse.ErrorResponse(res, "An error occurred while creating the product.");
    }
  },
];

// Get All Products
exports.getAllProducts = [
  async (req, res,next) => {
    try {
      let resPerPage = 4;
      let apiFilters=new APIFilters(Product.find(),req.query).search().filters(); 

      let products = await apiFilters.query;
      let count=products.length;
      if(!count) {
        let error = new Error("No product found .");
        return apiResponse.notFoundResponse(res, error.message, error);
      }

      let totalPages = Math.ceil(count / resPerPage);  // Calculate the total number of pages
      let currentPage = Number(req.query.page) || 1;

      let data={
        resPerPage:resPerPage,
        count:count,
        totalPages: totalPages,  
        currentPage: currentPage,
        data:products,
        
      }
      return apiResponse.successResponseWithData(
        res,
        "Products retrieved successfully.",
        data
    )} catch (err) {
      next(err);
      console.error("Error while fetching products:", err.message);
      // return apiResponse.ErrorResponse(res, "An error occurred while fetching products.");
    }
  },
];

// Get Single Product
exports.getProduct = [
  async (req, res ,next) => {
    try {
      const product = await Product.findById(req.params.id);
      if (!product) {
        const error = new Error("No product found with this ID.");
        return apiResponse.notFoundResponse(res, error.message, error);
      }
      return apiResponse.successResponseWithData(
        res,
        "Product retrieved successfully.",
        product
      );
    } catch (err) {
      next(err);
      console.error("Error while fetching product:", err.message);
      // return apiResponse.ErrorResponse(res, "An error occurred while fetching the product.");
    }
  },
];

// Update Product
exports.updateProduct = [
  async (req, res ,next) => {
    try {
      const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });
      if (!updatedProduct) {
        return apiResponse.notFoundResponse(res, "No product found with this ID.");
      }
      return apiResponse.successResponseWithData(
        res,
        "Product updated successfully.",
        updatedProduct
      );
    } catch (err) {
      next(err);
      console.error("Error while updating product:", err.message);
      // return apiResponse.ErrorResponse(res, "An error occurred while updating the product.");
    }
  },
];

// Delete Product
exports.deleteProduct = [
  async (req, res ,next ) => {
    try {
      const deletedProduct = await Product.findByIdAndDelete(req.params.id);
      if (!deletedProduct) {
        return apiResponse.notFoundResponse(res, "No product found with this ID.");
      }
      return apiResponse.successResponseWithData(
        res,
        `Product with ID ${req.params.id} deleted successfully.`,
        deletedProduct
      );
    } catch (err) {
      next(err);
      console.error("Error while deleting product:", err.message);
      // return apiResponse.ErrorResponse(res, "An error occurred while deleting the product.");
    }
  },
];
