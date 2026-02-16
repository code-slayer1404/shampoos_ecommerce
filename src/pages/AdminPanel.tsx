import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiPackage, FiShoppingCart, FiDollarSign, FiUsers, FiLogOut } from '../utils/icons';

const ADMIN_AUTH_KEY = 'isAdminAuthenticated';

const statCards = [
  {
    title: 'Total Orders',
    value: '128',
    detail: '+14 this week',
    icon: FiShoppingCart,
    color: 'from-primary-500 to-primary-600',
  },
  {
    title: 'Active Products',
    value: '42',
    detail: '6 low stock alerts',
    icon: FiPackage,
    color: 'from-secondary-500 to-secondary-600',
  },
  {
    title: 'Revenue',
    value: '$18,640',
    detail: '+12.5% vs last month',
    icon: FiDollarSign,
    color: 'from-emerald-500 to-teal-600',
  },
  {
    title: 'New Customers',
    value: '73',
    detail: '+9 since yesterday',
    icon: FiUsers,
    color: 'from-violet-500 to-purple-600',
  },
];

const recentOrders = [
  { id: 'PL-3021', customer: 'Mia Thompson', total: '$79.99', status: 'Shipped' },
  { id: 'PL-3022', customer: 'David Lee', total: '$34.50', status: 'Processing' },
  { id: 'PL-3023', customer: 'Sarah Miller', total: '$112.20', status: 'Pending' },
  { id: 'PL-3024', customer: 'Noah Patel', total: '$48.00', status: 'Shipped' },
];

const statusClasses: Record<string, string> = {
  Shipped: 'bg-emerald-100 text-emerald-700',
  Processing: 'bg-amber-100 text-amber-700',
  Pending: 'bg-slate-100 text-slate-700',
};

const AdminPanel: React.FC = () => {
  const navigate = useNavigate();

  const handleSignOut = () => {
    localStorage.removeItem(ADMIN_AUTH_KEY);
    navigate('/admin/login');
  };

  return (
    <section className="container mx-auto px-4 py-10 md:py-14">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold">Admin Panel</h1>
          <p className="text-gray-600 mt-2">Manage orders, products, and customer activity at a glance.</p>
        </div>
        <button onClick={handleSignOut} className="btn-secondary inline-flex items-center gap-2">
          <FiLogOut className="w-5 h-5" />
          Sign out
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <article key={card.title} className="card p-5">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <p className="text-sm text-gray-500">{card.title}</p>
                  <p className="text-2xl font-bold mt-1">{card.value}</p>
                </div>
                <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${card.color} text-white flex items-center justify-center`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
              <p className="text-sm text-gray-500">{card.detail}</p>
            </article>
          );
        })}
      </div>

      <div className="card p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Orders</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[640px]">
            <thead>
              <tr className="border-b border-gray-100 text-sm text-gray-500">
                <th className="pb-3 font-medium">Order ID</th>
                <th className="pb-3 font-medium">Customer</th>
                <th className="pb-3 font-medium">Total</th>
                <th className="pb-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.id} className="border-b border-gray-50 last:border-none">
                  <td className="py-4 font-medium text-gray-800">{order.id}</td>
                  <td className="py-4 text-gray-600">{order.customer}</td>
                  <td className="py-4 text-gray-600">{order.total}</td>
                  <td className="py-4">
                    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${statusClasses[order.status]}`}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default AdminPanel;
