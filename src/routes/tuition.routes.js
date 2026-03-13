import express from "express";
import {
  createTuition,
  getTuitionsByUser,
  getTuitionDetails,
  getAllTuitions,
} from "../controllers/tuition.controller.js";
import verifyFirebaseToken from "../middleware/verifyFirebaseToken.js";

const router = express.Router();

router.post("/create-tuition", verifyFirebaseToken, createTuition);
router.get("/get-user-tuitions", verifyFirebaseToken, getTuitionsByUser);
router.get("/tuition-details/:id", getTuitionDetails);
router.get("/all-tuitions", getAllTuitions);

export default router;
