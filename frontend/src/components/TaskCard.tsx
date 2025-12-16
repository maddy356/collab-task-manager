import Button from "./Button";
import { isOverdue } from "../lib/date";

export type Task = {
  _id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: "Low" | "Medium" | "High" | "Urgent";
  status: "To Do" | "In Progress" | "Review" | "Completed";
  creatorId: { _id: string; name: string; email: string };
  assignedToId: { _id: string; name: string; email: string };
};

export default function TaskCard({
  task, onEdit, onDelete
}: {
  task: Task;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const overdue = isOverdue(task.dueDate) && task.status !== "Completed";

  return (
    <div className="rounded-3xl bg-black/20 border border-white/10 p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="font-semibold flex items-center gap-2">
            {task.title}
            {overdue && <span className="text-xs rounded-full px-2 py-0.5 bg-red-500/15 border border-red-500/25">OVERDUE</span>}
          </div>
          <div className="text-xs text-white/60 mt-1">
            Due: {new Date(task.dueDate).toLocaleString()} • Priority: {task.priority} • Status: {task.status}
          </div>
          <div className="text-xs text-white/50 mt-1">
            Assigned: {task.assignedToId?.name} • Creator: {task.creatorId?.name}
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" onClick={onEdit}>Edit</Button>
          <Button variant="danger" onClick={onDelete}>Delete</Button>
        </div>
      </div>
      {task.description && (
        <div className="text-sm text-white/70 mt-3 whitespace-pre-wrap">
          {task.description}
        </div>
      )}
    </div>
  );
}
