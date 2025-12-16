import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../api/api";
import { useForm } from "react-hook-form";
import Field from "../components/Field";
import Button from "../components/Button";

type Me = { id: string; name: string; email: string };

export default function Profile() {
  const qc = useQueryClient();

  const { data } = useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const r = await api.get("/api/users/me");
      return r.data.user as Me;
    }
  });

  const { register, handleSubmit, reset } = useForm<{ name: string }>({
    defaultValues: { name: "" }
  });

  // Populate form when data arrives
  if (data) {
    // Avoid infinite loop: reset only when name differs
    // (simple UI polish)
    setTimeout(() => reset({ name: data.name }), 0);
  }

  const save = useMutation({
    mutationFn: async ({ name }: { name: string }) => {
      const r = await api.put("/api/users/me", { name });
      return r.data.user as Me;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["me"] });
      qc.invalidateQueries({ queryKey: ["users"] });
    }
  });

  return (
    <div className="rounded-3xl bg-white/5 border border-white/10 p-4 backdrop-blur-xl">
      <div className="font-semibold">Profile</div>
      <div className="text-xs text-white/60">Update your display name.</div>

      <form className="mt-3 space-y-3" onSubmit={handleSubmit((v) => save.mutate(v))}>
        <Field label="Name">
          <input className="w-full rounded-2xl bg-black/30 border border-white/10 px-4 py-3 outline-none focus:border-white/30"
            {...register("name")} />
        </Field>
        <Button type="submit" disabled={save.isPending}>
          {save.isPending ? "Saving..." : "Save"}
        </Button>
      </form>
    </div>
  );
}
