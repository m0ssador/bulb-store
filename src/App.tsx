import { Navigate, Route, Routes } from "react-router-dom";
import { AdminLayout } from "./components/AdminLayout";
import { Layout } from "./components/Layout";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { CartPage } from "./components/pages/CartPage";
import { CatalogPage } from "./components/pages/CatalogPage";
import { CheckoutPage } from "./components/pages/CheckoutPage";
import { ConfirmationPage } from "./components/pages/ConfirmationPage";
import { ProductPage } from "./components/pages/ProductPage";
import { AdminLoginPage } from "./components/pages/admin/AdminLoginPage";
import { AdminOrdersPage } from "./components/pages/admin/AdminOrdersPage";
import { AdminProductsPage } from "./components/pages/admin/AdminProductsPage";

function App() {
  return (
    <Routes>
      <Route path="admin/login" element={<AdminLoginPage />} />
      <Route element={<ProtectedRoute />}>
        <Route path="admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="products" replace />} />
          <Route path="products" element={<AdminProductsPage />} />
          <Route path="orders" element={<AdminOrdersPage />} />
        </Route>
      </Route>
      <Route element={<Layout />}>
        <Route index element={<CatalogPage />} />
        <Route path="products/:id" element={<ProductPage />} />
        <Route path="cart" element={<CartPage />} />
        <Route path="checkout" element={<CheckoutPage />} />
        <Route path="confirmation/:id" element={<ConfirmationPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default App;
