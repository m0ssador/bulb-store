import { Link, NavLink, Outlet } from "react-router-dom";
import { useCart } from "../services/useCart";
import { CartIcon } from "./icons/CartIcon";
import { LogoIcon } from "./icons/LogoIcon";
import styles from "./Layout.module.css";

export function Layout() {
  const { totalCount } = useCart();

  return (
    <div className={styles.app}>
      <header className={styles.topbar}>
        <Link className={styles.brand} to="/">
          <span className={styles.brandIcon}>
            <LogoIcon />
          </span>
          <span>
            <strong>Завод лампочек</strong>
            <small>Качественное освещение для вашего дома</small>
          </span>
        </Link>

        <nav className={styles.nav}>
          <NavLink to="/">Каталог</NavLink>
          <NavLink to="/cart" className={styles.cartLink}>
            <CartIcon />
            Корзина {totalCount > 0 && <span>{totalCount}</span>}
          </NavLink>
        </nav>
      </header>

      <main>
        <Outlet />
      </main>
    </div>
  );
}
