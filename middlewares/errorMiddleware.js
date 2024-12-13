const apiResponse = require("../helpers/apiResponse");

module.exports = (err, req, res, next) => {
    console.error("Error:", err);

    // Check if it's development mode
    const isDevelopment = process.env.NODE_ENV === "development";

    if (err.name === "CastError" && err.kind === "ObjectId") {
        const message = `Resource not found. Invalid ID: ${err.value}`;
        const response = {
            status: 0,
            message,
        };
        if (isDevelopment) {
            response.stack = err.stack; // Include stack trace in development
        }
        return res.status(404).json(response);
    }

    if (err.name === "ValidationError") {
        const message = Object.values(err.errors).map((value) => value.message).join(", ");
        const response = {
            status: 0,
            message: "Validation Error.",
            data: message,
        };
        if (isDevelopment) {
            response.stack = err.stack; // Include stack trace in development
        }
        return res.status(400).json(response);
    }

    if (err.name === "UnauthorizedError") {
        const response = {
            status: 0,
            message: err.message,
        };
        if (isDevelopment) {
            response.stack = err.stack; // Include stack trace in development
        }
        return res.status(401).json(response);
    }

    // Default Internal Server Error
    const response = {
        status: 0,
        message: "Internal Server Error",
    };
    if (isDevelopment) {
        response.stack = err.stack; // Include stack trace in development
    }

    return res.status(500).json(response);
};
