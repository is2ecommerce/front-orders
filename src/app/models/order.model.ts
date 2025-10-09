// src/app/models/order.model.ts

export interface Product {
  id: number;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
}

export interface Order {
  orderNumber: string;
  date: Date;
  total: number;
  status: OrderStatus;
  products: Product[];
}

export enum OrderStatus {
  PENDING = 'Pendiente',
  PROCESSING = 'En proceso',
  SHIPPED = 'Enviado',
  DELIVERED = 'Entregado',
  CANCELLED = 'Cancelado'
}