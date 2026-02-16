import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiLock, FiMail, FiEye, FiEyeOff, FiShield } from '../utils/icons';

const ADMIN_EMAIL = 'admin@purelocks.com';
const ADMIN_PASSWORD = 'admin123';
const ADMIN_AUTH_KEY = 'isAdminAuthenticated';

const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (error) {
      setError('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const isValidAdmin =
      formData.email.trim().toLowerCase() === ADMIN_EMAIL &&
      formData.password === ADMIN_PASSWORD;

    if (!isValidAdmin) {
      setError('Invalid admin credentials. Use the demo credentials below.');
      return;
    }

    localStorage.setItem(ADMIN_AUTH_KEY, 'true');
    navigate('/admin');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
      <div className="card w-full max-w-md border border-primary-100">
        <div className="p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary-100 to-secondary-100 mb-4">
              <FiShield className="w-8 h-8 text-primary-600" />
            </div>
            <h1 className="text-3xl font-bold">Admin Login</h1>
            <p className="text-gray-600 mt-2">Sign in to manage your storefront</p>
          </div>

          <div className="mb-6 rounded-xl border border-dashed border-primary-200 bg-primary-50/50 p-4 text-sm text-gray-700">
            <p className="font-semibold text-primary-700">Demo admin credentials</p>
            <p>Email: admin@purelocks.com</p>
            <p>Password: admin123</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-2">Admin Email</label>
              <div className="relative">
                <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  required
                  className="input-field pl-10"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  placeholder="admin@purelocks.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  className="input-field pl-10 pr-10"
                  value={formData.password}
                  onChange={(e) => handleChange('password', e.target.value)}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>

            {error && (
              <p className="rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
            )}

            <button type="submit" className="btn-primary w-full">
              Sign in as Admin
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-gray-600">
            <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">
              Back to customer login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
