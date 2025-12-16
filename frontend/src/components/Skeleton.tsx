export default function Skeleton({ h = 80 }: { h?: number }) {
  return (
    <div
      className="rounded-3xl bg-white/5 border border-white/10 animate-pulse"
      style={{ height: h }}
    />
  );
}
