import { useEffect, useMemo, useState } from "react";
import { getCategories, getProducts } from "../../services/api";
import { fallbackCategories, fallbackProducts } from "../../mocks/fallbackProducts";
import type { Category, Product } from "../../types";
import { ProductCard } from "../ProductCard";
import page from "../Page.module.css";
import styles from "./CatalogPage.module.css";

export function CatalogPage() {
  const [products, setProducts] = useState<Product[]>(fallbackProducts);
  const [categories, setCategories] = useState<Category[]>(fallbackCategories);
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState("all");
  const [sort, setSort] = useState("popular");
  const [isLoading, setIsLoading] = useState(true);
  const [apiError, setApiError] = useState(false);

  const params = useMemo(() => {
    const nextParams = new URLSearchParams({
      page: "1",
      size: "24",
      sort,
    });

    if (search.trim()) {
      nextParams.set("q", search.trim());
    }

    if (categoryId !== "all") {
      nextParams.set("categoryId", categoryId);
    }

    return nextParams;
  }, [categoryId, search, sort]);

  useEffect(() => {
    let isCancelled = false;

    async function loadCatalog() {
      setIsLoading(true);

      try {
        const [productsPage, categoryList] = await Promise.all([
          getProducts(params),
          getCategories(),
        ]);

        if (!isCancelled) {
          setProducts(productsPage.items);
          setCategories(categoryList);
          setApiError(false);
        }
      } catch {
        if (!isCancelled) {
          setProducts(fallbackProducts);
          setCategories(fallbackCategories);
          setApiError(true);
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    }

    loadCatalog();

    return () => {
      isCancelled = true;
    };
  }, [params]);

  return (
    <section className={page.page}>
      <div className={page.pageHeader}>
        <h1>Каталог лампочек</h1>
        <p>Высококачественная продукция от завода</p>
      </div>

      <div className={styles.filters}>
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Поиск товаров..."
        />
        <select value={categoryId} onChange={(event) => setCategoryId(event.target.value)}>
          <option value="all">Все типы</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        <select value={sort} onChange={(event) => setSort(event.target.value)}>
          <option value="popular">Популярные</option>
          <option value="price_asc">Сначала дешевле</option>
          <option value="price_desc">Сначала дороже</option>
          <option value="name_asc">По названию</option>
        </select>
      </div>

      {apiError && (
        <p className={page.notice}>Бэкенд не ответил, поэтому показаны учебные демо-товары.</p>
      )}

      {isLoading ? (
        <p className={page.notice}>Загружаем каталог...</p>
      ) : (
        <div className={styles.catalogGrid}>
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}
