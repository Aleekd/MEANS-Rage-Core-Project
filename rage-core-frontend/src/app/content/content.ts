import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { ProductService } from '../services/product';
import { Product } from '../interfaces/product.interface'; 
import { CartService } from '../services/cart';

@Component({
  selector: 'app-content',
  standalone: true,
  imports: [CommonModule], 
  templateUrl: './content.html'
})
export class ContentComponent implements OnInit {
  public products: Product[] = []; 
  private productService = inject(ProductService);
  private cdr = inject(ChangeDetectorRef);
  private cartService = inject(CartService);

  // --- Estado del Modal de Vista Rápida ---
  public productoSeleccionado: any = null;
  public modalVisible: boolean = false;

  ngOnInit(): void {
    // Pedimos los productos al backend público
    this.productService.getProducts().subscribe({
      next: (response: any) => { 
        // Aseguramos la ruta correcta del arreglo (suele venir en response.productos)
        this.products = response.productos || [];
        console.log("🔥 Arsenal de Rage Core cargado:", this.products);
        
        // ¡Forzamos a la pantalla a repintarse!
        this.cdr.detectChanges();
      },
      error: (error: any) => {
        console.error("Radar desconectado. No se conectó al backend.", error);
      }
    });
  }

  // NUEVO: Esta función une el host de Node con el nombre de tu foto
  obtenerImagen(imagen: string): string {
    if (!imagen) return 'assets/placeholder.jpg'; 
    if (imagen.startsWith('http')) return imagen;
    
    return `http://localhost:8080/${imagen}`; 
  }

  abrirModal(producto: any) {
    this.productoSeleccionado = producto;
    this.modalVisible = true;
    // Bloqueamos el scroll del fondo
    document.body.style.overflow = 'hidden';
  }

  cerrarModal() {
    this.modalVisible = false;
    // Devolvemos el scroll
    document.body.style.overflow = 'auto';
    setTimeout(() => this.productoSeleccionado = null, 300);
  }

  agregarAlCarrito(producto: any, event?: Event) {
    if (event) {
      event.stopPropagation(); 
    }
    
  
    this.cartService.agregar(producto, 1, producto.talla, producto.color);
    
  
    if (this.modalVisible) {
      this.cerrarModal();
    }
    
    
    console.log("¡Arma agregada al arsenal!");
  }
}