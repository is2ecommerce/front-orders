import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

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
  currentStep: number = 1;
  
  paymentForm: PaymentForm = {
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: '',
    email: '',
    phone: ''
  };

  steps = [
    { number: 1, label: 'Información de Pago', completed: false },
    { number: 2, label: 'Procesando', completed: false },
    { number: 3, label: 'Completado', completed: false }
  ];

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Obtener parámetros de la URL
    this.route.queryParams.subscribe(params => {
      this.orderNumber = params['orderNumber'] || '';
      this.orderTotal = parseFloat(params['total']) || 0;
    });
    this.updateSteps();
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

    // Avanzar al paso 2 (Procesando)
    this.currentStep = 2;
    this.updateSteps();
    this.isProcessing = true;

    // Simular procesamiento de pago
    setTimeout(() => {
      this.isProcessing = false;
      // Avanzar al paso 3 (Completado)
      this.currentStep = 3;
      this.updateSteps();
      this.paymentSuccess = true;
      
      // Redirigir al historial después de 3 segundos
      setTimeout(() => {
        this.router.navigate(['/historial-ordenes']);
      }, 3000);
    }, 2000);
  }

  updateSteps(): void {
    this.steps.forEach((step, index) => {
      step.completed = index < this.currentStep;
    });
  }

  getStepClass(stepNumber: number): string {
    if (stepNumber < this.currentStep) {
      return 'completed';
    } else if (stepNumber === this.currentStep) {
      return 'active';
    } else {
      return 'pending';
    }
  }

  getProgressWidth(): number {
    // La línea se llena hasta el centro del círculo del paso activo
    // Para 3 pasos distribuidos uniformemente:
    // - Paso 1 activo: línea hasta el centro del círculo 1 ≈ 16.67% (centro del primer tercio)
    // - Paso 2 activo: línea hasta el centro del círculo 2 = 50% (centro del segundo tercio)
    // - Paso 3 activo: línea hasta el centro del círculo 3 ≈ 83.33% (centro del tercer tercio)
    // Pero visualmente mejor hasta el final en paso 3
    
    if (this.currentStep === 1) {
      // Paso 1: línea hasta el centro del primer círculo
      return 16.67;
    } else if (this.currentStep === 2) {
      // Paso 2: línea hasta el centro del segundo círculo
      return 50;
    } else {
      // Paso 3: línea completa hasta el final
      return 100;
    }
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