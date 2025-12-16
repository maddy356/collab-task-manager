import { useEffect, useMemo, useState } from "react";
import { api } from "./api/api";
import { io } from "socket.io-client";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";

export type User = { id: string; name: string; email: string };

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [mode, setMode] = useState<"login" | "register">("login");

  const socket = useMemo(() => io(import.meta.env.VITE_API_URL || "http://localhost:4000", { withCredentials: true }), []);

  const fetchMe = async () => {
    const r = await api.get("/api/users/me");
    setUser(r.data.user);
  };

  useEffect(() => {
    fetchMe().catch(() => setUser(null));
  }, []);

  useEffect(() => {
    if (user) socket.emit("join", { userId: user.id });
  }, [user, socket]);

  if (!user) {
    if (mode === "login") {
      return <Login onAuthed={fetchMe} goRegister={() => setMode("register")} />;
    }
    return <Register onAuthed={fetchMe} goLogin={() => setMode("login")} />;
  }

  return <Dashboard user={user} socket={socket} onLogout={() => setUser(null)} />;
}
