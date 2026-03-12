import mongoose from "mongoose";

const tuiTionSchema = new mongoose.Schema(
  {
    userEmail: {
      type: String,
      required: true,
    },
    subject: {
      type: String,
      required: true,
    },
    class: {
      type: String,
      required: true,
    },
    budget: {
      type: Number,
      required: true,
    },
    schedule: {
      type: String,
      required: true,
    },
    medium: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    requirements: {
      type: [String],
      required: true,
    },
    status: {
      type: String,
      default: "pending",
    },
  },
  { timestamps: true },
);

const Tuition = mongoose.model("Tuition", tuiTionSchema);

export default Tuition;
