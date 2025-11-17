import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, FormsModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar {
  searchQuery: string = '';

  constructor(private router: Router) {}

  onSearch(): void {
    if (this.searchQuery.trim()) {
      // Aquí puedes implementar la lógica de búsqueda
      console.log('Buscando:', this.searchQuery);
    }
  }

  goToHome(): void {
    this.router.navigate(['/historial-ordenes']);
  }

  goToCart(): void {
    // Aquí puedes navegar al carrito si lo implementas
    console.log('Ir al carrito');
  }

  goToProfile(): void {
    // Aquí puedes navegar al perfil si lo implementas
    console.log('Ir al perfil');
  }
}

