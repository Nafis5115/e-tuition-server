import express from "express";
import {
  createCheckoutSession,
  getTutorRevenueHistory,
  getUserPaymentHistory,
  paymentSuccess,
} from "../controllers/payment.controller.js";
const router = express.Router();

router.post("/create-checkout-session", createCheckoutSession);
router.patch("/payment-success", paymentSuccess);
router.get("/user-payment-history", getUserPaymentHistory);
router.get("/tutor-revenue-history", getTutorRevenueHistory);

export default router;
