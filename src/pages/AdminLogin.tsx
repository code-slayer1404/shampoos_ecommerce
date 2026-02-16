import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiLock, FiEye, FiEyeOff, FiShield } from '../utils/icons';

const AUTH_TOKEN_KEY = 'purelocks_token';

const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const [showToken, setShowToken] = useState(false);
  const [error, setError] = useState('');
  const [token, setToken] = useState(localStorage.getItem(AUTH_TOKEN_KEY) || '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    if (!token.trim()) {
      setError('JWT token is required to access admin endpoints.');
      return;
    }

    localStorage.setItem(AUTH_TOKEN_KEY, token.trim());
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
            <h1 className="text-3xl font-bold">Admin Access</h1>
            <p className="text-gray-600 mt-2">Use your admin JWT to manage products.</p>
          </div>

          <div className="mb-6 rounded-xl border border-dashed border-primary-200 bg-primary-50/50 p-4 text-sm text-gray-700">
            <p className="font-semibold text-primary-700">How it works</p>
            <p>This page stores your JWT in localStorage under <code>purelocks_token</code>.</p>
            <p>Requests to <code>/api/v1/products</code> are sent with <code>Authorization: Bearer &lt;token&gt;</code>.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-2">Admin JWT</label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showToken ? 'text' : 'password'}
                  required
                  className="input-field pl-10 pr-10"
                  value={token}
                  onChange={(e) => {
                    setToken(e.target.value);
                    if (error) {
                      setError('');
                    }
                  }}
                  placeholder="Paste admin JWT"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  onClick={() => setShowToken((prev) => !prev)}
                >
                  {showToken ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>

            {error && <p className="rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}

            <button type="submit" className="btn-primary w-full">
              Continue to Admin Panel
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
