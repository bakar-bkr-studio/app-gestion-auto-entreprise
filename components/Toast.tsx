'use client';
import { useEffect } from 'react';

interface ToastProps {
  message: string | null;
  onClose: () => void;
  type?: 'success' | 'error';
  position?: 'top-right' | 'bottom';
}

export default function Toast({ message, onClose, type = 'success', position = 'bottom' }: ToastProps) {
  useEffect(() => {
    if (!message) return;
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div
      className={
        `fixed z-10 rounded px-4 py-2 text-white shadow ` +
        (position === 'top-right'
          ? 'right-4 top-4'
          : 'bottom-4 left-1/2 -translate-x-1/2') +
        ' ' +
        (type === 'error' ? 'bg-red-500' : 'bg-green-500')
      }
    >
      {message}
    </div>
  );
}
