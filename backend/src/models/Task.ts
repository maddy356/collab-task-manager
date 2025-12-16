import mongoose from "mongoose";

export const PriorityEnum = ["Low", "Medium", "High", "Urgent"] as const;
export const StatusEnum = ["To Do", "In Progress", "Review", "Completed"] as const;

const TaskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 100 },
    description: { type: String, default: "" },
    dueDate: { type: Date, required: true },

    priority: { type: String, enum: PriorityEnum, required: true },
    status: { type: String, enum: StatusEnum, required: true },

    creatorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    assignedToId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
  },
  { timestamps: true }
);

export type TaskDoc = mongoose.InferSchemaType<typeof TaskSchema> & { _id: mongoose.Types.ObjectId };
export const Task = mongoose.model("Task", TaskSchema);
