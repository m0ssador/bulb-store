import { useEffect, useMemo, useState } from "react";
import {
  createProduct,
  deleteProduct,
  getCategories,
  getProducts,
  updateProduct,
} from "../../../services/api";
import { useAuth } from "../../../services/useAuth";
import type { Product, ProductCreate } from "../../../types";
import page from "../../Page.module.css";
import styles from "./AdminProductsPage.module.css";

const INITIAL_FORM: ProductCreate = {
  name: "",
  description: "",
  price: 100,
  quantity: 0,
  categoryId: 1,
  socket: "E27",
  power: 8,
  colorTemperature: 3000,
  brightness: 600,
  shape: "груша",
  popularity: 0,
};

export function AdminProductsPage() {
  const { token } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
  const [form, setForm] = useState<ProductCreate>(INITIAL_FORM);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const canSave = useMemo(
    () =>
      Boolean(
        token &&
          form.name.trim() &&
          form.socket.trim() &&
          form.shape.trim() &&
          form.categoryId > 0 &&
          form.price > 0 &&
          form.power > 0 &&
          form.colorTemperature > 0 &&
          form.quantity >= 0 &&
          form.brightness >= 0 &&
          form.popularity >= 0,
      ),
    [form, token],
  );

  useEffect(() => {
    if (!token) {
      return;
    }

    let isCancelled = false;
    const params = new URLSearchParams({
      page: "1",
      size: "100",
      sort: "name_asc",
    });

    Promise.all([getProducts(params), getCategories()])
      .then(([productsPage, categoryList]) => {
        if (!isCancelled) {
          setProducts(productsPage.items);
          setCategories(categoryList);
          if (categoryList.length > 0) {
            setForm((current) => ({ ...current, categoryId: categoryList[0].id }));
          }
        }
      })
      .catch(() => {
        if (!isCancelled) {
          setError("Не удалось загрузить товары или категории.");
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

  function fillForm(product: Product) {
    setEditingId(product.id);
    setForm({
      name: product.name,
      description: product.description ?? "",
      price: product.price,
      quantity: product.quantity,
      categoryId: product.categoryId,
      socket: product.socket,
      power: product.power,
      colorTemperature: product.colorTemperature,
      brightness: product.brightness,
      shape: product.shape,
      popularity: product.popularity,
    });
  }

  function resetForm() {
    setEditingId(null);
    setForm((current) => ({
      ...INITIAL_FORM,
      categoryId: categories[0]?.id ?? current.categoryId,
    }));
  }

  function setNumericField<K extends keyof ProductCreate>(
    field: K,
    value: string,
    fallback: number,
  ) {
    const parsed = Number(value);
    setForm((current) => ({
      ...current,
      [field]: Number.isFinite(parsed) ? parsed : fallback,
    }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!token || !canSave) {
      return;
    }

    setError("");
    setIsSaving(true);

    try {
      if (!canSave) {
        throw new Error("Проверьте обязательные поля и числовые ограничения.");
      }

      const payload: ProductCreate = {
        ...form,
        name: form.name.trim(),
        socket: form.socket.trim(),
        shape: form.shape.trim(),
        description: form.description?.trim() || null,
      };

      if (editingId === null) {
        const created = await createProduct(payload, token);
        setProducts((current) => [created, ...current]);
      } else {
        const updated = await updateProduct(editingId, payload, token);
        setProducts((current) => current.map((it) => (it.id === updated.id ? updated : it)));
      }
      resetForm();
    } catch (submitError) {
      const message =
        submitError instanceof Error
          ? submitError.message
          : "Не удалось сохранить товар. Проверьте токен и корректность полей.";
      setError(message);
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete(productId: number) {
    if (!token) {
      return;
    }
    setError("");
    try {
      await deleteProduct(productId, token);
      setProducts((current) => current.filter((product) => product.id !== productId));
      if (editingId === productId) {
        resetForm();
      }
    } catch {
      setError("Не удалось удалить товар.");
    }
  }

  return (
    <section className={page.page}>
      <div className={page.pageHeader}>
        <h2>Управление товарами</h2>
        <p>Создавайте, редактируйте и удаляйте товары магазина.</p>
      </div>

      {error && <p className={page.error}>{error}</p>}

      <form className={styles.form} onSubmit={handleSubmit}>
        <label>
          Название
          <input
            required
            value={form.name}
            onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
          />
        </label>

        <label>
          Описание
          <textarea
            value={form.description ?? ""}
            onChange={(event) =>
              setForm((current) => ({ ...current, description: event.target.value }))
            }
          />
        </label>

        <label>
          Категория
          <select
            value={form.categoryId}
            onChange={(event) =>
              setForm((current) => ({ ...current, categoryId: Number(event.target.value) }))
            }
          >
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </label>

        <div className={styles.grid}>
          <label>
            Цена
            <input
              min={1}
              required
              type="number"
              value={form.price}
              onChange={(event) => setNumericField("price", event.target.value, 1)}
            />
          </label>
          <label>
            Остаток
            <input
              min={0}
              required
              type="number"
              value={form.quantity}
              onChange={(event) => setNumericField("quantity", event.target.value, 0)}
            />
          </label>
          <label>
            Цоколь
            <input
              required
              value={form.socket}
              onChange={(event) =>
                setForm((current) => ({ ...current, socket: event.target.value }))
              }
            />
          </label>
          <label>
            Мощность, Вт
            <input
              min={1}
              required
              type="number"
              value={form.power}
              onChange={(event) => setNumericField("power", event.target.value, 1)}
            />
          </label>
          <label>
            Температура, К
            <input
              min={1000}
              required
              type="number"
              value={form.colorTemperature}
              onChange={(event) =>
                setNumericField("colorTemperature", event.target.value, 1000)
              }
            />
          </label>
          <label>
            Яркость, лм
            <input
              min={0}
              required
              type="number"
              value={form.brightness}
              onChange={(event) => setNumericField("brightness", event.target.value, 0)}
            />
          </label>
          <label>
            Форма
            <input
              required
              value={form.shape}
              onChange={(event) => setForm((current) => ({ ...current, shape: event.target.value }))}
            />
          </label>
          <label>
            Популярность
            <input
              min={0}
              required
              type="number"
              value={form.popularity}
              onChange={(event) => setNumericField("popularity", event.target.value, 0)}
            />
          </label>
        </div>

        <div className={styles.actions}>
          <button disabled={!canSave || isSaving} type="submit">
            {isSaving ? "Сохраняем..." : editingId === null ? "Добавить товар" : "Сохранить"}
          </button>
          {editingId !== null && (
            <button onClick={resetForm} type="button">
              Отменить редактирование
            </button>
          )}
        </div>
      </form>

      {isLoading ? (
        <p className={page.notice}>Загружаем товары...</p>
      ) : (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Название</th>
                <th>Цена</th>
                <th>Остаток</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td>{product.id}</td>
                  <td>{product.name}</td>
                  <td>{product.price} ₽</td>
                  <td>{product.quantity}</td>
                  <td className={styles.rowActions}>
                    <button onClick={() => fillForm(product)} type="button">
                      Редактировать
                    </button>
                    <button onClick={() => handleDelete(product.id)} type="button">
                      Удалить
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
