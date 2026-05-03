import type { Category, Order, OrderCreate, Product, ProductPage } from "../types";

const CATALOG_API = "/api/catalog";
const ORDERS_API = "/api/orders";

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`Ошибка запроса: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export function getProducts(params: URLSearchParams) {
  return request<ProductPage>(`${CATALOG_API}/products/search?${params.toString()}`);
}

export function getProduct(id: string) {
  return request<Product>(`${CATALOG_API}/products/${id}`);
}

export function getCategories() {
  return request<Category[]>(`${CATALOG_API}/categories`);
}

export function createOrder(order: OrderCreate) {
  return request<Order>(`${ORDERS_API}/`, {
    method: "POST",
    body: JSON.stringify(order),
  });
}
