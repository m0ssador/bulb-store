import { Link } from "react-router-dom";
import { useCart } from "../services/useCart";
import { getProductImage } from "../mocks/fallbackProducts";
import type { Product } from "../types";
import { CartIcon } from "./icons/CartIcon";
import page from "./Page.module.css";
import styles from "./ProductCard.module.css";

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();

  return (
    <article className={styles.card}>
      <Link to={`/products/${product.id}`} className={styles.imageLink}>
        <img src={getProductImage(product)} alt={product.name} />
      </Link>

      <div className={styles.info}>
        <Link to={`/products/${product.id}`} className={styles.title}>
          {product.name}
        </Link>
        <p>{product.description}</p>

        <div className={styles.tags}>
          <span>{product.power}W</span>
          <span>{product.socket}</span>
          <span>{product.shape}</span>
        </div>

        <p className={page.stock}>В наличии: {product.quantity} шт</p>

        <div className={styles.cardBottom}>
          <strong>{product.price} ₽</strong>
          <button type="button" onClick={() => addItem(product)}>
            <CartIcon />
            В корзину
          </button>
        </div>
      </div>
    </article>
  );
}
