import express from "express"
import {  createPaymentOrder, verifyRazorpayPayment } from "../controllers/payment.controller.js";
// import isAuthenticated from "../middlewares/isAuthenticated.js";
const router = express.Router();

// Route to create a payment order
router.route('/create-order').post(  createPaymentOrder);

// Route to verify Razorpay payment
router.route('/verify-payment').post(verifyRazorpayPayment);

export default router;