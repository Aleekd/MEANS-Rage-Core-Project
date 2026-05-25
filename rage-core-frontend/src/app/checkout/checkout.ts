import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CartService, CartItem } from '../services/cart';
import { AuthService } from '../services/auth';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './checkout.html'
})
export class CheckoutComponent implements OnInit {
  public cartItems: CartItem[] = [];
  public total: number = 0;

 
  public direccion = {
    calle: '',
    cp: '',
    ciudad: ''
  };

  private cartService = inject(CartService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private http = inject(HttpClient); 

  ngOnInit() {
    // 1. CORTAFUEGOS: Si por algún motivo llegó aquí sin loguearse, lo pateamos al login
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    // 2. Cargamos el arsenal que trae en la mochila
    this.cartService.cart$.subscribe(items => {
      this.cartItems = items;
      this.total = this.cartService.obtenerTotal();
    });

    // 3. Si el carrito está vacío, no tiene nada que hacer aquí
    if (this.cartItems.length === 0) {
      this.router.navigate(['/catalogo']);
    }
  }

  finalizarOrden() {
    // A. Validación de seguridad (Que no manden campos en blanco)
    if (!this.direccion.calle || !this.direccion.cp || !this.direccion.ciudad) {
      alert('POR FAVOR, INGRESA LAS COORDENADAS COMPLETAS DE ENVÍO.');
      return;
    }

    // B. Unimos la dirección en un solo texto
    const direccionCompleta = `${this.direccion.calle}, CP: ${this.direccion.cp}, ${this.direccion.ciudad}`;

    // C. Formateamos los productos exactamente como los pide tu modelo de Mongoose
    const productosFormateados = this.cartItems.map(item => ({
      producto: item.producto._id,
      cantidad: item.cantidad,
      talla: item.talla,
      color: item.color
    }));

    // D. Armamos el paquete de datos (El Backend obtendrá el ID del usuario desde el Token)
    const ordenData = {
      productos: productosFormateados,
      total: this.total,
      direccion: direccionCompleta
    };

    // E. Preparamos el gafete de seguridad (Token)
    const token = sessionStorage.getItem('token') || '';
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    // F. Disparamos la petición al servidor
    this.http.post('http://localhost:8080/api/ordenes', ordenData, { headers })
      .subscribe({
        next: (res: any) => {
          alert('¡ORDEN CONFIRMADA! TU EQUIPO ESTÁ EN PREPARACIÓN.');
          this.cartService.limpiar(); 
          this.router.navigate(['/perfil/pedidos']); 
        },
        error: (err) => {
          console.error('Fallo en la transacción:', err);
          alert('ERROR DE CONEXIÓN CON EL CUARTEL GENERAL. INTENTA DE NUEVO.');
        }
      });
  }
}