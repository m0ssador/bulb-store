import { Navigate, Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";
import { CartPage } from "./components/pages/CartPage";
import { CatalogPage } from "./components/pages/CatalogPage";
import { CheckoutPage } from "./components/pages/CheckoutPage";
import { ConfirmationPage } from "./components/pages/ConfirmationPage";
import { ProductPage } from "./components/pages/ProductPage";

function App() {
  return (
    <Routes>
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
