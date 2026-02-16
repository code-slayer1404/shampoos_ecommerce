import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiLogOut, FiPackage, FiPlus, FiRefreshCw, FiTrash2 } from '../utils/icons';
import { adminProductService, AdminProductPayload, AdminProduct } from '../services/adminProductService';

const AUTH_TOKEN_KEY = 'purelocks_token';

const defaultFormState: AdminProductPayload = {
  name: '',
  description: '',
  price: 0,
  category: '',
  image: '',
  inStock: true,
};

const AdminPanel: React.FC = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [formState, setFormState] = useState<AdminProductPayload>(defaultFormState);
  const [editingId, setEditingId] = useState<string | null>(null);

  const productCount = useMemo(() => products.length, [products]);

  const mapProductId = (product: AdminProduct): string => String(product._id || product.id || '');

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const list = await adminProductService.getAll();
      setProducts(list);
    } catch (err) {
      console.error('Failed to fetch products', err);
      setError('Unable to fetch products. Make sure you are logged in as an admin and your token is valid.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleSignOut = () => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    navigate('/admin/login');
  };

  const handleInputChange = <K extends keyof AdminProductPayload>(field: K, value: AdminProductPayload[K]) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setFormState(defaultFormState);
    setEditingId(null);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError('');

    try {
      if (editingId) {
        const updatedProduct = await adminProductService.update(editingId, formState);
        const normalizedId = mapProductId(updatedProduct);
        setProducts((prev) =>
          prev.map((product) => (mapProductId(product) === normalizedId ? updatedProduct : product))
        );
      } else {
        const createdProduct = await adminProductService.create(formState);
        setProducts((prev) => [createdProduct, ...prev]);
      }

      resetForm();
    } catch (err) {
      console.error('Failed to save product', err);
      setError('Failed to save product. Please verify your token has admin permission.');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (product: AdminProduct) => {
    setEditingId(mapProductId(product));
    setFormState({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      image: product.image || '',
      inStock: product.inStock ?? true,
    });
  };

  const handleDelete = async (productId: string) => {
    setError('');

    try {
      await adminProductService.remove(productId);
      setProducts((prev) => prev.filter((product) => mapProductId(product) !== productId));
    } catch (err) {
      console.error('Failed to delete product', err);
      setError('Failed to delete product. Please try again.');
    }
  };

  return (
    <section className="container mx-auto px-4 py-10 md:py-14 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold">Admin Product Manager</h1>
          <p className="text-gray-600 mt-2">Manage products using your backend endpoints: GET, POST, PATCH, and DELETE.</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={fetchProducts} className="btn-secondary inline-flex items-center gap-2" disabled={loading}>
            <FiRefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button onClick={handleSignOut} className="btn-secondary inline-flex items-center gap-2">
            <FiLogOut className="w-5 h-5" />
            Sign out
          </button>
        </div>
      </div>

      {error && <p className="rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

      <div className="grid lg:grid-cols-[360px_1fr] gap-6">
        <article className="card p-6 h-fit">
          <h2 className="text-xl font-semibold mb-4">{editingId ? 'Edit Product' : 'Add Product'}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input
                required
                className="input-field"
                value={formState.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                required
                className="input-field min-h-[96px]"
                value={formState.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium mb-1">Price</label>
                <input
                  required
                  type="number"
                  min={0}
                  step="0.01"
                  className="input-field"
                  value={formState.price}
                  onChange={(e) => handleInputChange('price', Number(e.target.value))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <input
                  required
                  className="input-field"
                  value={formState.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Image URL (optional)</label>
              <input
                className="input-field"
                value={formState.image}
                onChange={(e) => handleInputChange('image', e.target.value)}
              />
            </div>
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={Boolean(formState.inStock)}
                onChange={(e) => handleInputChange('inStock', e.target.checked)}
              />
              In stock
            </label>

            <div className="flex gap-2">
              <button type="submit" className="btn-primary inline-flex items-center gap-2" disabled={saving}>
                <FiPlus className="w-4 h-4" />
                {saving ? 'Saving...' : editingId ? 'Update Product' : 'Create Product'}
              </button>
              {editingId && (
                <button type="button" className="btn-secondary" onClick={resetForm}>
                  Cancel
                </button>
              )}
            </div>
          </form>
        </article>

        <article className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Products ({productCount})</h2>
            <span className="inline-flex items-center gap-1 text-sm text-gray-500">
              <FiPackage className="w-4 h-4" />
              Synced with /api/v1/products
            </span>
          </div>

          {loading ? (
            <p className="text-gray-600">Loading products...</p>
          ) : products.length === 0 ? (
            <p className="text-gray-600">No products returned by the API yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[680px] text-left">
                <thead>
                  <tr className="border-b border-gray-100 text-sm text-gray-500">
                    <th className="pb-2 font-medium">Name</th>
                    <th className="pb-2 font-medium">Category</th>
                    <th className="pb-2 font-medium">Price</th>
                    <th className="pb-2 font-medium">Stock</th>
                    <th className="pb-2 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => {
                    const productId = mapProductId(product);
                    return (
                      <tr key={productId} className="border-b border-gray-50 last:border-none">
                        <td className="py-3 font-medium text-gray-800">{product.name}</td>
                        <td className="py-3 text-gray-600">{product.category}</td>
                        <td className="py-3 text-gray-600">${Number(product.price).toFixed(2)}</td>
                        <td className="py-3 text-gray-600">{product.inStock === false ? 'Out of stock' : 'In stock'}</td>
                        <td className="py-3">
                          <div className="flex justify-end gap-2">
                            <button type="button" className="btn-secondary" onClick={() => handleEdit(product)}>
                              Edit
                            </button>
                            <button
                              type="button"
                              className="inline-flex items-center gap-1 rounded-lg border border-red-200 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                              onClick={() => handleDelete(productId)}
                            >
                              <FiTrash2 className="w-4 h-4" />
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </article>
      </div>
    </section>
  );
};

export default AdminPanel;
