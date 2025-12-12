import { useEffect, useState } from 'react';
import { Pencil, Plus, Search, Trash2 } from 'lucide-react';
import AddUserModal from '../components/Modals/AddUserModal';
import DeleteConfirmModal from '../components/Modals/DeleteConfirmModal';
import toast from 'react-hot-toast';
import EditUserModal from "../components/Modals/EditUserMOdal";

interface User {
  id: string;
  first_name: string;
  last_name: string | null;
  email: string;
  phone: string;
  initials: string;
  role: {
    id: string;
    title: string;
    slug: string;
  } | null;
  status: number;
}

export default function Users() {
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Delete modal controls
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  // Fetch users
  const fetchUsers = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    const companyId = localStorage.getItem('companyId');

    try {
      const res = await fetch('http://13.210.33.250/api/user', {
        headers: {
          Authorization: `Bearer ${token}`,
          company_id: companyId || '4',
          Accept: 'application/json',
        },
      });

      const data = await res.json();

      if (res.ok) {
        setUsers(data.data || []);
      } else {
        toast.error(data.message || 'Failed to load users');
      }
    } catch (err) {
      toast.error('Server unreachable');
    }

    setLoading(false);
  };

  const handleStatusChange = async (id: string, currentStatus: number) => {
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append("id", id);
      formData.append("status", String(currentStatus === 1 ? 0 : 1));

      const res = await fetch("http://13.210.33.250/api/users/change-status", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();

      if (data.status) {
        toast.success("Status updated");
        fetchUsers();
      } else {
        toast.error("Failed to update status");
      }
    } catch {
      toast.error("Something went wrong");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Filters
  const filteredUsers = users.filter(u => {
    const matchSearch =
      u.first_name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase());

    const matchStatus =
      statusFilter === ''
        ? true
        : statusFilter === 'active'
          ? u.status === 1
          : u.status === 0;

    return matchSearch && matchStatus;
  });

  // OPEN DELETE MODAL
  const handleOpenDelete = (userId: string) => {
    setSelectedUserId(userId);
    setDeleteModalOpen(true);
  };

  // CONFIRM DELETE
  const handleDeleteConfirm = async () => {
    if (!selectedUserId) return;

    try {
      const token = localStorage.getItem("token");

      const formData = new FormData();
      formData.append("id", selectedUserId);
    const companyId = localStorage.getItem('companyId');

     
    const res = await fetch(`http://13.210.33.250/api/user/${selectedUserId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        company_id: companyId || "4",
        Accept: "application/json",
      },
    });

      const data = await res.json();

      if (data.status) {
        toast.success("User deleted successfully");
        setDeleteModalOpen(false);
        fetchUsers();
      } else {
        toast.error(data.message || "Failed to delete user");
      }
    } catch (error) {
      toast.error("Server error");
    }
  };


  const handleEdit = async (id: string) => {
  try {
    const token = localStorage.getItem("token");
    const companyId = localStorage.getItem("companyId") || "4";

    const res = await fetch(`http://13.210.33.250/api/user/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        company_id: companyId,
        Accept: "application/json",
      },
    });

    const data = await res.json();

    if (res.ok) {
      setSelectedUser(data.data);   // <-- store fetched user
      setEditOpen(true);            // <-- open modal
    } else {
      toast.error("Failed to fetch user details");
    }

  } catch (error) {
    toast.error("Server error");
  }
};


  return (
    <div className="flex-1">

      {/* SEARCH + FILTER + ADD */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">

          {/* SEARCH */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search by name, email..."
              className="pl-10 pr-4 py-1 w-72 border border-[#E5E5E5] rounded-lg bg-[#F4F4F4] focus:outline-none"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <Search size={18} className="absolute left-3 top-2 text-black" />
          </div>

          {/* STATUS FILTER */}
          <div className="relative">
            <select
              className="appearance-none px-4 pr-10 py-1 border bg-[#F4F4F4] rounded-lg text-[#6B6B6B]"
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
            >
              <option value="">Select Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>

            <svg
              className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-black"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {/* ADD USER */}
        <button
          className="px-4 py-2 flex items-center gap-2 rounded-lg bg-[#8570FF] text-white"
          onClick={() => setAddOpen(true)}
        >
          <Plus size={18} /> Add New User
        </button>
      </div>

      {/* USER TABLE */}
      <div className="bg-[#D9D9D9] p-[10px] rounded-lg shadow overflow-hidden">
        {loading ? (
          <p className="text-center py-6">Loading users...</p>
        ) : filteredUsers.length === 0 ? (
          <p className="text-center py-6 text-gray-500">No users found</p>
        ) : (
          <>

            <div className="bg-[#D9D9D9] rounded-lg">

              {/* HEADER */}
              <table className="w-full border-collapse">
                <thead className="bg-[#504A6E] text-white text-[14px]">
                  <tr>
                    <th className="px-3 py-3 font-medium rounded-tl-lg w-[80px]">S.L</th>
                    <th className="px-3 py-3 font-medium w-[150px]">Name</th>
                    <th className="px-3 py-3 font-medium w-[220px]">Email</th>
                    <th className="px-3 py-3 font-medium w-[100px]">Initials</th>
                    <th className="px-3 py-3 font-medium w-[150px]">Phone</th>
                    <th className="px-3 py-3 font-medium w-[120px]">Role</th>
                    <th className="px-3 py-3 font-medium w-[120px]">Status</th>
                    <th className="px-3 py-3 font-medium rounded-tr-lg w-[100px]">Action</th>
                  </tr>
                </thead>
              </table>

              {/* BODY */}
              <div className="mt-2 flex flex-col gap-3">
                {filteredUsers.map((u, i) => (
                  <table
                    key={u.id}
                    className="bg-white rounded-lg shadow p-3 hover:bg-gray-50 transition w-full"
                  >
                    <tr>
                      <td className="text-center px-3 py-2 w-[80px]">{i + 1}</td>

                      <td className="text-center px-3 py-2 w-[150px] break-all">
                        {u.first_name} {u.last_name}
                      </td>

                      <td className="px-3 py-2 text-center w-[220px] break-all">
                        {u.email}
                      </td>

                      <td className="px-3 py-2 text-center w-[100px] break-all">
                        {u.initials}
                      </td>

                      <td className="px-3 py-2 text-center w-[150px] break-all">
                        {u.phone}
                      </td>

                      <td className="px-3 py-2 text-center w-[120px] break-all">
                        {u.role?.title || '-'}
                      </td>

                      <td className="px-4 py-3">
                        <label className="switch">
                          <input
                            type="checkbox"
                            checked={u.status === 1}
                            onChange={() => handleStatusChange(u.id, u.status)}
                          />
                          <span className="slider"></span>
                        </label>
                      </td>

                      <td className="px-3 py-2 text-center w-[100px]">
                        <div className="flex gap-3">
                         <Pencil
  size={18}
  className="text-[#3B69FF] cursor-pointer"
  onClick={() => handleEdit(u.id)}
/>

                          <Trash2
                            size={18}
                            className="text-[#FF1717] cursor-pointer"
                            onClick={() => handleOpenDelete(u.id)}
                          />
                        </div>
                      </td>
                    </tr>
                  </table>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* MODALS */}
      <AddUserModal open={addOpen} onClose={() => setAddOpen(false)} />
      <EditUserModal open={editOpen} onClose={() => setEditOpen(false)} user={selectedUser} />

      <DeleteConfirmModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
      />

    </div>
  );
}
