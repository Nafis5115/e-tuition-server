import mongoose from "mongoose";

const tutorApplicationSchema = new mongoose.Schema(
  {
    tutorEmail: {
      type: String,
      required: true,
    },
    tuitionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tuition",
      required: true,
    },
    status: {
      type: String,
      default: "pending",
    },
  },
  { timestamps: true },
);

const TutorApplication = mongoose.model(
  "tutorApplication",
  tutorApplicationSchema,
);

export default TutorApplication;
