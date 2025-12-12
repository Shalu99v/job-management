import { X, Camera } from "lucide-react";

export default function AddUserModal({ open, onClose }: any) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-[700px] p-6 relative">

        {/* Header */}
        <button className="absolute top-3 right-3" onClick={onClose}>
          <X className="text-gray-600 hover:text-black" />
        </button>

        <h2 className="text-lg font-semibold mb-4">Add New User</h2>

        {/* Profile Upload */}
        <div className="flex justify-center mb-5">
          <div className="relative w-20 h-20 rounded-full border border-purple-400 flex items-center justify-center">
            <Camera className="text-gray-500" />
            <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" />
          </div>
        </div>

        {/* Form */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm">Name*</label>
            <input className="input" placeholder="Enter your name" />
          </div>

          <div>
            <label className="text-sm">Email*</label>
            <input className="input" placeholder="Enter your email" />
          </div>

          <div>
            <label className="text-sm">Phone Number</label>
            <input className="input" placeholder="Enter phone number" />
          </div>

          <div>
            <label className="text-sm">Title</label>
            <input className="input" placeholder="Enter title" />
          </div>

          <div>
            <label className="text-sm">Initials</label>
            <input className="input" placeholder="Enter initials" />
          </div>

          <div>
            <label className="text-sm">Role*</label>
            <select className="input">
              <option>Select your role</option>
              <option>Admin</option>
              <option>Manager</option>
              <option>Staff</option>
            </select>
          </div>
        </div>

        {/* Designation */}
        <div className="mt-4">
          <label className="text-sm">Designation</label>
          <div className="flex gap-4 mt-1">
            <label><input type="checkbox" /> Designer</label>
            <label><input type="checkbox" /> Project Manager</label>
            <label><input type="checkbox" /> Production Manager</label>
            <label><input type="checkbox" /> Sales Rep</label>
          </div>
        </div>

        {/* Submit Button */}
        <button className="w-full mt-6 py-2 bg-purple-600 text-white rounded-lg">
          Add New User
        </button>
      </div>
    </div>
  );
}
