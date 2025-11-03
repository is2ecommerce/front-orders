import { Routes } from '@angular/router';
import { OrderHistory } from './components/order-history/order-history';
import { Payment } from './components/payment/payment';
import { Receipt } from './components/receipt/receipt';

export const routes: Routes = [
  { path: 'historial-ordenes', component: OrderHistory },
  { path: 'pago', component: Payment },
  { path: 'recibo', component: Receipt },
  { path: '', redirectTo: '/historial-ordenes', pathMatch: 'full' }
];