import { BrowserRouter as Router, Navigate, Outlet, Route, Routes } from 'react-router-dom'
import Layout from './components/layout/Layout'
import Home from './pages/Home'
import Products from './pages/Products'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Login from './pages/Login'
import Register from './pages/Register'
import OrderSuccess from './pages/OrderSuccess'
import ErrorBoundary from './components/common/ErrorBoundary'
import { CartProvider } from './context/CartContext'
import { AuthProvider } from './context/AuthContext'
import { ToastProvider } from './context/ToastContext'
import ProtectedRoute from './components/ProtectedRoute'
import AdminLayout from './layout/AdminLayout'
import AdminLoginPage from './pages/admin/AdminLoginPage'
import DashboardPage from './pages/admin/DashboardPage'
import ProductsPage from './pages/admin/ProductsPage'
import OrdersPage from './pages/admin/OrdersPage'
import OrderDetailsPage from './pages/admin/OrderDetailsPage'
import UsersPage from './pages/admin/UsersPage'

const StoreLayout = () => (
  <Layout>
    <Outlet />
  </Layout>
)

const App = () => {
  return (
    <ErrorBoundary>
      <Router>
        <CartProvider>
          <AuthProvider>
            <ToastProvider>
              <Routes>
                <Route element={<StoreLayout />}>
                  <Route path="/" element={<Home />} />
                  <Route path="/products" element={<Products />} />
                  <Route path="/product/:id" element={<ProductDetail />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/order-success" element={<OrderSuccess />} />
                </Route>

                <Route path="/admin/login" element={<AdminLoginPage />} />
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute role="admin">
                      <AdminLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<DashboardPage />} />
                  <Route path="products" element={<ProductsPage />} />
                  <Route path="orders" element={<OrdersPage />} />
                  <Route path="orders/:id" element={<OrderDetailsPage />} />
                  <Route path="users" element={<UsersPage />} />
                </Route>

                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </ToastProvider>
          </AuthProvider>
        </CartProvider>
      </Router>
    </ErrorBoundary>
  )
}

export default App
