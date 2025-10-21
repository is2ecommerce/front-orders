import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Order, OrderStatus, Product } from '../../models/order.model';

@Component({
  selector: 'app-order-history',
  imports: [CommonModule],
  templateUrl: './order-history.html',
  styleUrl: './order-history.css'
})
export class OrderHistory implements OnInit {
  orders: Order[] = [];
  filteredOrders: Order[] = [];
  selectedOrder: Order | null = null;
  selectedFilter: string = 'all';

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.loadMockOrders();
    this.filteredOrders = this.orders;
  }

  loadMockOrders(): void {
    // Datos mock para desarrollo
    this.orders = [
      {
        orderNumber: 'ORD-2024-001',
        date: new Date('2024-10-05'),
        total: 459000,
        status: OrderStatus.DELIVERED,
        products: [
          {
            id: 1,
            name: 'Laptop HP Pavilion 15',
            price: 350000,
            quantity: 1
          },
          {
            id: 2,
            name: 'Mouse Logitech MX Master',
            price: 89000,
            quantity: 1
          },
          {
            id: 3,
            name: 'Cable USB-C',
            price: 20000,
            quantity: 1
          }
        ]
      },
      {
        orderNumber: 'ORD-2024-002',
        date: new Date('2024-10-03'),
        total: 125000,
        status: OrderStatus.SHIPPED,
        products: [
          {
            id: 4,
            name: 'Teclado mecánico Redragon',
            price: 95000,
            quantity: 1
          },
          {
            id: 5,
            name: 'Mousepad grande',
            price: 30000,
            quantity: 1
          }
        ]
      },
      {
        orderNumber: 'ORD-2024-003',
        date: new Date('2024-09-28'),
        total: 280000,
        status: OrderStatus.DELIVERED,
        products: [
          {
            id: 6,
            name: 'Monitor Samsung 24"',
            price: 280000,
            quantity: 1
          }
        ]
      },
      {
        orderNumber: 'ORD-2024-004',
        date: new Date('2024-09-25'),
        total: 75000,
        status: OrderStatus.PROCESSING,
        products: [
          {
            id: 7,
            name: 'Audífonos Sony WH-1000XM4',
            price: 75000,
            quantity: 1
          }
        ]
      },
      {
        orderNumber: 'ORD-2024-005',
        date: new Date('2024-10-21'),
        total: 189000,
        status: OrderStatus.PENDING,
        products: [
          {
            id: 8,
            name: 'Tablet Samsung Galaxy Tab S9',
            price: 189000,
            quantity: 1
          }
        ]
      }
    ];
  }

  filterOrders(filter: string): void {
    this.selectedFilter = filter;

    if (filter === 'all') {
      this.filteredOrders = this.orders;
    } else if (filter === 'delivered') {
      this.filteredOrders = this.orders.filter(order => order.status === OrderStatus.DELIVERED);
    } else if (filter === 'shipped') {
      this.filteredOrders = this.orders.filter(order => order.status === OrderStatus.SHIPPED);
    } else if (filter === 'processing') {
      this.filteredOrders = this.orders.filter(order => order.status === OrderStatus.PROCESSING);
    }
  }

  viewOrderDetails(order: Order): void {
    this.selectedOrder = order;
  }

  payOrder(order: Order): void {
    this.router.navigate(['/pago'], { state: { order } });
  }

  closeOrderDetails(): void {
    this.selectedOrder = null;
  }

  getStatusClass(status: OrderStatus): string {
    switch (status) {
      case OrderStatus.DELIVERED:
        return 'status-delivered';
      case OrderStatus.SHIPPED:
        return 'status-shipped';
      case OrderStatus.PROCESSING:
        return 'status-processing';
      case OrderStatus.PENDING:
        return 'status-pending';
      case OrderStatus.CANCELLED:
        return 'status-cancelled';
      default:
        return '';
    }
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(amount);
  }

  formatDate(date: Date): string {
    return new Intl.DateTimeFormat('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  }
}