import type {
  AuthTokenResponse,
  AuthUser,
  Category,
  LoginRequest,
  Order,
  OrderCreate,
  OrderStatus,
  Product,
  ProductCreate,
  ProductPage,
  ProductUpdate,
} from "../types";

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

  if (response.status === 204) {
    return undefined as T;
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

function authHeaders(token: string) {
  return { Authorization: `Bearer ${token}` };
}

export function loginAdmin(payload: LoginRequest) {
  return request<AuthTokenResponse>(`${CATALOG_API}/auth/login`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function getCurrentAdmin(token: string) {
  return request<AuthUser>(`${CATALOG_API}/auth/me`, {
    headers: authHeaders(token),
  });
}

export function createProduct(payload: ProductCreate, token: string) {
  return request<Product>(`${CATALOG_API}/products`, {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify(payload),
  });
}

export function updateProduct(productId: number, payload: ProductUpdate, token: string) {
  return request<Product>(`${CATALOG_API}/products/${productId}`, {
    method: "PATCH",
    headers: authHeaders(token),
    body: JSON.stringify(payload),
  });
}

export function deleteProduct(productId: number, token: string) {
  return request<void>(`${CATALOG_API}/products/${productId}`, {
    method: "DELETE",
    headers: authHeaders(token),
  });
}

export function getOrders(params: URLSearchParams, token: string) {
  return request<{ items: Order[]; page: number; size: number; total: number }>(
    `${ORDERS_API}/?${params.toString()}`,
    {
      headers: authHeaders(token),
    },
  );
}

export function updateOrderStatus(orderId: number, status: OrderStatus, token: string) {
  return request<Order>(`${ORDERS_API}/${orderId}/status`, {
    method: "PATCH",
    headers: authHeaders(token),
    body: JSON.stringify({ status }),
  });
}
