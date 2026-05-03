import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { LangProvider } from './context/LangContext';
import MainLayout from './components/common/MainLayout';
import AdminLayout from './components/common/AdminLayout';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AdminRoute from './components/auth/AdminRoute';

// Public/Customer Pages
import Home from './pages/Home';
import Products from './pages/Products';
import Login from './pages/Login';
import Register from './pages/Register';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderHistory from './pages/OrderHistory';
import OrderDetail from './pages/OrderDetail';
import BouquetBuilder from './pages/BouquetBuilder';
import AiDoctor from './pages/AiDoctor';
import Profile from './pages/Profile';
import PlantTips from './pages/PlantTips';
import PlantMedicines from './pages/PlantMedicines';
import ProductDetails from './pages/ProductDetails';
import ForgotPassword from './pages/ForgotPassword';
import Security from './pages/Security';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import Support from './pages/Support';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminCategories from './pages/admin/AdminCategories';
import AdminOrders from './pages/admin/AdminOrders';
import AdminUsers from './pages/admin/AdminUsers';

function App() {
 return (
 <LangProvider>
 <AuthProvider>
 <CartProvider>
 <BrowserRouter>
 <Toaster 
 position="top-center"
 toastOptions={{
 duration: 3000,
 style: {
 background: 'var(--toast-bg, #fff)',
 color: 'var(--toast-color, #0f172a)',
 boxShadow: '0 10px 25px -5px rgba(21, 128, 61, 0.1), 0 8px 10px -6px rgba(21, 128, 61, 0.1)',
 borderRadius: '1.25rem',
 border: '1px solid var(--toast-border, #f1f5f9)',
 padding: '16px 24px',
 fontWeight: '600'
 },
 success: {
 iconTheme: {
 primary: '#15803d',
 secondary: '#fff',
 },
 },
 }}
 />
 <Routes>
 {/* PUBLIC STORE ROUTES */}
 <Route path="/" element={<MainLayout />}>
 <Route index element={<Home />} />
 <Route path="products" element={<Products />} />
 <Route path="products/:id" element={<ProductDetails />} />
 <Route path="login" element={<Login />} />
 <Route path="register" element={<Register />} />
 <Route path="forgot-password" element={<ForgotPassword />} />
 <Route path="plant-tips" element={<PlantTips />} />
 <Route path="plant-medicines" element={<PlantMedicines />} />
 <Route path="support" element={<Support />} />
 <Route path="terms" element={<Terms />} />
 <Route path="privacy" element={<Privacy />} />
 <Route path="security" element={<Security />} />
 
 {/* PROTECTED CUSTOMER ROUTES */}
 <Route path="cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
 <Route path="checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
 <Route path="orders" element={<ProtectedRoute><OrderHistory /></ProtectedRoute>} />
 <Route path="orders/:id" element={<ProtectedRoute><OrderDetail /></ProtectedRoute>} />
 <Route path="bouquets" element={<ProtectedRoute><BouquetBuilder /></ProtectedRoute>} />
 <Route path="ai-doctor" element={<AiDoctor />} />
 <Route path="profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
 </Route>

 {/* ADMIN ROUTES */}
 <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
 <Route index element={<AdminDashboard />} />
 <Route path="products" element={<AdminProducts />} />
 <Route path="categories" element={<AdminCategories />} />
 <Route path="orders" element={<AdminOrders />} />
 <Route path="users" element={<AdminUsers />} />
 </Route>
 </Routes>
 </BrowserRouter>
 </CartProvider>
 </AuthProvider>
 </LangProvider>
 );
}

export default App;
