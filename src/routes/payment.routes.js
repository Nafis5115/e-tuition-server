import express from "express";
import {
  createCheckoutSession,
  paymentSuccess,
} from "../controllers/payment.controller.js";
const router = express.Router();

router.post("/create-checkout-session", createCheckoutSession);
router.patch("/payment-success", paymentSuccess);

export default router;
