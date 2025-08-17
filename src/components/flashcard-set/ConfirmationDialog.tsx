import React from "react";

interface ConfirmationDialogProps {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  message: string;
}

export default function ConfirmationDialog({ open, onConfirm, onCancel, message }: ConfirmationDialogProps) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white dark:bg-gray-900 p-6 rounded shadow w-full max-w-sm">
        <div className="mb-4">{message}</div>
        <div className="flex gap-2 justify-end">
          <button className="px-4 py-2 bg-gray-300 rounded" onClick={onCancel}>
            Anuluj
          </button>
          <button className="px-4 py-2 bg-red-600 text-white rounded" onClick={onConfirm}>
            Potwierdź
          </button>
        </div>
      </div>
    </div>
  );
}
