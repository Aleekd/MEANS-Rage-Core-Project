import { Component, inject, OnInit } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common'; 
import { AuthService } from '../services/auth';
import { CartService } from '../services/cart';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './header.html'
})
export class HeaderComponent {
  // Lo ponemos público para que el HTML pueda leerlo directamente
  public authService = inject(AuthService);
  private router = inject(Router);
  private cartService = inject(CartService);
  public cartItemCount: number = 0;

  ngOnInit() {
    
    this.cartService.cart$.subscribe(items => {
      // Sumamos la cantidad de todas las prendas
      this.cartItemCount = items.reduce((total, item) => total + item.cantidad, 0);
    });
  }


  cerrarSesion() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}