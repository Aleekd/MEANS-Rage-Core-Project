import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrdenesService {
  private http = inject(HttpClient);
  
  // 1. CORREGIMOS LA URL AL ESPAÑOL
  private apiUrl = 'http://localhost:8080/api/ordenes';

  // 2. CENTRALIZAMOS LAS CREDENCIALES (SessionStorage + Bearer)
  private getHeaders(): HttpHeaders {
    const token = sessionStorage.getItem('token') || '';
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  // 1. El Administrador ve TODO
  obtenerTodasLasOrdenes() {
    return this.http.get(`${this.apiUrl}`, { headers: this.getHeaders() });
  }

  // 2. El Administrador cambia el estatus
  actualizarEstadoOrden(id: string, nuevoEstado: string) {
    return this.http.put(`${this.apiUrl}/${id}/estado`, { estado: nuevoEstado }, { headers: this.getHeaders() });
  }

  // 3. Crear una nueva orden (Checkout)
  crearOrden(ordenData: any): Observable<any> {
    return this.http.post(this.apiUrl, ordenData, { headers: this.getHeaders() });
  }

  // 4. El Cliente ve SU historial
  obtenerMisOrdenes(): Observable<any> {
    return this.http.get(`${this.apiUrl}/mis-ordenes`, { headers: this.getHeaders() });
  }
}