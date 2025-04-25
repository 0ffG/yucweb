"use client";

import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

export function Toaster() {
  const { toasts, dismiss } = useToast();

  useEffect(() => {
    const timers = toasts.map((toast) => {
      if (toast.open) {
        return setTimeout(() => dismiss(toast.id), 3000); // Auto-dismiss after 3 seconds
      }
      return null;
    });

    return () => {
      timers.forEach((timer) => {
        if (timer) clearTimeout(timer);
      });
    };
  }, [toasts, dismiss]);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) =>
        toast.open ? (
          <div
            key={toast.id}
            className={`p-4 rounded shadow-md min-w-[250px] text-white ${
              toast.type === 'error' ? 'bg-red-500' : 'bg-green-500'
            }`}
          >
            <div className="font-bold">{toast.title}</div>
            {toast.description && (
              <div className="text-sm mt-1">{toast.description}</div>
            )}
          </div>
        ) : null
      )}
    </div>
  );
}
