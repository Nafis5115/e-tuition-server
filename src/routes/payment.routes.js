import express from "express";
import {
  createCheckoutSession,
  getUserPaymentHistory,
  paymentSuccess,
} from "../controllers/payment.controller.js";
const router = express.Router();

router.post("/create-checkout-session", createCheckoutSession);
router.patch("/payment-success", paymentSuccess);
router.get("/user-payment-history", getUserPaymentHistory);

export default router;
