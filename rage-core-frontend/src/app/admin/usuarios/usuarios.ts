import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './usuarios.html'
})
export class UsuariosComponent implements OnInit {
  usuarios: any[] = [];
  mostrarFormulario: boolean = false;
  
  //Banderas para el modo edición
  modoEdicion: boolean = false;
  usuarioEdicionId: string = '';
  
  //ESTADOS PARA LA NOTIFICACIÓN (TOAST)
  toastVisible: boolean = false;
  toastMensaje: string = '';
  toastTipo: 'success' | 'error' = 'success';

  //ESTADOS PARA EL MODAL DE ELIMINACIÓN
  modalEliminarVisible: boolean = false;
  idUsuarioAEliminar: string = '';

  nuevoUsuario = {
    nombre: '',
    correo: '',
    password: '',
    rol: 'staff' 
  };

  private http = inject(HttpClient);
  private cdr = inject(ChangeDetectorRef);
  private apiUrl = 'http://localhost:8080/api/users'; 

  ngOnInit() {
    this.cargarUsuarios();
  }

  // --- SISTEMA DE NOTIFICACIONES ---
  mostrarNotificacion(mensaje: string, tipo: 'success' | 'error' = 'success') {
    this.toastMensaje = mensaje;
    this.toastTipo = tipo;
    this.toastVisible = true;
    this.cdr.detectChanges(); 
    
    setTimeout(() => {
      this.toastVisible = false;
      this.cdr.detectChanges();
    }, 3500);
  }

  // --- SISTEMA DE MODAL DE ELIMINACIÓN ---
  
  // 1. Abre el modal
  prepararEliminacion(id: string) {
    this.idUsuarioAEliminar = id;
    this.modalEliminarVisible = true;
  }

  // 2. Cancela la acción
  cerrarModalEliminar() {
    this.modalEliminarVisible = false;
    this.idUsuarioAEliminar = '';
  }

  // 3. Ejecuta el borrado
  confirmarEliminacion() {
    if (!this.idUsuarioAEliminar) return;

    //CAMBIO A SESSIONSTORAGE
    const token = sessionStorage.getItem('token') || '';
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.delete(`${this.apiUrl}/${this.idUsuarioAEliminar}`, { headers }).subscribe({
      next: () => {
        this.mostrarNotificacion('ACCESO REVOCADO PERMANENTEMENTE', 'success');
        this.cargarUsuarios();
        this.cerrarModalEliminar(); // Cerramos el modal tras el éxito
      },
      error: (err) => {
        this.mostrarNotificacion(err.error.msg || 'ERROR AL ELIMINAR OPERARIO', 'error');
        this.cerrarModalEliminar();
      }
    });
  }

  // --- LÓGICA DE DATOS ---

  // 1. OBTENER OPERARIOS (GET)
  cargarUsuarios() {
    // CAMBIO A SESSIONSTORAGE
    const token = sessionStorage.getItem('token');
    if (!token) {
      console.error("No hay token en el sistema.");
      return;
    }
    
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.get(this.apiUrl, { headers }).subscribe({
      next: (res: any) => {
        let listaUsuarios = res.usuarios || res.users || [];
        
        const ordenJerarquia: { [key: string]: number } = {
          'admin': 1,
          'staff': 2,
          'cliente': 3
        };

        this.usuarios = listaUsuarios.sort((a: any, b: any) => {
          const rolA = a.rol ? a.rol.toLowerCase() : 'cliente';
          const rolB = b.rol ? b.rol.toLowerCase() : 'cliente';
          
          const pesoA = ordenJerarquia[rolA] || 4;
          const pesoB = ordenJerarquia[rolB] || 4;

          return pesoA - pesoB;
        });

        this.cdr.detectChanges();
      },
      error: (err) => console.error('ERROR DETECTADO:', err)
    });
  }

  // 2. PREPARAR TERMINAL PARA EDITAR
  editarUsuario(user: any) {
    this.mostrarFormulario = true;
    this.modoEdicion = true;
    this.usuarioEdicionId = user._id || user.uid; 
    
    this.nuevoUsuario = {
      nombre: user.nombre,
      correo: user.correo,
      password: '', 
      rol: user.rol || 'staff'
    };
  }

  // 3. GUARDAR CAMBIOS: RECLUTAR O ACTUALIZAR (POST / PUT)
  guardarUsuario() {
    if (!this.nuevoUsuario.nombre || !this.nuevoUsuario.correo) {
      this.mostrarNotificacion('FALTAN DATOS EN LA TERMINAL.', 'error');
      return;
    }

    //CAMBIO A SESSIONSTORAGE
    const token = sessionStorage.getItem('token') || '';
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`); 

    if (this.modoEdicion) {
      // MODO ACTUALIZAR (PUT)
      this.http.put(`${this.apiUrl}/${this.usuarioEdicionId}`, this.nuevoUsuario, { headers }).subscribe({
        next: (res: any) => {
          this.mostrarNotificacion('OPERARIO ACTUALIZADO', 'success');
          this.resetearFormulario();
          this.cargarUsuarios();
        },
        error: (err) => this.mostrarNotificacion(err.error.msg || 'ERROR AL ACTUALIZAR', 'error')
      });
    } else {
      // MODO RECLUTAR (POST)
      if (!this.nuevoUsuario.password) {
        this.mostrarNotificacion('SE REQUIERE CONTRASEÑA PARA NUEVOS OPERARIOS.', 'error');
        return;
      }
      this.http.post(this.apiUrl, this.nuevoUsuario, { headers }).subscribe({
        next: (res: any) => {
          this.mostrarNotificacion('NUEVO OPERARIO RECLUTADO', 'success');
          this.resetearFormulario();
          this.cargarUsuarios();
        },
        error: (err) => this.mostrarNotificacion(err.error.msg || 'ERROR AL REGISTRAR', 'error')
      });
    }
  }

  // 4. LIMPIEZA DEL SISTEMA
  resetearFormulario() {
    this.nuevoUsuario = { nombre: '', correo: '', password: '', rol: 'staff' };
    this.mostrarFormulario = false;
    this.modoEdicion = false;
    this.usuarioEdicionId = '';
  }
}