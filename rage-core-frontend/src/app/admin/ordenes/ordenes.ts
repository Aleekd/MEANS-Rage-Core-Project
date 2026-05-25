import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrdenesService } from '../../services/ordenes';

@Component({
  selector: 'app-ordenes-admin',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ordenes.html'
})
export class OrdenesComponent implements OnInit {
  private ordenesService = inject(OrdenesService);
  private cdr = inject(ChangeDetectorRef);
  
  ordenes: any[] = [];
  estadosValidos = ['Pendiente', 'Pagado', 'Procesando', 'Enviado', 'Entregado'];

  // --- Estado del Modal de Inspección ---
  public modalDetalleVisible: boolean = false;
  public ordenSeleccionada: any = null;

  ngOnInit() {
    this.cargarOrdenes();
  }

  cargarOrdenes() {
    this.ordenesService.obtenerTodasLasOrdenes().subscribe((res: any) => {
      this.ordenes = res.ordenes;
      this.cdr.detectChanges();
    });
  }

  // Función para abrir el manifiesto de la orden
  abrirInspeccion(orden: any) {
    this.ordenSeleccionada = orden;
    this.modalDetalleVisible = true;
    document.body.style.overflow = 'hidden';
    this.cdr.detectChanges();
  }
 // Función para cerrar el manifiesto de la orden
  cerrarInspeccion() {
    this.modalDetalleVisible = false;
    document.body.style.overflow = 'auto';
    setTimeout(() => {
      this.ordenSeleccionada = null;
      this.cdr.detectChanges();
    }, 300);
  }

  cambiarEstatus(id: string, event: any) {
    const nuevoEstado = event.target.value;
    
    this.ordenesService.actualizarEstadoOrden(id, nuevoEstado).subscribe({
      next: (res: any) => {
        const index = this.ordenes.findIndex(o => o._id === id);
        if (index !== -1) {
          this.ordenes[index].estado = nuevoEstado;
          if(this.ordenSeleccionada && this.ordenSeleccionada._id === id) {
            this.ordenSeleccionada.estado = nuevoEstado;
          }
          this.cdr.detectChanges();
        }
      },
      error: (err) => console.error('Fallo en la sincronización', err)
    });
  }

  obtenerImagen(imagen: string): string {
    if (!imagen) {
        return 'assets/placeholder.jpg'; 
    }
    
    if (imagen.startsWith('http')) {
        return imagen;
    }
   
    return `http://localhost:8080/api/uploads/productos/${imagen}`; 
}
}