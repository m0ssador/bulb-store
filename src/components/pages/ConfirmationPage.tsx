import { Link, useLocation, useParams } from "react-router-dom";
import type { Order } from "../../types";
import page from "../Page.module.css";

export function ConfirmationPage() {
  const { id } = useParams();
  const location = useLocation();
  const order = location.state as Order | null;

  return (
    <section className={`${page.page} ${page.emptyState}`}>
      <div className={page.successMark}>✓</div>
      <h1>Заказ оформлен</h1>
      <p>Номер заказа: {order?.id ?? id}</p>
      {order?.customerEmail && <p>Подтверждение отправим на {order.customerEmail}</p>}
      <Link className={page.primaryLink} to="/">
        Вернуться в каталог
      </Link>
    </section>
  );
}
