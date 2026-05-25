import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-cupones',
  standalone: true,
  imports: [CommonModule, FormsModule], 
  templateUrl: './cupones.html'
})
export class CuponesComponent implements OnInit {
  cupones: any[] = [];
  mostrarFormulario: boolean = false;
  
  // Banderas de edición
  modoEdicion: boolean = false;
  cuponEdicionId: string = '';

  // Estados Toast/Modal
  toastVisible: boolean = false;
  toastMensaje: string = '';
  toastTipo: 'success' | 'error' = 'success';
  modalEliminarVisible: boolean = false;
  idCuponAEliminar: string = '';

  nuevoCupon = { codigo: '', porcentajeDescuento: 0, fechaExpiracion: '' };

  private http = inject(HttpClient);
  private cdr = inject(ChangeDetectorRef);
  private apiUrl = 'http://localhost:8080/api/cupones';

  ngOnInit() {
    this.cargarCupones();
  }

  // --- NOTIFICACIONES Y MODAL ---
  mostrarNotificacion(mensaje: string, tipo: 'success' | 'error' = 'success') {
    this.toastMensaje = mensaje;
    this.toastTipo = tipo;
    this.toastVisible = true;
    this.cdr.detectChanges(); 
    setTimeout(() => { this.toastVisible = false; this.cdr.detectChanges(); }, 3500);
  }

  prepararEliminacion(id: string) {
    this.idCuponAEliminar = id;
    this.modalEliminarVisible = true;
  }

  cerrarModalEliminar() {
    this.modalEliminarVisible = false;
    this.idCuponAEliminar = '';
  }

  confirmarEliminacion() {
    if (!this.idCuponAEliminar) return;
    const token = sessionStorage.getItem('token') || '';
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.delete(`${this.apiUrl}/${this.idCuponAEliminar}`, { headers }).subscribe({
      next: () => {
        this.mostrarNotificacion('CUPÓN ELIMINADO', 'success');
        this.cargarCupones();
        this.cerrarModalEliminar();
      },
      error: (err) => {
        this.mostrarNotificacion(err.error.msg || 'ERROR AL ELIMINAR', 'error');
        this.cerrarModalEliminar();
      }
    });
  }

  // --- LÓGICA DE DATOS ---
  cargarCupones() {
    const token = sessionStorage.getItem('token') || '';
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.get(this.apiUrl, { headers }).subscribe({
      next: (res: any) => {
        this.cupones = res.cupones;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error al cargar cupones', err)
    });
  }

  // Función para cargar los datos en el formulario
  editarCupon(cupon: any) {
    this.mostrarFormulario = true;
    this.modoEdicion = true;
    this.cuponEdicionId = cupon._id;

    // Formateamos la fecha para que el input type="date" la pueda leer (YYYY-MM-DD)
    const fecha = new Date(cupon.fechaExpiracion);
    const fechaFormateada = fecha.toISOString().split('T')[0];
    
    this.nuevoCupon = {
      codigo: cupon.codigo,
      porcentajeDescuento: cupon.porcentajeDescuento,
      fechaExpiracion: fechaFormateada
    };
  }

  resetearFormulario() {
    this.nuevoCupon = { codigo: '', porcentajeDescuento: 0, fechaExpiracion: '' };
    this.mostrarFormulario = false;
    this.modoEdicion = false;
    this.cuponEdicionId = '';
  }

  guardarCupon() {
    if (!this.nuevoCupon.codigo || !this.nuevoCupon.porcentajeDescuento || !this.nuevoCupon.fechaExpiracion) {
      this.mostrarNotificacion('TODOS LOS CAMPOS SON OBLIGATORIOS', 'error');
      return;
    }

    const token = sessionStorage.getItem('token') || '';
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    if (this.modoEdicion) {
        // Actualizar
        this.http.put(`${this.apiUrl}/${this.cuponEdicionId}`, this.nuevoCupon, { headers }).subscribe({
            next: () => {
              this.mostrarNotificacion('CUPÓN ACTUALIZADO', 'success');
              this.resetearFormulario();
              this.cargarCupones(); 
            },
            error: (err) => this.mostrarNotificacion(err.error.msg || 'ERROR AL ACTUALIZAR', 'error')
        });
    } else {
        // Crear
        this.http.post(this.apiUrl, this.nuevoCupon, { headers }).subscribe({
            next: () => {
              this.mostrarNotificacion('CUPÓN GENERADO CON ÉXITO', 'success');
              this.resetearFormulario();
              this.cargarCupones(); 
            },
            error: (err) => this.mostrarNotificacion(err.error.msg || 'ERROR AL GENERAR', 'error')
        });
    }
  }
}