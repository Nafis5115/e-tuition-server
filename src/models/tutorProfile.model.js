import mongoose from "mongoose";

const tutorSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    about: {
      type: String,
      required: true,
    },
    experience: {
      type: Number,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    qualifications: {
      type: [String],
      required: true,
    },
    subjects: {
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

const TutorProfile = mongoose.model("TutorProfile", tutorSchema);

export default TutorProfile;
