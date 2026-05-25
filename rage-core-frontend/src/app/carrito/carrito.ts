import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CartService, CartItem } from '../services/cart';
import { AuthService } from '../services/auth';

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './carrito.html'
})
export class CarritoComponent implements OnInit {
  public cartItems: CartItem[] = [];
  public total: number = 0;
  public totalConDescuento: number = 0;

  // --- Estado de Cupones ---
  public codigoCupon: string = '';
  public descuentoPorcentaje: number = 0;
  public cuponAplicado: boolean = false;
  public mensajeCupon: string = '';
  public errorCupon: boolean = false;

  private cartService = inject(CartService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private http = inject(HttpClient);
  private cdr = inject(ChangeDetectorRef);

  ngOnInit() {
    this.cartService.cart$.subscribe(items => {
      this.cartItems = items;
      this.calcularTotales();
      this.cdr.detectChanges();
    });
  }

  // --- LÓGICA DE CÁLCULO Y CUPONES ---
  calcularTotales() {
    this.total = this.cartService.obtenerTotal();
    const rebaja = (this.total * this.descuentoPorcentaje) / 100;
    this.totalConDescuento = this.total - rebaja;
  }

  aplicarCupon() {
    if (!this.codigoCupon.trim()) return;

    const url = `http://localhost:8080/api/cupones/validar/${this.codigoCupon.toUpperCase()}`;
    
    this.http.get(url).subscribe({
      next: (res: any) => {
        this.descuentoPorcentaje = res.porcentajeDescuento;
        this.cuponAplicado = true;
        this.errorCupon = false;
        this.mensajeCupon = `CUPÓN ACTIVADO: -${res.porcentajeDescuento}%`;
        this.calcularTotales();
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.errorCupon = true;
        this.cuponAplicado = false;
        this.descuentoPorcentaje = 0;
        this.mensajeCupon = err.error?.msg || 'CÓDIGO INVÁLIDO O EXPIRADO';
        this.calcularTotales();
        this.cdr.detectChanges();
      }
    });
  }

  // --- GESTIÓN DE ITEMS ---
  actualizarCantidad(index: number, delta: number) {
    const nuevaCantidad = this.cartItems[index].cantidad + delta;
    if (nuevaCantidad > 0) {
      this.cartService.actualizarCantidad(index, nuevaCantidad);
    }
  }

  eliminarItem(index: number) {
    this.cartService.remover(index);
  }

  obtenerImagen(imagen: string): string {
    if (!imagen) return 'assets/placeholder.jpg';
    if (imagen.startsWith('http')) return imagen;
    return `http://localhost:8080/api/uploads/productos/${imagen}`;
  }

  procederAlPago() {
    if (this.cartItems.length === 0) return;

    // Guardamos el total final para que el Checkout sepa cuánto cobrar realmente
    const final = this.cuponAplicado ? this.totalConDescuento : this.total;
    localStorage.setItem('totalFinal', final.toString());

    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/checkout']); 
    } else {
      this.router.navigate(['/login'], { queryParams: { returnUrl: '/checkout' } });
    }
  }
}