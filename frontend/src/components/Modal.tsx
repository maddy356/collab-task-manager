import React from "react";

export default function Modal({ open, title, children, onClose }: {
  open: boolean;
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 grid place-items-center px-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative w-full max-w-xl rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-2xl p-5">
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="text-lg font-semibold">{title}</div>
          <button className="rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-sm hover:bg-white/10" onClick={onClose}>
            Close
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
