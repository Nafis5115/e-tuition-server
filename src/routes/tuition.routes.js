import express from "express";
import {
  createTuition,
  getTuitionByUser,
  getTuitionDetails,
} from "../controllers/tuition.controller.js";

const router = express.Router();

router.post("/create-tuition", createTuition);
router.get("/get-user-tuitions", getTuitionByUser);
router.get("/tuition-details/:id", getTuitionDetails);

export default router;
