import express from "express";
import {
  createCheckoutSession,
  getTutorRevenueHistory,
  getUserPaymentHistory,
  paymentSuccess,
} from "../controllers/payment.controller.js";
import verifyTutor from "../middleware/verifyTutor.js";
import verifyFirebaseToken from "../middleware/verifyFirebaseToken.js";
import verifyStudent from "../middleware/verifyStudent.js";
const router = express.Router();

router.post(
  "/create-checkout-session",
  verifyFirebaseToken,
  createCheckoutSession,
);
router.patch("/payment-success", verifyFirebaseToken, paymentSuccess);
router.get(
  "/user-payment-history",
  verifyFirebaseToken,
  verifyStudent,
  getUserPaymentHistory,
);
router.get(
  "/tutor-revenue-history",
  verifyFirebaseToken,
  verifyTutor,
  getTutorRevenueHistory,
);

export default router;
