import { Routes } from '@angular/router';
import { OrderHistory } from './components/order-history/order-history';
import { Payment } from './components/payment/payment';

export const routes: Routes = [
  { path: 'historial-ordenes', component: OrderHistory },
  { path: 'pago', component: Payment },
  { path: '', redirectTo: '/historial-ordenes', pathMatch: 'full' }
];