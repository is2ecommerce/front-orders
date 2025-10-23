import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Order, Product } from '../../models/order.model';

interface PaymentInfo {
  id: string;
  date: Date;
}

@Component({
  selector: 'app-receipt',
  imports: [CommonModule],
  templateUrl: './receipt.html',
  styleUrl: './receipt.css'
})
export class Receipt implements OnInit {
  order: Order | null = null;
  payment: PaymentInfo | null = null;

  ngOnInit(): void {
    // Try to get order and payment info from navigation state (works even after refresh via history.state)
    const state = history.state as { order?: Order; payment?: PaymentInfo };
    this.order = state?.order ?? null;
    this.payment = state?.payment ?? null;
  }

  constructor(private router: Router) {}

  backToHistory(): void {
    this.router.navigate(['/historial-ordenes']);
  }

  print(): void {
    window.print();
  }

  getPaymentDate(): Date {
    // Prefer the payment date if available; fallback to order date; last resort: now
    return (this.payment?.date ?? this.order?.date ?? new Date()) as Date;
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(amount);
  }

  formatDate(date: Date | string): string {
    const d = new Date(date);
    return new Intl.DateTimeFormat('es-CO', {
      year: 'numeric', month: 'long', day: '2-digit',
      hour: '2-digit', minute: '2-digit'
    }).format(d);
  }

  lineTotal(p: Product): number {
    return p.price * p.quantity;
  }

  get subtotal(): number {
    if (!this.order) return 0;
    return this.order.products.reduce((sum, p) => sum + this.lineTotal(p), 0);
  }

  get grandTotal(): number {
    // Prefer order.total if available; otherwise use computed subtotal
    return this.order?.total ?? this.subtotal;
  }
}
