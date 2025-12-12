import {
  Dialog,
  DialogContent,
  IconButton,
  Checkbox,
  FormControlLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { X, Camera, Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import axios from 'axios';

export default function EditUserMOdal({ open, onClose, user }: any) {
    console.log(user,"user in edit modal")
  const [preview, setPreview] = useState(user?.img || '');
  const [roles, setRoles] = useState<{ id: string; title: string }[]>([]);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    title: user?.title || '',
    initials: user?.initials || '',
    role: user || '',
    designation: {
      designer: false,
      projectManager: true,
      productionManager: true,
      salesRep: false,
    },
  });

  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem('token');
  const companyId = localStorage.getItem('companyId') || '4';

  // Fetch roles from API
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev, // keep designation here

        name: `${user.first_name} ${user.last_name || ''}`.trim(),
        email: user.email || '',
        phone: user.phone || '',
        initials: user.initials || '',
        role: user.role?.id || '',
        title: user.role?.title || '',

        // If API contains designation: merge it, else keep old
        designation: {
          designer: user.designation?.designer ?? prev.designation.designer,
          projectManager:
            user.designation?.projectManager ?? prev.designation.projectManager,
          productionManager:
            user.designation?.productionManager ??
            prev.designation.productionManager,
          salesRep: user.designation?.salesRep ?? prev.designation.salesRep,
        },
      }));

      setPreview(user.profile_image_url || '');
    }
  }, [user]);

  // Fetch roles from API
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await axios.get(
          'http://13.210.33.250/api/user/dropdown-responsibility',
          {
            headers: {
              Authorization: `Bearer ${token}`,
              company_id: companyId,
            },
          }
        );

        if (response.data && Array.isArray(response.data)) {
          setRoles(response.data);

          // auto-select first role if none assigned
          if (!formData.role && response.data.length > 0) {
            setFormData(prev => ({ ...prev, role: response.data[0].id }));
          }
        }
      } catch (err) {
        console.error(err);
        toast.error('Failed to fetch roles');
      }
    };

    if (open) fetchRoles();
  }, [open]);

  // ROLE CHANGE HANDLER → triggers API call immediately
  const handleRoleSelect = async (roleId: string) => {
    try {
      setFormData(prev => ({ ...prev, role: roleId }));

      // Immediately call API when role selected
      await axios.post(
        'http://13.210.33.250/api/role/dropdown',
        { role_id: roleId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            company_id: companyId,
          },
        }
      );
    } catch (error: any) {
      console.error(error);
      toast.error('Failed to update role selection');
    }
  };

  const handleImageChange = (e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreview(url);
  };

  const handleDeleteImage = () => setPreview('');

  const handleInputChange = (key: string, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleDesignationChange = (key: string, value: boolean) => {
    setFormData(prev => ({
      ...prev,
      designation: { ...prev.designation, [key]: value },
    }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);

      const payload = {
        ...formData,
        img: preview || '',
      };
      console.log(payload,"payl;oad")

      await axios.patch(`http://13.210.33.250/api/user/${user?.id}`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          company_id: companyId,
        },
      });

      toast.success('User updated successfully!');
      onClose();
    } catch (error: any) {
      console.error(error);
      if (error.response?.status === 401) {
        toast.error('Unauthenticated. Please log in again.');
      } else if (error.response?.data?.errors?.role) {
        toast.error(error.response.data.errors.role[0]);
      } else {
        toast.error('Failed to update user.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          borderRadius: '12px',
          maxHeight: '90vh',
          p: 2,
        },
      }}
    >
      <div className="relative">
        <IconButton
          onClick={onClose}
          sx={{ position: 'absolute', top: 10, right: 10 }}
          size="small"
        >
          <X size={20} />
        </IconButton>

        <h2 className="text-xl font-semibold text-center mb-4">Edit User</h2>

        {/* Profile Image Upload */}
        <div className="flex justify-center mb-4">
          <div className="relative w-20 h-20 flex items-center justify-center group">
            <div className="w-full h-full rounded-full border border-gray-300 overflow-hidden shadow-sm bg-gray-100 flex items-center justify-center transition-colors duration-200 group-hover:bg-[#FFFFFF80]">
              {preview ? (
                <img
                  src={preview}
                  className="w-full h-full object-cover transition-opacity duration-200 group-hover:opacity-[25%]"
                />
              ) : (
                <div className="text-xs text-gray-400">No Image</div>
              )}
            </div>

            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />

            <div className="absolute bottom-7 right-7 bg-[#FFFFFF] rounded-full p-1 shadow opacity-0 group-hover:opacity-100 transition-all duration-200">
              <Camera size={16} className="text-[#8570FF]" />
            </div>

            {preview && (
              <div
                onClick={handleDeleteImage}
                className="absolute bottom-0 right-2 bg-[#FFFFFF] rounded-full p-1 shadow cursor-pointer opacity-0 group-hover:opacity-100 transition-all duration-200"
              >
                <Trash2 size={16} className="text-red-500" />
              </div>
            )}
          </div>
        </div>

        <DialogContent sx={{ p: 0 }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 text-sm font-medium">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={e => handleInputChange('name', e.target.value)}
                className="w-full border border-gray-300 rounded-md px-2 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={e => handleInputChange('email', e.target.value)}
                className="w-full border border-gray-300 rounded-md px-2 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium">
                Phone Number
              </label>
              <input
                type="text"
                value={formData.phone}
                onChange={e => handleInputChange('phone', e.target.value)}
                className="w-full border border-gray-300 rounded-md px-2 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium">Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={e => handleInputChange('title', e.target.value)}
                className="w-full border border-gray-300 rounded-md px-2 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium">Initials</label>
              <input
                type="text"
                value={formData.initials}
                onChange={e => handleInputChange('initials', e.target.value)}
                className="w-full border border-gray-300 rounded-md px-2 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium">Role*</label>
              <Select
                fullWidth
                value={formData.role}
                onChange={e => handleRoleSelect(e.target.value)}
                size="small"
                sx={{ fontSize: 14 }}
              >
                {roles.map(role => (
                  <MenuItem key={role.id} value={role.id}>
                    {role.title}
                  </MenuItem>
                ))}
              </Select>
            </div>
          </div>

          <div className="mt-4">
            <p className="font-medium text-sm mb-2">Designation</p>

            <div className="flex flex-wrap gap-4">
              <FormControlLabel
                control={
                  <Checkbox
                    size="small"
                    checked={formData.designation.designer}
                    onChange={e =>
                      handleDesignationChange('designer', e.target.checked)
                    }
                  />
                }
                label={<span className="text-[12px]">Designer</span>}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    size="small"
                    checked={formData.designation.projectManager}
                    onChange={e =>
                      handleDesignationChange(
                        'projectManager',
                        e.target.checked
                      )
                    }
                  />
                }
                label={<span className="text-[12px]">Project Manager</span>}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    size="small"
                    checked={formData.designation.productionManager}
                    onChange={e =>
                      handleDesignationChange(
                        'productionManager',
                        e.target.checked
                      )
                    }
                  />
                }
                label={<span className="text-[12px]">Production Manager</span>}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    size="small"
                    checked={formData.designation.salesRep}
                    onChange={e =>
                      handleDesignationChange('salesRep', e.target.checked)
                    }
                  />
                }
                label={<span className="text-[12px]">Sales Rep</span>}
              />
            </div>
          </div>
        </DialogContent>

        <button
          onClick={handleSave}
          disabled={loading}
          className="w-full mt-5 py-3 bg-[#8B3DFF] text-white rounded-md text-sm font-semibold shadow-sm"
        >
          {loading ? 'Saving...' : 'Save'}
        </button>
      </div>
    </Dialog>
  );
}
