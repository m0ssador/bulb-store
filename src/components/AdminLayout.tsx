import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../services/useAuth";
import styles from "./AdminLayout.module.css";

export function AdminLayout() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/admin/login", { replace: true });
  }

  return (
    <div className={styles.wrapper}>
      <header className={styles.header}>
        <div>
          <h1>Панель администратора</h1>
          <p>{user ? `Вы вошли как ${user.login}` : "Управление магазином"}</p>
        </div>
        <button onClick={handleLogout} type="button">
          Выйти
        </button>
      </header>

      <nav className={styles.tabs}>
        <NavLink to="/admin/products">Товары</NavLink>
        <NavLink to="/admin/orders">Заказы</NavLink>
      </nav>

      <main>
        <Outlet />
      </main>
    </div>
  );
}
