import express from "express";
import {
  createCheckoutSession,
  getTutorRevenueHistory,
  getUserPaymentHistory,
  paymentSuccess,
} from "../controllers/payment.controller.js";
import verifyTutor from "../middleware/verifyTutor.js";
import verifyFirebaseToken from "../middleware/verifyFirebaseToken.js";
const router = express.Router();

router.post("/create-checkout-session", createCheckoutSession);
router.patch("/payment-success", paymentSuccess);
router.get("/user-payment-history", getUserPaymentHistory);
router.get(
  "/tutor-revenue-history",
  verifyFirebaseToken,
  verifyTutor,
  getTutorRevenueHistory,
);

export default router;
