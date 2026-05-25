import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html'
})
export class DashboardComponent implements OnInit {
  
  ventasTotales: number = 0;
  pedidosPendientes: number = 0;
  alertasStock: number = 0;
  ultimasTransacciones: any[] = [];
  productosAltaDemanda: any[] = [];
  
  private http = inject(HttpClient);
  private cdr = inject(ChangeDetectorRef); 

  ngOnInit() {
    // CAMBIO CLAVE: Cambiamos localStorage por sessionStorage
    const token = sessionStorage.getItem('token') || '';
    
    // Unificamos la seguridad con el estándar Bearer que configuramos
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    // 1. CARGAMOS LAS ÓRDENES
    this.http.get('http://localhost:8080/api/orders', { headers }).subscribe({
      next: (res: any) => {
        const ordenes = res.ordenes;
        
        this.ventasTotales = ordenes.reduce((acc: number, o: any) => acc + o.total, 0);
        this.pedidosPendientes = ordenes.filter((o: any) => o.estado === 'Pendiente').length;
        this.ultimasTransacciones = ordenes.slice(0, 5);

        // LÓGICA DE ALTA DEMANDA (Top Ventas)
        const ventasAgrupadas: { [key: string]: any } = {};

        ordenes.forEach((orden: any) => {
          orden.productos.forEach((item: any) => {
            if (item.producto) {
              const prodId = item.producto._id;
              
              if (!ventasAgrupadas[prodId]) {
                ventasAgrupadas[prodId] = {
                  nombre: item.producto.nombre,
                  cantidadVendida: 0
                };
              }
              ventasAgrupadas[prodId].cantidadVendida += item.cantidad;
            }
          });
        });

        this.productosAltaDemanda = Object.values(ventasAgrupadas)
          .sort((a: any, b: any) => b.cantidadVendida - a.cantidadVendida)
          .slice(0, 3);

        this.cdr.detectChanges(); 
      },
      error: (err) => console.error('Error cargando órdenes del admin', err)
    });

    // 2. CARGAMOS LOS PRODUCTOS (Para calcular el stock crítico)
    this.http.get('http://localhost:8080/api/productos', { headers }).subscribe({
      next: (res: any) => {
        const productos = res.productos;
        
        // Buscamos cuántos productos tienen menos de 5 piezas en stock
        this.alertasStock = productos.filter((p: any) => p.stock < 5).length;

        this.cdr.detectChanges(); 
      },
      error: (err) => console.error('Error cargando productos', err)
    });
  }
}