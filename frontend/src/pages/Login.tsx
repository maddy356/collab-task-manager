import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "../api/api";
import Field from "../components/Field";
import Button from "../components/Button";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});
type Form = z.infer<typeof schema>;

export default function Login({ onAuthed, goRegister }: {
  onAuthed: () => void;
  goRegister: () => void;
}) {
  const [err, setErr] = useState("");
  const { register, handleSubmit, formState: { isSubmitting } } = useForm<Form>({
    resolver: zodResolver(schema)
  });

  const submit = async (data: Form) => {
    setErr("");
    try {
      await api.post("/api/auth/login", data);
      onAuthed();
    } catch (e: any) {
      setErr(e?.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen grid place-items-center px-4">
      <div className="w-full max-w-md rounded-3xl bg-white/5 border border-white/10 p-6 backdrop-blur-xl shadow-2xl">
        <div className="text-2xl font-semibold">Neon Task Manager</div>
        <div className="text-sm text-white/60 mt-1">Login to collaborate in real time.</div>

        <form className="mt-6 space-y-3" onSubmit={handleSubmit(submit)}>
          <Field label="Email">
            <input className="w-full rounded-2xl bg-black/30 border border-white/10 px-4 py-3 outline-none focus:border-white/30"
              placeholder="you@example.com" {...register("email")} />
          </Field>

          <Field label="Password">
            <input className="w-full rounded-2xl bg-black/30 border border-white/10 px-4 py-3 outline-none focus:border-white/30"
              placeholder="••••••••" type="password" {...register("password")} />
          </Field>

          {err && <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm">{err}</div>}

          <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Signing in..." : "Sign in"}</Button>

          <button type="button" onClick={goRegister} className="w-full mt-2 rounded-2xl bg-white/5 border border-white/10 px-4 py-3 text-sm hover:bg-white/10 transition">
            Create an account
          </button>
        </form>
      </div>
    </div>
  );
}
