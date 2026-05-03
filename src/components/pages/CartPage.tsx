import { Link } from "react-router-dom";
import { useCart } from "../../services/useCart";
import { getProductImage } from "../../mocks/fallbackProducts";
import page from "../Page.module.css";
import styles from "./CartPage.module.css";

export function CartPage() {
  const { items, removeItem, totalPrice, updateQuantity } = useCart();

  if (items.length === 0) {
    return (
      <section className={`${page.page} ${page.emptyState}`}>
        <h1>Корзина пуста</h1>
        <p>Добавьте лампочки из каталога, чтобы оформить заказ.</p>
        <Link className={page.primaryLink} to="/">
          Перейти в каталог
        </Link>
      </section>
    );
  }

  return (
    <section className={page.page}>
      <div className={page.pageHeader}>
        <h1>Корзина</h1>
        <p>Проверьте товары перед оформлением</p>
      </div>

      <div className={styles.cartLayout}>
        <div className={styles.cartList}>
          {items.map((item) => (
            <article className={styles.cartItem} key={item.product.id}>
              <img src={getProductImage(item.product)} alt={item.product.name} />
              <div>
                <h2>{item.product.name}</h2>
                <p>{item.product.price} ₽ за штуку</p>
              </div>
              <input
                aria-label={`Количество ${item.product.name}`}
                min="1"
                type="number"
                value={item.quantity}
                onChange={(event) =>
                  updateQuantity(item.product.id, Number(event.target.value))
                }
              />
              <strong>{item.product.price * item.quantity} ₽</strong>
              <button
                type="button"
                className={styles.ghostButton}
                onClick={() => removeItem(item.product.id)}
              >
                Удалить
              </button>
            </article>
          ))}
        </div>

        <aside className={styles.summary}>
          <h2>Итого</h2>
          <p>{totalPrice} ₽</p>
          <Link className={page.primaryLink} to="/checkout">
            Оформить заказ
          </Link>
        </aside>
      </div>
    </section>
  );
}
