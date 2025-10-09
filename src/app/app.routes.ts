import { Routes } from '@angular/router';
import { OrderHistory } from './components/order-history/order-history';

export const routes: Routes = [
  { path: 'historial-ordenes', component: OrderHistory },
  { path: '', redirectTo: '/historial-ordenes', pathMatch: 'full' } // Redirige por defecto
];