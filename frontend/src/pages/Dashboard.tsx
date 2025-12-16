import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../api/api";
import Button from "../components/Button";
import Skeleton from "../components/Skeleton";
import TaskCard, { Task } from "../components/TaskCard";
import Modal from "../components/Modal";
import TaskForm, { TaskFormValues } from "../components/TaskForm";
import NotificationPanel from "../components/NotificationPanel";
import Profile from "./Profile";

type User = { id: string; name: string; email: string };

export default function Dashboard({ user, socket, onLogout }: { user: User; socket: any; onLogout: () => void }) {
  const qc = useQueryClient();

  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [sort, setSort] = useState("dueDateAsc");

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Task | null>(null);

  const { data: users } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const r = await api.get("/api/users");
      return r.data.users as { _id: string; name: string; email: string }[];
    }
  });

  const { data: tasks, isLoading } = useQuery({
    queryKey: ["tasks", status, priority, sort],
    queryFn: async () => {
      const r = await api.get("/api/tasks", { params: { status, priority, sort } });
      return r.data.tasks as Task[];
    }
  });

  useEffect(() => {
    socket.on("tasks:changed", () => qc.invalidateQueries({ queryKey: ["tasks"] }));
    socket.on("notifications:new", () => qc.invalidateQueries({ queryKey: ["notifications"] }));
    return () => {
      socket.off("tasks:changed");
      socket.off("notifications:new");
    };
  }, [socket, qc]);

  const list = tasks || [];
  const now = useMemo(() => new Date(), []);
  const assignedToMe = list.filter(t => t.assignedToId?._id === user.id);
  const createdByMe = list.filter(t => t.creatorId?._id === user.id);
  const overdue = list.filter(t => new Date(t.dueDate) < now && t.status !== "Completed");

  const logout = async () => {
    await api.post("/api/auth/logout");
    onLogout();
  };

  const createMutation = useMutation({
    mutationFn: async (v: TaskFormValues) => {
      const r = await api.post("/api/tasks", v);
      return r.data.task as Task;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["tasks"] });
      setModalOpen(false);
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, v }: { id: string; v: TaskFormValues }) => {
      const r = await api.put(`/api/tasks/${id}`, v);
      return r.data.task as Task;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["tasks"] });
      setModalOpen(false);
      setEditing(null);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/api/tasks/${id}`);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["tasks"] })
  });

  const openCreate = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const openEdit = (t: Task) => {
    setEditing(t);
    setModalOpen(true);
  };

  const submit = (v: TaskFormValues) => {
    if (editing) updateMutation.mutate({ id: editing._id, v });
    else createMutation.mutate(v);
  };

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-6xl px-4 py-6">
        <header className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-white/10 border border-white/10 grid place-items-center shadow-xl">
              <span className="text-lg">⬢</span>
            </div>
            <div>
              <div className="text-lg font-semibold tracking-wide">Neon Ops</div>
              <div className="text-xs text-white/60">Welcome, {user.name}</div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" onClick={openCreate}>+ New Task</Button>
            <Button variant="ghost" onClick={logout}>Logout</Button>
          </div>
        </header>

        <div className="mt-5 grid grid-cols-1 lg:grid-cols-3 gap-3">
          <Stat title="Assigned to me" value={assignedToMe.length} />
          <Stat title="Created by me" value={createdByMe.length} />
          <Stat title="Overdue" value={overdue.length} />
        </div>

        <div className="mt-5 grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-3">
          <div className="rounded-3xl bg-white/5 border border-white/10 p-4 backdrop-blur-xl">
            <div className="flex flex-wrap gap-2 items-center justify-between">
              <div className="font-semibold">Tasks</div>
              <div className="flex flex-wrap gap-2">
                <select className="rounded-xl bg-black/30 border border-white/10 px-3 py-2"
                  value={status} onChange={e => setStatus(e.target.value)}>
                  <option value="">All Status</option>
                  <option>To Do</option><option>In Progress</option><option>Review</option><option>Completed</option>
                </select>

                <select className="rounded-xl bg-black/30 border border-white/10 px-3 py-2"
                  value={priority} onChange={e => setPriority(e.target.value)}>
                  <option value="">All Priority</option>
                  <option>Low</option><option>Medium</option><option>High</option><option>Urgent</option>
                </select>

                <select className="rounded-xl bg-black/30 border border-white/10 px-3 py-2"
                  value={sort} onChange={e => setSort(e.target.value)}>
                  <option value="dueDateAsc">Due Date ↑</option>
                  <option value="dueDateDesc">Due Date ↓</option>
                </select>
              </div>
            </div>

            <div className="mt-4 space-y-3">
              {isLoading && (<><Skeleton /><Skeleton /><Skeleton /></>)}
              {!isLoading && list.map(t => (
                <TaskCard
                  key={t._id}
                  task={t}
                  onEdit={() => openEdit(t)}
                  onDelete={() => deleteMutation.mutate(t._id)}
                />
              ))}
              {!isLoading && list.length === 0 && (
                <div className="text-sm text-white/60">No tasks yet. Create your first one.</div>
              )}
            </div>
          </div>

          <div className="space-y-3">
            <NotificationPanel />
            <Profile />
          </div>
        </div>

        <Modal
          open={modalOpen}
          title={editing ? "Edit Task" : "Create Task"}
          onClose={() => { setModalOpen(false); setEditing(null); }}
        >
          <TaskForm
            users={users || []}
            initial={editing}
            onSubmit={submit}
            submitting={createMutation.isPending || updateMutation.isPending}
          />
        </Modal>
      </div>
    </div>
  );
}

function Stat({ title, value }: { title: string; value: number }) {
  return (
    <div className="rounded-3xl bg-white/5 border border-white/10 p-4">
      <div className="text-xs text-white/60">{title}</div>
      <div className="text-2xl font-semibold">{value}</div>
    </div>
  );
}
