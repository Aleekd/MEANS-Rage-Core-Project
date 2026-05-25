import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http'; // 🔥 Necesario para el borrado seguro

@Component({
  selector: 'app-inventario',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './inventario.html'
})
export class InventarioComponent implements OnInit {
  public productos: any[] = []; 
  public cargando: boolean = true; 

  modalEliminarVisible: boolean = false;
  idProductoAEliminar: string = '';
  toastVisible: boolean = false;
  toastMensaje: string = '';
  toastTipo: 'success' | 'error' = 'success';

  private cdr = inject(ChangeDetectorRef);
  private productService = inject(ProductService);
  private http = inject(HttpClient); 
  private router = inject(Router);

  ngOnInit() {
    this.obtenerInventario();
  }
 
  mostrarNotificacion(mensaje: string, tipo: 'success' | 'error' = 'success') {
    setTimeout(() => {
      this.toastMensaje = mensaje;
      this.toastTipo = tipo;
      this.toastVisible = true;
      this.cdr.detectChanges(); 
    }, 0);
    
    setTimeout(() => {
      this.toastVisible = false;
      this.cdr.detectChanges();
    }, 3500);
  }

  obtenerInventario() {
    this.cargando = true; 
    this.productService.getProducts().subscribe({
      next: (res: any) => {
        this.productos = res.productos || []; 
        this.cargando = false; 
        this.cdr.detectChanges(); 
      },
      error: (err) => {
        console.log('Error en el radar:', err);
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }

  prepararEliminacion(id: string) {
    this.idProductoAEliminar = id;
    this.modalEliminarVisible = true;
  }

  confirmarEliminacion() {
    if (!this.idProductoAEliminar) return;

    const token = sessionStorage.getItem('token') || '';
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.delete(`http://localhost:8080/api/productos/${this.idProductoAEliminar}`, { headers }).subscribe({
      next: () => {
          this.mostrarNotificacion('ACTIVO ELIMINADO DEL BÚNKER', 'success');
          this.obtenerInventario();
          this.cerrarModalEliminar();
      },
      error: (err) => {
          this.mostrarNotificacion(err.error?.msg || 'ERROR AL ELIMINAR EL ACTIVO', 'error');
          console.error('Fallo en la purga:', err);
          this.cerrarModalEliminar();
      }
    });
  }

  cerrarModalEliminar() {
    this.modalEliminarVisible = false;
    this.idProductoAEliminar = '';
  }
  
  editarProducto(producto: any) {
    this.router.navigate(['/admin/productos'], { state: { producto: producto } });
  }
}