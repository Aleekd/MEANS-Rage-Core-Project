import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-seguridad',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './seguridad.html'
})
export class SeguridadComponent {
  passwords = {
    actual: '',
    nueva: ''
  };

  mostrarModalExito: boolean = false;
  mostrarError: boolean = false;
  mensajeError: string = '';

  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/users';

  cambiarContrasena() {
    // Validación básica antes de mandar la petición
    if (!this.passwords.actual || !this.passwords.nueva) {
      this.mostrarError = true;
      this.mensajeError = "Llena ambos campos.";
      return;
    }

    const id = localStorage.getItem('uid');
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('x-token', token || '');

    const payload = {
      passwordActual: this.passwords.actual,
      nuevaPassword: this.passwords.nueva
    };

    this.http.put(`${this.apiUrl}/${id}/seguridad`, payload, { headers }).subscribe({
      next: (res: any) => {
        // Si todo sale bien, limpiamos formulario y mostramos éxito
        this.passwords = { actual: '', nueva: '' };
        this.mostrarError = false;
        this.mostrarModalExito = true;
        
        setTimeout(() => {
          this.mostrarModalExito = false;
        }, 3000);
      },
      error: (err) => {
        // Mostramos el mensaje de error que nos manda el backend (ej. contraseña incorrecta)
        this.mostrarError = true;
        this.mensajeError = err.error.msg || 'Error al actualizar la seguridad.';
      }
    });
  }
}