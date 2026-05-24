import { useEffect, useState } from "react";
import { getOrders, updateOrderStatus } from "../../../services/api";
import { useAuth } from "../../../services/useAuth";
import type { Order, OrderStatus } from "../../../types";
import page from "../../Page.module.css";
import styles from "./AdminOrdersPage.module.css";

const STATUSES: OrderStatus[] = ["pending", "confirmed", "shipped", "cancelled"];

export function AdminOrdersPage() {
  const { token } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [savingOrderId, setSavingOrderId] = useState<number | null>(null);

  useEffect(() => {
    if (!token) {
      return;
    }

    let isCancelled = false;
    const params = new URLSearchParams({ page: "1", size: "100" });

    getOrders(params, token)
      .then((response) => {
        if (!isCancelled) {
          setOrders(response.items);
        }
      })
      .catch(() => {
        if (!isCancelled) {
          setError("Не удалось загрузить заказы.");
        }
      })
      .finally(() => {
        if (!isCancelled) {
          setIsLoading(false);
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [token]);

  async function handleStatusChange(orderId: number, status: OrderStatus) {
    if (!token) {
      return;
    }

    setError("");
    setSavingOrderId(orderId);
    try {
      const updated = await updateOrderStatus(orderId, status, token);
      setOrders((current) => current.map((order) => (order.id === orderId ? updated : order)));
    } catch {
      setError("Не удалось изменить статус заказа.");
    } finally {
      setSavingOrderId(null);
    }
  }

  return (
    <section className={page.page}>
      <div className={page.pageHeader}>
        <h2>Управление заказами</h2>
        <p>Просматривайте заказы и обновляйте их статус.</p>
      </div>

      {error && <p className={page.error}>{error}</p>}

      {isLoading ? (
        <p className={page.notice}>Загружаем заказы...</p>
      ) : (
        <div className={styles.list}>
          {orders.map((order) => (
            <article className={styles.card} key={order.id}>
              <header className={styles.cardHeader}>
                <h3>Заказ #{order.id}</h3>
                <small>{new Date(order.createdAt).toLocaleString()}</small>
              </header>
              <p>
                <strong>Email:</strong> {order.customerEmail ?? "не указан"}
              </p>
              <ul>
                {order.items.map((item) => (
                  <li key={item.id}>
                    {item.productName} - {item.quantity} x {item.unitPrice} ₽
                  </li>
                ))}
              </ul>

              <div className={styles.statusRow}>
                <select
                  defaultValue={order.status}
                  onChange={(event) =>
                    handleStatusChange(order.id, event.target.value as OrderStatus)
                  }
                >
                  {STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
                {savingOrderId === order.id && <span>Сохраняем...</span>}
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
