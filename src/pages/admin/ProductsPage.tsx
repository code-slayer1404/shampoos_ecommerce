import { useEffect, useMemo, useState } from 'react'
import { adminService, Product, ProductFormData } from '../../services/adminService'
import { Table } from '../../components/ui/Table'
import { Button } from '../../components/ui/Button'
import { Modal } from '../../components/ui/Modal'
import { Input } from '../../components/ui/Input'
import { useToastContext } from '../../hooks/useToastContext'

const defaultForm: ProductFormData = { name: '', price: 0, stock: 0, category: '', description: '' }

const ProductsPage = () => {
  const { showToast } = useToastContext()
  const [products, setProducts] = useState<Product[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [form, setForm] = useState<ProductFormData>(defaultForm)
  const [errors, setErrors] = useState<Partial<Record<keyof ProductFormData, string>>>({})
  const [editing, setEditing] = useState<Product | null>(null)
  const [showFormModal, setShowFormModal] = useState(false)
  const [deleting, setDeleting] = useState<Product | null>(null)

  const loadProducts = async () => {
    setIsLoading(true)
    try {
      const response = await adminService.getProducts(page, 10)
      setProducts(response.items)
      setTotal(response.total)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadProducts()
  }, [page])

  const validate = () => {
    const next: Partial<Record<keyof ProductFormData, string>> = {}
    if (!form.name.trim()) next.name = 'Name is required.'
    if (form.price <= 0) next.price = 'Price must be greater than 0.'
    if (form.stock < 0) next.stock = 'Stock cannot be negative.'
    if (!form.category.trim()) next.category = 'Category is required.'
    if (!form.description.trim()) next.description = 'Description is required.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const openCreate = () => {
    setEditing(null)
    setErrors({})
    setForm(defaultForm)
    setShowFormModal(true)
  }

  const openEdit = (product: Product) => {
    setEditing(product)
    setErrors({})
    setForm({
      name: product.name,
      price: product.price,
      stock: product.stock,
      category: product.category,
      description: product.description,
    })
    setShowFormModal(true)
  }

  const onSave = async () => {
    if (!validate()) return
    setIsSaving(true)
    try {
      if (editing) {
        await adminService.updateProduct(editing._id, form)
        showToast('success', 'Product updated successfully.')
      } else {
        await adminService.createProduct(form)
        showToast('success', 'Product created successfully.')
      }
      setShowFormModal(false)
      await loadProducts()
    } catch {
      showToast('error', 'Failed to save product.')
    } finally {
      setIsSaving(false)
    }
  }

  const onDelete = async () => {
    if (!deleting) return
    try {
      await adminService.deleteProduct(deleting._id)
      setDeleting(null)
      showToast('success', 'Product deleted.')
      await loadProducts()
    } catch {
      showToast('error', 'Failed to delete product.')
    }
  }

  const columns = useMemo(() => [
    { header: 'Name', key: 'name', render: (row: Product) => row.name },
    { header: 'Category', key: 'category', render: (row: Product) => row.category },
    { header: 'Price', key: 'price', render: (row: Product) => `$${row.price}` },
    { header: 'Stock', key: 'stock', render: (row: Product) => row.stock },
    {
      header: 'Actions',
      key: 'actions',
      render: (row: Product) => (
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => openEdit(row)}>Edit</Button>
          <Button variant="danger" onClick={() => setDeleting(row)}>Delete</Button>
        </div>
      ),
    },
  ], [])

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Products</h1>
        <Button onClick={openCreate}>Add Product</Button>
      </div>
      {isLoading ? <p>Loading products...</p> : <Table columns={columns} data={products} />}
      <div className="flex items-center justify-between text-sm text-slate-500">
        <p>Total: {total}</p>
        <div className="flex gap-2">
          <Button variant="secondary" disabled={page === 1} onClick={() => setPage((prev) => prev - 1)}>Previous</Button>
          <Button variant="secondary" onClick={() => setPage((prev) => prev + 1)}>Next</Button>
        </div>
      </div>

      <Modal open={showFormModal} title={editing ? 'Edit Product' : 'Add Product'} onClose={() => setShowFormModal(false)}>
        <div className="space-y-3">
          <Input label="Name" value={form.name} error={errors.name} onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))} />
          <Input label="Category" value={form.category} error={errors.category} onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))} />
          <Input label="Price" type="number" value={form.price} error={errors.price} onChange={(e) => setForm((prev) => ({ ...prev, price: Number(e.target.value) }))} />
          <Input label="Stock" type="number" value={form.stock} error={errors.stock} onChange={(e) => setForm((prev) => ({ ...prev, stock: Number(e.target.value) }))} />
          <Input label="Description" value={form.description} error={errors.description} onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))} />
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setShowFormModal(false)}>Cancel</Button>
            <Button isLoading={isSaving} onClick={onSave}>Save</Button>
          </div>
        </div>
      </Modal>

      <Modal open={Boolean(deleting)} title="Delete Product" onClose={() => setDeleting(null)}>
        <p className="text-sm text-slate-600">Are you sure you want to delete {deleting?.name}?</p>
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="secondary" onClick={() => setDeleting(null)}>Cancel</Button>
          <Button variant="danger" onClick={onDelete}>Delete</Button>
        </div>
      </Modal>
    </section>
  )
}

export default ProductsPage
