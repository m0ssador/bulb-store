import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getProduct } from "../../services/api";
import { useCart } from "../../services/useCart";
import { fallbackProducts, getProductImage } from "../../mocks/fallbackProducts";
import type { Product } from "../../types";
import { CartIcon } from "../icons/CartIcon";
import page from "../Page.module.css";
import styles from "./ProductPage.module.css";

export function ProductPage() {
  const { id } = useParams();
  const { addItem } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isCancelled = false;

    async function loadProduct() {
      if (!id) {
        return;
      }

      setIsLoading(true);

      try {
        const item = await getProduct(id);

        if (!isCancelled) {
          setProduct(item);
        }
      } catch {
        const fallback = fallbackProducts.find((item) => item.id === Number(id)) ?? null;

        if (!isCancelled) {
          setProduct(fallback);
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    }

    loadProduct();

    return () => {
      isCancelled = true;
    };
  }, [id]);

  if (isLoading) {
    return (
      <section className={page.page}>
        <p className={page.notice}>Загружаем товар...</p>
      </section>
    );
  }

  if (!product) {
    return (
      <section className={`${page.page} ${page.emptyState}`}>
        <h1>Товар не найден</h1>
        <Link to="/">Вернуться в каталог</Link>
      </section>
    );
  }

  return (
    <section className={`${page.page} ${styles.section}`}>
      <img src={getProductImage(product)} alt={product.name} />

      <div className={styles.details}>
        <Link to="/" className={styles.backLink}>
          ← В каталог
        </Link>
        <h1>{product.name}</h1>
        <p>{product.description}</p>

        <dl className={styles.specs}>
          <div>
            <dt>Мощность</dt>
            <dd>{product.power}W</dd>
          </div>
          <div>
            <dt>Цоколь</dt>
            <dd>{product.socket}</dd>
          </div>
          <div>
            <dt>Температура</dt>
            <dd>{product.colorTemperature}K</dd>
          </div>
          <div>
            <dt>Яркость</dt>
            <dd>{product.brightness} лм</dd>
          </div>
        </dl>

        <p className={page.stock}>В наличии: {product.quantity} шт</p>
        <div className={styles.buyPanel}>
          <strong>{product.price} ₽</strong>
          <button type="button" onClick={() => addItem(product)}>
            <CartIcon />
            Добавить в корзину
          </button>
        </div>
      </div>
    </section>
  );
}
