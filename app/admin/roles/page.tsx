'use client';
import { useState } from 'react';
import { Shield, UserPlus, Eye, EyeOff, Crown, Settings, User } from 'lucide-react';
import api from '@/lib/api';
import { useAppSelector } from '@/hooks/redux';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

const ROLE_DEFINITIONS = [
  {
    role: 'super_admin',
    label: 'Super Admin',
    icon: Crown,
    color: 'bg-red-50 border-red-200',
    iconColor: 'text-red-600 bg-red-100',
    badgeColor: 'bg-red-100 text-red-700',
    permissions: [
      'Full system access',
      'Create Admin & Moderator accounts',
      'Manage user roles',
      'Delete any user',
      'Access all features',
    ],
  },
  {
    role: 'admin',
    label: 'Admin',
    icon: Settings,
    color: 'bg-blue-50 border-blue-200',
    iconColor: 'text-blue-600 bg-blue-100',
    badgeColor: 'bg-blue-100 text-blue-700',
    permissions: [
      'Manage all products (CRUD)',
      'Manage & update orders',
      'View and manage users',
      'Access admin dashboard',
      'View reports & stats',
    ],
  },
  {
    role: 'moderator',
    label: 'Moderator',
    icon: Shield,
    color: 'bg-purple-50 border-purple-200',
    iconColor: 'text-purple-600 bg-purple-100',
    badgeColor: 'bg-purple-100 text-purple-700',
    permissions: [
      'View & moderate products',
      'Edit product details',
      'View dashboard stats',
      'Cannot manage orders',
      'Cannot manage users',
    ],
  },
  {
    role: 'user',
    label: 'User',
    icon: User,
    color: 'bg-gray-50 border-gray-200',
    iconColor: 'text-gray-600 bg-gray-100',
    badgeColor: 'bg-gray-100 text-gray-700',
    permissions: [
      'Browse all products',
      'Add to cart & wishlist',
      'Checkout & payment',
      'View own orders',
      'Write product reviews',
    ],
  },
];

export default function AdminRolesPage() {
  const currentUser = useAppSelector(s => s.auth.user);
  const router = useRouter();
  const isSuperAdmin = currentUser?.role === 'super_admin';

  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'admin' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isSuperAdmin) {
    return (
      <div className="text-center py-20">
        <Shield className="w-16 h-16 text-gray-200 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-gray-900 mb-2">Access Restricted</h2>
        <p className="text-gray-500">Only Super Admins can manage roles.</p>
      </div>
    );
  }

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email format';
    if (!form.password) e.password = 'Password is required';
    else if (form.password.length < 6) e.password = 'Minimum 6 characters';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const { data } = await api.post('/admin/users/create-staff', form);
      toast.success(`${form.role === 'admin' ? 'Admin' : 'Moderator'} account created!`);
      setForm({ name: '', email: '', password: '', role: 'admin' });
      setErrors({});
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-black text-gray-900">Role Management</h2>
        <p className="text-gray-500 text-sm mt-1">Manage roles and create staff accounts</p>
      </div>

      {/* Role Definitions */}
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-4">Role Permissions Overview</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {ROLE_DEFINITIONS.map(({ role, label, icon: Icon, color, iconColor, badgeColor, permissions }) => (
            <div key={role} className={`card p-5 border ${color}`}>
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconColor}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">{label}</h4>
                  <span className={`badge text-xs ${badgeColor} capitalize`}>{role.replace('_', ' ')}</span>
                </div>
              </div>
              <ul className="space-y-2">
                {permissions.map((p, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                    <span className="text-green-500 mt-0.5 flex-shrink-0">✓</span>
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Create Staff Account */}
      <div className="card p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
            <UserPlus className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900">Create Staff Account</h3>
            <p className="text-sm text-gray-500">Only Super Admins can create Admin/Moderator accounts</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Full Name *</label>
              <input
                value={form.name}
                onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                placeholder="Staff member name"
                className={`input-field ${errors.name ? 'ring-2 ring-red-400' : ''}`}
              />
              {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Role *</label>
              <select
                value={form.role}
                onChange={e => setForm(p => ({ ...p, role: e.target.value }))}
                className="input-field"
              >
                <option value="admin">Admin</option>
                <option value="moderator">Moderator</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Email Address *</label>
            <input
              type="email"
              value={form.email}
              onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
              placeholder="staff@example.com"
              className={`input-field ${errors.email ? 'ring-2 ring-red-400' : ''}`}
            />
            {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Password *</label>
            <div className="relative">
              <input
                type={showPass ? 'text' : 'password'}
                value={form.password}
                onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                placeholder="Minimum 6 characters"
                className={`input-field pr-10 ${errors.password ? 'ring-2 ring-red-400' : ''}`}
              />
              <button type="button" onClick={() => setShowPass(!showPass)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
          </div>

          <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
            <p className="text-sm text-amber-800 font-medium">⚠️ Important</p>
            <p className="text-xs text-amber-700 mt-1">
              Share credentials securely with the staff member. They should change their password after first login.
            </p>
          </div>

          <button type="submit" disabled={loading}
            className="btn-primary flex items-center justify-center gap-2">
            {loading
              ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Creating...</>
              : <><UserPlus className="w-4 h-4" /> Create {form.role === 'admin' ? 'Admin' : 'Moderator'} Account</>
            }
          </button>
        </form>
      </div>

      {/* Go to Users */}
      <div className="card p-5 flex items-center justify-between">
        <div>
          <h3 className="font-bold text-gray-900">Manage Existing Users</h3>
          <p className="text-sm text-gray-500">View, deactivate, or delete user accounts</p>
        </div>
        <a href="/admin/users" className="btn-outline text-sm">
          Go to Users →
        </a>
      </div>
    </div>
  );
}
