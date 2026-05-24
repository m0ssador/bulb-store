import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../services/useAuth";
import page from "./Page.module.css";

export function ProtectedRoute() {
  const { isAuthenticated, isBootstrapping } = useAuth();
  const location = useLocation();

  if (isBootstrapping) {
    return (
      <section className={`${page.page} ${page.emptyState}`}>
        <p>Проверяем доступ...</p>
      </section>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
