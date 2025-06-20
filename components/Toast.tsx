'use client';
import { useEffect } from 'react';

interface ToastProps {
  message: string | null;
  onClose: () => void;
}

export default function Toast({ message, onClose }: ToastProps) {
  useEffect(() => {
    if (!message) return;
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div className="fixed bottom-4 left-1/2 z-10 -translate-x-1/2 rounded bg-green-500 px-4 py-2 text-white shadow">
      {message}
    </div>
  );
}
