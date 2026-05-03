import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createOrder } from "../../services/api";
import { useCart } from "../../services/useCart";
import page from "../Page.module.css";
import styles from "./CheckoutPage.module.css";

export function CheckoutPage() {
  const { clearCart, items, totalPrice } = useCart();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const order = await createOrder({
        customerEmail: email.trim() || null,
        items: items.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
        })),
      });

      clearCart();
      navigate(`/confirmation/${order.id}`, { state: order });
    } catch {
      setError("Не удалось создать заказ. Проверьте, что сервис заказов запущен.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (items.length === 0) {
    return (
      <section className={`${page.page} ${page.emptyState}`}>
        <h1>Нет товаров для оформления</h1>
        <Link className={page.primaryLink} to="/">
          Вернуться в каталог
        </Link>
      </section>
    );
  }

  return (
    <section className={`${page.page} ${styles.checkoutPage}`}>
      <div className={page.pageHeader}>
        <h1>Оформление заказа</h1>
        <p>Оставьте email для связи по заказу</p>
      </div>

      <form className={styles.checkoutForm} onSubmit={handleSubmit}>
        <label>
          Email покупателя
          <input
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="buyer@example.com"
            type="email"
          />
        </label>

        <div className={styles.totals}>
          <h2>К оплате</h2>
          <p>{totalPrice} ₽</p>
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Оформляем..." : "Подтвердить заказ"}
          </button>
        </div>

        {error && <p className={page.error}>{error}</p>}
      </form>
    </section>
  );
}
