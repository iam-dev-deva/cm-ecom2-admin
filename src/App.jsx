import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import AuthLayout from './layouts/AuthLayout'
import DashboardLayout from './layouts/DashboardLayout'
import Login from './pages/Login/Login'
import Dashboard from './pages/Dashboard/Dashboard'
import Categories from './pages/Categories/Categories'
import Customers from './pages/Customers/Customers'
import Orders from './pages/Orders/Orders'
import Coupons from './pages/Coupons/Coupons'
import Reports from './pages/Reports/Reports'
import Settings from './pages/Settings/Settings'
import ProductList from './pages/Products/List'
import ProductCreate from './pages/Products/Create'
import ProductEdit from './pages/Products/Edit'
import ProtectedRoute from './components/common/ProtectedRoute'
import { isAuthenticated } from './utils/auth'
import './App.css'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              isAuthenticated() ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />
            }
          />

          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
          </Route>

          <Route
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/products" element={<ProductList />} />
            <Route path="/products/create" element={<ProductCreate />} />
            <Route path="/products/edit/:id" element={<ProductEdit />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/coupons" element={<Coupons />} />
            <Route path="/reports" element={<Reports />} />
            {/* <Route path="/settings" element={<Settings />} /> */}
            <Route path="/change-password" element={<Settings />} />

          </Route>

          <Route
            path="*"
            element={isAuthenticated() ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />}
          />

        </Routes>
      </BrowserRouter>
      <ToastContainer
        position="top-right"
        autoClose={3000}
      />
    </>
  )
}

export default App
