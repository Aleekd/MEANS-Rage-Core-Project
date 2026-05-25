import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface CartItem {
  producto: any;
  cantidad: number;
  talla: string;
  color: string;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private items: CartItem[] = [];
  private cartSubject = new BehaviorSubject<CartItem[]>([]);
  public cart$ = this.cartSubject.asObservable();

  constructor() {
    this.cargarCarrito();
  }

  private cargarCarrito() {
    const guardado = localStorage.getItem('rage_core_cart');
    if (guardado) {
      this.items = JSON.parse(guardado);
      this.cartSubject.next(this.items);
    }
  }

  private guardarCarrito() {
    localStorage.setItem('rage_core_cart', JSON.stringify(this.items));
    this.cartSubject.next(this.items);
  }

  agregar(producto: any, cantidad: number = 1, talla: string, color: string) {
    const index = this.items.findIndex(item => 
      item.producto._id === producto._id && item.talla === talla
    );

    if (index !== -1) {
      this.items[index].cantidad += cantidad;
    } else {
      this.items.push({ producto, cantidad, talla, color });
    }
    this.guardarCarrito();
  }

  remover(index: number) {
    this.items.splice(index, 1);
    this.guardarCarrito();
  }

  actualizarCantidad(index: number, cantidad: number) {
    if (cantidad < 1) return;
    this.items[index].cantidad = cantidad;
    this.guardarCarrito();
  }

  obtenerTotal(): number {
    return this.items.reduce((total, item) => total + (item.producto.precio * item.cantidad), 0);
  }

  limpiar() {
    this.items = [];
    this.guardarCarrito();
  }
}