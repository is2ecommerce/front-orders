import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Order } from '../../models/order.model';

interface PaymentForm {
  cardNumber: string;
  cardHolder: string;
  expiryDate: string;
  cvv: string;
  email: string;
  phone: string;
}

@Component({
  selector: 'app-payment',
  imports: [CommonModule, FormsModule],
  templateUrl: './payment.html',
  styleUrl: './payment.css'
})
export class Payment implements OnInit {
  orderNumber: string = '';
  orderTotal: number = 0;
  isProcessing: boolean = false;
  paymentSuccess: boolean = false;
  currentOrder: Order | null = null;

  paymentForm: PaymentForm = {
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: '',
    email: '',
    phone: ''
  };

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Preferir orden enviada por estado de navegación
    const state = history.state as { order?: Order };
    if (state?.order) {
      this.currentOrder = state.order;
      this.orderNumber = state.order.orderNumber;
      this.orderTotal = state.order.total;
    } else {
      // Fallback: obtener parámetros de la URL (si navegan directo)
      this.route.queryParams.subscribe(params => {
        this.orderNumber = params['orderNumber'] || '';
        this.orderTotal = parseFloat(params['total']) || 0;
      });
    }
  }

  formatCardNumber(event: any): void {
    let value = event.target.value.replace(/\s/g, '');
    let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
    this.paymentForm.cardNumber = formattedValue;
  }

  formatExpiryDate(event: any): void {
    let value = event.target.value.replace(/\D/g, '');
    if (value.length >= 2) {
      value = value.slice(0, 2) + '/' + value.slice(2, 4);
    }
    this.paymentForm.expiryDate = value;
  }

  validateForm(): boolean {
    const cardNumberClean = this.paymentForm.cardNumber.replace(/\s/g, '');
    
    if (cardNumberClean.length !== 16) {
      alert('Número de tarjeta inválido');
      return false;
    }
    
    if (!this.paymentForm.cardHolder.trim()) {
      alert('Nombre del titular requerido');
      return false;
    }
    
    if (this.paymentForm.cvv.length !== 3) {
      alert('CVV inválido');
      return false;
    }
    
    if (!this.paymentForm.email.includes('@')) {
      alert('Email inválido');
      return false;
    }
    
    return true;
  }

  processPayment(): void {
    if (!this.validateForm()) {
      return;
    }

    this.isProcessing = true;

    // Simular procesamiento de pago
    setTimeout(() => {
      this.isProcessing = false;
      this.paymentSuccess = true;
      
      // Redirigir al recibo después de 2 segundos
      setTimeout(() => {
        const payment = { id: `RCP-${Date.now()}`, date: new Date() };
        this.router.navigate(['/recibo'], { state: { order: this.currentOrder, payment } });
      }, 2000);
    }, 2000);
  }

  cancelPayment(): void {
    this.router.navigate(['/historial-ordenes']);
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(amount);
  }
}