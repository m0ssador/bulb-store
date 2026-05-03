export type Product = {
  id: number;
  name: string;
  description: string | null;
  price: number;
  quantity: number;
  categoryId: number;
  socket: string;
  power: number;
  colorTemperature: number;
  brightness: number;
  shape: string;
  popularity: number;
  createdAt: string;
  imageUrl?: string;
};

export type ProductPage = {
  items: Product[];
  page: number;
  size: number;
  total: number;
};

export type Category = {
  id: number;
  name: string;
};

export type OrderItemCreate = {
  productId: number;
  quantity: number;
};

export type OrderCreate = {
  items: OrderItemCreate[];
  customerEmail: string | null;
};

export type OrderItem = {
  id: number;
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
};

export type Order = {
  id: number;
  status: string;
  customerEmail: string | null;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
};
