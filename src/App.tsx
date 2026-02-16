// src/App.tsx
import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/layout/Layout'
import Home from './pages/Home'
import Products from './pages/Products'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Login from './pages/Login'
import Register from './pages/Register'
import OrderSuccess from './pages/OrderSuccess'
import AdminLogin from './pages/AdminLogin'
import AdminPanel from './pages/AdminPanel'
import { CartProvider } from './context/CartContext'
import ErrorBoundary from './components/common/ErrorBoundary'
import './App.css'

const ADMIN_AUTH_KEY = 'isAdminAuthenticated'

const ProtectedAdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isAuthenticated = localStorage.getItem(ADMIN_AUTH_KEY) === 'true'
  return isAuthenticated ? <>{children}</> : <Navigate to="/admin/login" replace />
}

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <Router>
        <CartProvider>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/order-success" element={<OrderSuccess />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route
                path="/admin"
                element={
                  <ProtectedAdminRoute>
                    <AdminPanel />
                  </ProtectedAdminRoute>
                }
              />
            </Routes>
          </Layout>
        </CartProvider>
      </Router>
    </ErrorBoundary>
  )
}

export default App
