import { useState } from "react";
import type { FormEvent } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../../services/useAuth";
import page from "../../Page.module.css";
import styles from "./AdminLoginPage.module.css";

type RedirectState = { from?: { pathname?: string } };

export function AdminLoginPage() {
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [loginValue, setLoginValue] = useState("admin");
  const [password, setPassword] = useState("admin123");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/admin/products" replace />;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await login(loginValue.trim(), password);
      const state = location.state as RedirectState | null;
      const target = state?.from?.pathname ?? "/admin/products";
      navigate(target, { replace: true });
    } catch {
      setError("Не удалось войти. Проверьте логин/пароль и доступность API.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className={`${page.page} ${styles.loginPage}`}>
      <div className={styles.card}>
        <h1>Вход в админ-панель</h1>
        <p>Используйте учётные данные администратора.</p>

        <form onSubmit={handleSubmit}>
          <label>
            Логин
            <input
              value={loginValue}
              onChange={(event) => setLoginValue(event.target.value)}
              required
              type="text"
            />
          </label>

          <label>
            Пароль
            <input
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              type="password"
            />
          </label>

          <button disabled={isSubmitting} type="submit">
            {isSubmitting ? "Входим..." : "Войти"}
          </button>
        </form>

        {error && <p className={page.error}>{error}</p>}
      </div>
    </section>
  );
}
