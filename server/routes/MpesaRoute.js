const express = require("express");
const { callback, generateToken, stkpush } = require("../controllers/Mpesa.js");

const mpesaRouter = express.Router();

// Define routes
mpesaRouter.post("/callback", callback);
mpesaRouter.post("/mpesa/payment", generateToken, stkpush);

// Export the router
module.exports = mpesaRouter;
