import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Order, OrderStatus, Product } from '../../models/order.model';

@Component({
  selector: 'app-order-history',
  imports: [CommonModule, FormsModule],
  templateUrl: './order-history.html',
  styleUrl: './order-history.css'
})
export class OrderHistory implements OnInit {
  orders: Order[] = [];
  filteredOrders: Order[] = [];
  selectedOrder: Order | null = null;
  selectedFilter: string = 'all';
  errorMessage: string = '';
  showError: boolean = false;
  
  // Filtros de búsqueda
  searchTerm: string = '';
  dateFrom: string = '';
  dateTo: string = '';

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.loadMockOrders();
    this.applyFilters();
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
      },
      {
        orderNumber: 'ORD-2024-006',
        date: new Date('2024-09-15'),
        total: 320000,
        status: OrderStatus.CANCELLED,
        products: [
          {
            id: 9,
            name: 'Smartphone Samsung Galaxy S23',
            price: 320000,
            quantity: 1
          }
        ]
      }
    ];
  }

  filterOrders(filter: string): void {
    this.selectedFilter = filter;
    this.applyFilters();
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  onDateChange(): void {
    this.applyFilters();
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.dateFrom = '';
    this.dateTo = '';
    this.selectedFilter = 'all';
    this.applyFilters();
  }

  applyFilters(): void {
    let result = [...this.orders];

    // Filtro por estado
    if (this.selectedFilter !== 'all') {
      const statusMap: { [key: string]: OrderStatus } = {
        'delivered': OrderStatus.DELIVERED,
        'shipped': OrderStatus.SHIPPED,
        'processing': OrderStatus.PROCESSING,
        'pending': OrderStatus.PENDING,
        'cancelled': OrderStatus.CANCELLED
      };
      
      const status = statusMap[this.selectedFilter];
      if (status) {
        result = result.filter(order => order.status === status);
      }
    }

    // Filtro por búsqueda (número de orden o nombre de producto)
    if (this.searchTerm.trim() !== '') {
      const searchLower = this.searchTerm.toLowerCase().trim();
      result = result.filter(order => {
        // Buscar en número de orden
        if (order.orderNumber.toLowerCase().includes(searchLower)) {
          return true;
        }
        // Buscar en nombres de productos
        return order.products.some(product => 
          product.name.toLowerCase().includes(searchLower)
        );
      });
    }

    // Filtro por rango de fechas
    if (this.dateFrom) {
      const fromDate = new Date(this.dateFrom);
      fromDate.setHours(0, 0, 0, 0);
      result = result.filter(order => {
        const orderDate = new Date(order.date);
        orderDate.setHours(0, 0, 0, 0);
        return orderDate >= fromDate;
      });
    }

    if (this.dateTo) {
      const toDate = new Date(this.dateTo);
      toDate.setHours(23, 59, 59, 999);
      result = result.filter(order => {
        const orderDate = new Date(order.date);
        orderDate.setHours(0, 0, 0, 0);
        return orderDate <= toDate;
      });
    }

    this.filteredOrders = result;
  }

  hasActiveFilters(): boolean {
    return this.searchTerm.trim() !== '' || 
           this.dateFrom !== '' || 
           this.dateTo !== '' || 
           this.selectedFilter !== 'all';
  }

  viewOrderDetails(order: Order): void {
    // Permitir ver detalles de órdenes canceladas
    this.selectedOrder = order;
    this.hideError();
  }

  payOrder(order: Order): void {
    // Validar que la orden no esté cancelada
    if (order.status === OrderStatus.CANCELLED) {
      this.showErrorMessage('Las órdenes canceladas no pueden ser pagadas. Esta orden fue cancelada y no permite realizar pagos posteriores.');
      return;
    }
    
    this.hideError();
    this.router.navigate(['/pago'], { state: { order } });
  }

  closeOrderDetails(): void {
    this.selectedOrder = null;
    this.hideError();
  }

  isOrderCancelled(order: Order): boolean {
    return order.status === OrderStatus.CANCELLED;
  }

  showErrorMessage(message: string): void {
    this.errorMessage = message;
    this.showError = true;
    // Ocultar el mensaje después de 5 segundos
    setTimeout(() => {
      this.hideError();
    }, 5000);
  }

  hideError(): void {
    this.showError = false;
    this.errorMessage = '';
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
