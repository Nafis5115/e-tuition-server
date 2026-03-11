import express from "express";
import {
  createTuition,
  getTuitionByUser,
} from "../controllers/tuition.controller.js";

const router = express.Router();

router.post("/create-tuition", createTuition);
router.get("/get-user-tuitions", getTuitionByUser);

export default router;
