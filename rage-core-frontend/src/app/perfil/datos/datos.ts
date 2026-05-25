import { Component, inject, OnInit, ChangeDetectorRef} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
// 1. IMPORTAMOS EL SERVICIO DE ÓRDENES (Verifica que la ruta sea correcta según tus carpetas)
import { OrdenesService } from '../../services/ordenes';

@Component({
  selector: 'app-datos',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './datos.html'
})
export class DatosComponent implements OnInit {
  usuario = {
    nombre: '',
    correo: '',
    direccion: ''
  };
  private cdr = inject(ChangeDetectorRef);
  mostrarModalExito: boolean = false;
  
 
  ultimosPedidos: any[] = [];

  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/users'; 
  private ordenesService = inject(OrdenesService);

  ngOnInit() {
    // Cargar los datos del usuario para el formulario
    this.usuario.nombre = localStorage.getItem('nombre') || '';
    this.usuario.correo = localStorage.getItem('correo') || '';

  
    this.ordenesService.obtenerMisOrdenes().subscribe({
      next: (res) => {
        this.ultimosPedidos = res.ordenes.slice(0, 3);
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error al cargar órdenes en perfil', err)
    });
  }

  guardarCambios() {
    const id = localStorage.getItem('uid');
    const token = localStorage.getItem('token');
    
    const headers = new HttpHeaders().set('x-token', token || '');

    this.http.put(`${this.apiUrl}/${id}`, this.usuario, { headers }).subscribe({
      next: (res: any) => {
        this.mostrarModalExito = true;
        
        localStorage.setItem('nombre', this.usuario.nombre);
        localStorage.setItem('correo', this.usuario.correo);

        setTimeout(() => {
          this.cerrarModal();
        }, 3000);
      },
      error: (err) => {
        console.error('Error al actualizar', err);
        alert('Hubo un error en el servidor al actualizar tus datos.');
      }
    });
  }

  cerrarModal() {
    this.mostrarModalExito = false;
  }
}