import { X, AlertCircle } from "lucide-react";

export default function DeleteConfirmModal({ open, onClose, onConfirm }: any) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-8 w-[400px] shadow-lg text-center relative">

        {/* Close button */}
        <button className="absolute top-3 right-3 cursor-pointer" onClick={onClose}>
          <X className="text-gray-600 hover:text-black" />
        </button>

        {/* Warning Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <AlertCircle className="text-red-600" size={40} />
          </div>
        </div>

        <h2 className="text-lg font-semibold mb-3">
          Are you sure want to delete?
        </h2>

        <div className="flex justify-between mt-6 gap-4">
          <button
            className="w-1/2 py-2 border border-red-400 text-red-500 rounded-full hover:bg-red-50 cursor-pointer"
            onClick={onClose}
          >
            No, Cancel
          </button>

          <button
            className="w-1/2 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 cursor-pointer"
            onClick={onConfirm}
          >
            Yes, Delete
          </button>
        </div>
      </div>
    </div>
  );
}
