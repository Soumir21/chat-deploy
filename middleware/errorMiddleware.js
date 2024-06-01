
const notFound = (req, res, next) => {
    const error = new Error(`Not found - ${req.originalUrl}`);
    res.status(404); // Set status code to 404 for Not Found error
    next(error); // Pass the error to the error handling middleware
};


const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode; // Corrected the comparison
    res.status(statusCode);
    res.json({
        message: err.message,
    });
};

module.exports={notFound,errorHandler};