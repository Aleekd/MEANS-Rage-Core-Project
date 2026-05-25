import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root' 
})
export class AuthService {
  private http = inject(HttpClient);
  
  private apiUrl = 'http://localhost:8080/api/users/login'; 

  login(correo: string, password: string) {
    return this.http.post(this.apiUrl, { correo, password }).pipe(
      tap((respuesta: any) => {
        sessionStorage.setItem('token', respuesta.token);
        localStorage.setItem('rol', respuesta.usuario.rol); 
        
        const userId = respuesta.usuario._id || respuesta.usuario.id || respuesta.usuario.uid;
        localStorage.setItem('uid', userId); 
        
        
        localStorage.setItem('nombre', respuesta.usuario.nombre);
        localStorage.setItem('correo', respuesta.usuario.correo);
      })
    );
  }

  // Métodos útiles para revisar quién está conectado
  getRol() {
    return localStorage.getItem('rol');
  }

  isLoggedIn(): boolean {
    const token = sessionStorage.getItem('token');
    return !!token; 
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('rol');
  }
}