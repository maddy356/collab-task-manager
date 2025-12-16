import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../api/api";
import Button from "./Button";

type Notification = {
  _id: string;
  message: string;
  read: boolean;
  createdAt: string;
};

export default function NotificationPanel() {
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const r = await api.get("/api/notifications");
      return r.data.notifications as Notification[];
    }
  });

  const mark = useMutation({
    mutationFn: async (id: string) => {
      await api.post(`/api/notifications/${id}/read`);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["notifications"] })
  });

  const items = data || [];
  const unread = items.filter(n => !n.read).length;

  return (
    <div className="rounded-3xl bg-white/5 border border-white/10 p-4 backdrop-blur-xl">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="font-semibold">Notifications</div>
          <div className="text-xs text-white/60">{unread} unread</div>
        </div>
      </div>

      <div className="mt-3 space-y-2">
        {isLoading && <div className="text-sm text-white/60">Loading...</div>}
        {!isLoading && items.length === 0 && (
          <div className="text-sm text-white/60">No notifications yet.</div>
        )}
        {items.map(n => (
          <div key={n._id} className="rounded-2xl bg-black/20 border border-white/10 p-3">
            <div className="text-sm text-white/85">{n.message}</div>
            <div className="text-xs text-white/50 mt-1">{new Date(n.createdAt).toLocaleString()}</div>
            {!n.read && (
              <div className="mt-2">
                <Button variant="ghost" onClick={() => mark.mutate(n._id)} disabled={mark.isPending}>
                  Mark as read
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
