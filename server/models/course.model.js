import mongoose from "mongoose";

const CourseSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: "Name is required",
  },
  description: {
    type: String,
    trim: true,
  },
  image: {
    type: Buffer,
    contentType: String,
  },
  category: {
    type: String,
    required: "Category is required",
  },
  published: {
    type: Boolean,
    default: false,
  },
  instructor: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
  created: {
    type: Date,
    default: Date.now,
  },
  updated: Date,
});

export default mongoose.model("Course", CourseSchema);
