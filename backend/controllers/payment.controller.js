import Razorpay from 'razorpay';
import crypto from 'crypto';
import { PaymentPlan, Payment } from '../models/payment.model.js';

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Function to create payment order
export const createPaymentOrder = async (req,res) => {
    const {planType}=req.body;
    try{
        const plans = {
            basic: { price: 299, jobLimit: 1 },
            standard: { price: 799, jobLimit: 3 },
            premium: { price: 1499, jobLimit: -1 } // Unlimited job limit
        };

        // Validate the plan type
        if (!plans[planType]) {
            return res.status(400).json({
                message: "Invalid plan type provided.",
                success: false,
            });
        }

        const selectedPlan = plans[planType];
        console.log("Selected Plan:", selectedPlan);

    const options = {
        amount: selectedPlan.price * 100,
        currency: 'INR',
        receipt: `receipt_${Date.now()}`,
        payment_capture: 1,
    };
    const order = await razorpay.orders.create(options);
    console.log("Razorpay Order Created:", order);

    const payment = new Payment({
        userId: req.user._id, // Assuming isAuthenticated middleware sets req.user
        paymentOrderId: order.id,
        amount: selectedPlan.price,
        currency: options.currency,
        planType: planType,
        planDetails: selectedPlan,
    });

    console.log("Saving Payment to Database:", payment);
    try {
        await payment.save();
        console.log("Payment Saved Successfully:", payment);
        return res.status(201).json({
            message: "Payment order created successfully.",
            order,
            success: true,
        });
    } catch (dbError) {
        console.error("Error Saving Payment:", dbError.message, dbError.stack);
        return res.status(500).json({
            message: "Error saving payment to database",
            error: dbError.message,
            success: false,
        });
    }
  } catch (error) {
    return res.status(500).json({
      message: "Error creating payment order",
      success: false,
    });
  }
};

export const verifyRazorpayPayment = async (req, res) => {
    const { order_id, payment_id, signature } = req.body;

    try {
        // Generate the signature to verify it
        const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
        hmac.update(order_id + "|" + payment_id);
        const generatedSignature = hmac.digest('hex');

        // If signature matches, verify payment and store it
        if (generatedSignature === signature) {
            const paymentOrder = await Payment.findOne({ paymentOrderId: order_id });
            if (!paymentOrder) {
                return res.status(404).json({
                    message: "Payment order not found.",
                    success: false,
                });
            }
            paymentOrder.paymentStatus = 'success';
            paymentOrder.paymentId = payment_id;
            paymentOrder.paymentSignature = signature;
            paymentOrder.razorpaySignatureVerified = true;

            // Find the payment plan associated with the order and activate it
            const paymentPlan = await PaymentPlan.findOne({ planType: paymentOrder.planType });
            if (!paymentPlan) {
                return res.status(404).json({
                    message: "Payment plan not found.",
                    success: false,
                });
            }
            // Activate the plan and set expiry date
            paymentPlan.active = true;
            
            if (paymentPlan.planType === 'premium') {
                paymentPlan.expiryDate = new Date(Date.now() + (30 * 24 * 60 * 60 * 1000)); // Set expiry to 30 days
            }
            await paymentPlan.save();

            await paymentOrder.save();

            return res.status(200).json({
                message: "Payment verified and plan activated.",
                success: true,
            });
        } else {
            return res.status(400).json({
                message: "Payment verification failed.",
                success: false,
            });
        }
    } catch (error) {
        console.error('Error verifying Razorpay payment:', error);
        return res.status(500).json({
            message: "Internal server error",
            success: false,
        });
    }
};