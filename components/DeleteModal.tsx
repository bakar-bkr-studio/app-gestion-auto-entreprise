'use client';
import { ReactNode } from 'react';

interface DeleteModalProps {
  isOpen: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  children?: ReactNode;
}

export default function DeleteModal({ isOpen, onCancel, onConfirm, children }: DeleteModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center bg-black/50">
      <div className="w-80 rounded bg-white p-6 shadow-lg dark:bg-gray-800">
        <p className="mb-4 text-center text-sm text-gray-700 dark:text-gray-100">
          {children}
        </p>
        <div className="flex justify-end space-x-2">
          <button
            onClick={onCancel}
            className="rounded border border-gray-300 px-3 py-1 text-sm hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700"
          >
            Annuler
          </button>
          <button
            onClick={onConfirm}
            className="rounded bg-red-500 px-3 py-1 text-sm text-white hover:bg-red-600"
          >
            Confirmer la suppression
          </button>
        </div>
      </div>
    </div>
  );
}
