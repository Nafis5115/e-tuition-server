import express from "express";
import {
  createTuition,
  getTuitionsByUser,
  getTuitionDetails,
  getAllTuitions,
  updateTuition,
  deleteTuition,
} from "../controllers/tuition.controller.js";
import verifyFirebaseToken from "../middleware/verifyFirebaseToken.js";

const router = express.Router();

router.post("/create-tuition", verifyFirebaseToken, createTuition);
router.get("/get-user-tuitions", verifyFirebaseToken, getTuitionsByUser);
router.get("/tuition-details/:id", getTuitionDetails);
router.get("/all-tuitions", getAllTuitions);
router.patch("/update-tuition/:id", verifyFirebaseToken, updateTuition);
router.delete("/delete-tuition/:id", deleteTuition);

export default router;
