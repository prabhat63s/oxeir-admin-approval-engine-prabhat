import React from "react";

export default function ConfirmModal({ open, onClose, onConfirm, title, btnName, message }) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-md w-[90%] max-w-md p-6">
                <h2 className="text-lg font-bold mb-2">{title}</h2>
                {message && <p className="text-sm text-gray-600 mb-4">{message}</p>}
                <div className="flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-1 text-sm text-gray-500 hover:underline"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                    >
                        {btnName}
                    </button>
                </div>
            </div>
        </div>
    );
}
