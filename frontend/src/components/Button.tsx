import React from "react";

export default function Button({
  children, onClick, type="button", disabled, variant="primary"
}: {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
  variant?: "primary" | "ghost" | "danger";
}) {
  const base =
    "rounded-2xl px-4 py-3 font-semibold transition disabled:opacity-50";
  const styles =
    variant === "primary"
      ? "bg-white/10 border border-white/20 hover:bg-white/15"
      : variant === "danger"
      ? "bg-red-500/10 border border-red-500/20 hover:bg-red-500/15"
      : "bg-white/5 border border-white/10 hover:bg-white/10";
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={`${base} ${styles}`}>
      {children}
    </button>
  );
}
