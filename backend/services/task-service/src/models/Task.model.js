import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    priority: {
      type: String,
      enum: ["low", "medium", "high", "urgent"],
      default: "medium",
      index: true,    // for filtering
    },

    dueDate: {
      type: Date,      // very important for sorting, filtering, comparisons
      required: false,
      index: true,
    },

    status: {
      type: String,
      enum: ["todo", "in-progress", "done"],
      default: "todo",
      index: true,
    },

    // future-proof field
    // even though assignment is single-user, this helps scalability
    userId: {
      type: String,
      required: false,
    },

    rawTranscript: {
      type: String,
      required: false,
    },

    parsedData: {
      type: Object,
      required: false,
    }
  },
  {
    timestamps: true,
  }
);

// Useful compound index for board view and for query optmization
TaskSchema.index({ status: 1, priority: 1 });

export default mongoose.model("Task", TaskSchema, "tasks");
