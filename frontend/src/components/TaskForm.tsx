import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Field from "./Field";
import Button from "./Button";
import { Task } from "./TaskCard";

const PriorityEnum = ["Low", "Medium", "High", "Urgent"] as const;
const StatusEnum = ["To Do", "In Progress", "Review", "Completed"] as const;

const schema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().max(5000).optional().default(""),
  dueDate: z.string().min(1), // we'll convert to ISO
  priority: z.enum(PriorityEnum),
  status: z.enum(StatusEnum),
  assignedToId: z.string().min(1)
});
export type TaskFormValues = z.infer<typeof schema>;

export default function TaskForm({
  users,
  initial,
  onSubmit,
  submitting
}: {
  users: { _id: string; name: string; email: string }[];
  initial?: Task | null;
  onSubmit: (v: TaskFormValues) => void;
  submitting: boolean;
}) {
  const { register, handleSubmit, reset } = useForm<TaskFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
      description: "",
      dueDate: "",
      priority: "Medium",
      status: "To Do",
      assignedToId: ""
    }
  });

  useEffect(() => {
    if (initial) {
      // Convert ISO => datetime-local (best effort)
      const dt = new Date(initial.dueDate);
      const pad = (n: number) => String(n).padStart(2, "0");
      const local = `${dt.getFullYear()}-${pad(dt.getMonth()+1)}-${pad(dt.getDate())}T${pad(dt.getHours())}:${pad(dt.getMinutes())}`;

      reset({
        title: initial.title,
        description: initial.description || "",
        dueDate: local,
        priority: initial.priority,
        status: initial.status,
        assignedToId: initial.assignedToId?._id || ""
      });
    } else {
      reset({
        title: "",
        description: "",
        dueDate: "",
        priority: "Medium",
        status: "To Do",
        assignedToId: users[0]?._id || ""
      });
    }
  }, [initial, reset, users]);

  const submit = (v: TaskFormValues) => {
    // datetime-local => ISO string
    const iso = new Date(v.dueDate).toISOString();
    onSubmit({ ...v, dueDate: iso });
  };

  return (
    <form className="space-y-3" onSubmit={handleSubmit(submit)}>
      <Field label="Title">
        <input className="w-full rounded-2xl bg-black/30 border border-white/10 px-4 py-3 outline-none focus:border-white/30"
          placeholder="e.g., Prepare final report" {...register("title")} />
      </Field>

      <Field label="Description">
        <textarea className="w-full rounded-2xl bg-black/30 border border-white/10 px-4 py-3 outline-none focus:border-white/30 min-h-[90px]"
          placeholder="Add details..." {...register("description")} />
      </Field>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Field label="Due Date">
          <input type="datetime-local"
            className="w-full rounded-2xl bg-black/30 border border-white/10 px-4 py-3 outline-none focus:border-white/30"
            {...register("dueDate")} />
        </Field>

        <Field label="Assignee">
          <select className="w-full rounded-2xl bg-black/30 border border-white/10 px-4 py-3 outline-none focus:border-white/30"
            {...register("assignedToId")}>
            {users.map(u => (
              <option key={u._id} value={u._id}>{u.name} ({u.email})</option>
            ))}
          </select>
        </Field>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Field label="Priority">
          <select className="w-full rounded-2xl bg-black/30 border border-white/10 px-4 py-3 outline-none focus:border-white/30"
            {...register("priority")}>
            {PriorityEnum.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </Field>

        <Field label="Status">
          <select className="w-full rounded-2xl bg-black/30 border border-white/10 px-4 py-3 outline-none focus:border-white/30"
            {...register("status")}>
            {StatusEnum.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </Field>
      </div>

      <Button type="submit" disabled={submitting}>
        {submitting ? "Saving..." : "Save Task"}
      </Button>
    </form>
  );
}
