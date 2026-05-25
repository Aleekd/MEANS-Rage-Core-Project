import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrdenesService } from '../../services/ordenes';

@Component({
  selector: 'app-pedidos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pedidos.html'
})
export class PedidosComponent implements OnInit {
  private ordenesService = inject(OrdenesService);
  private cdr = inject(ChangeDetectorRef);
  
  misOrdenes: any[] = [];
  
  // --- Estado del Modal de Detalles ---
  public modalDetalleVisible: boolean = false;
  public ordenSeleccionada: any = null;

  ngOnInit(): void {
    this.cargarHistorial();
  }

  cargarHistorial() {
    this.ordenesService.obtenerMisOrdenes().subscribe({
      next: (res) => {
        this.misOrdenes = res.ordenes;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error al cargar órdenes', err)
    });
  }

  // Función para abrir el manifiesto detallado
  verDetalle(orden: any) {
    this.ordenSeleccionada = orden;
    this.modalDetalleVisible = true;
    document.body.style.overflow = 'hidden'; 
    this.cdr.detectChanges();
  }

  cerrarDetalle() {
    this.modalDetalleVisible = false;
    document.body.style.overflow = 'auto'; 
    setTimeout(() => {
      this.ordenSeleccionada = null;
      this.cdr.detectChanges();
    },300);
    this.cdr.detectChanges();
  }

  obtenerImagen(imagen: string): string {
    if (!imagen) return 'assets/placeholder.jpg';
    return imagen.startsWith('http') ? imagen : `http://localhost:8080/${imagen}`;
  }
}