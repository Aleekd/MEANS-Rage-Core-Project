import { Component, inject, ChangeDetectorRef, OnInit } from '@angular/core'; 
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './productos.html'
})
export class ProductosComponent implements OnInit { 
  private http = inject(HttpClient);
  private cdr = inject(ChangeDetectorRef);
  private router = inject(Router);

  archivoSeleccionado: File | null = null;
  imgPreview: string | null = null;
  modoEdicion: boolean = false;
  productoEdicionId: string = '';
  toastVisible: boolean = false;
  toastMensaje: string = '';
  toastTipo: 'success' | 'error' = 'success';

  nuevoProducto = {
    nombre: '', descripcion: '', precio: 0, stock: 0,
    tipo: 'Camisa', corte: 'oversize', talla: 'M', color: 'Negro'
  };

  ngOnInit() {
    const state = history.state;
    if (state && state.producto) {
      this.modoEdicion = true;
      this.productoEdicionId = state.producto._id;
      
      // Llenamos el formulario con los datos de la BD
      this.nuevoProducto = {
        nombre: state.producto.nombre,
        descripcion: state.producto.descripcion,
        precio: state.producto.precio,
        stock: state.producto.stock,
        tipo: state.producto.tipo,
        corte: state.producto.corte,
        talla: state.producto.talla,
        color: state.producto.color
      };
      
      // Cargamos la previsualización de la imagen que ya tiene
      this.imgPreview = 'http://localhost:8080/' + state.producto.imagen;
    }
  }

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

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.archivoSeleccionado = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.imgPreview = reader.result as string;
        this.cdr.detectChanges();
      };
      reader.readAsDataURL(file);
    }
  }

  onSave() {
    // En modo edición, la foto no es obligatoria (conserva la anterior)
    if (!this.nuevoProducto.nombre || this.nuevoProducto.precio <= 0 || (!this.archivoSeleccionado && !this.modoEdicion)) {
      this.mostrarNotificacion('FALTAN ESPECIFICACIONES TÉCNICAS', 'error');
      return;
    }

    const formData = new FormData();
    formData.append('nombre', this.nuevoProducto.nombre);
    formData.append('descripcion', this.nuevoProducto.descripcion);
    formData.append('precio', this.nuevoProducto.precio.toString());
    formData.append('stock', this.nuevoProducto.stock.toString());
    formData.append('tipo', this.nuevoProducto.tipo);
    formData.append('corte', this.nuevoProducto.corte);
    formData.append('talla', this.nuevoProducto.talla);
    formData.append('color', this.nuevoProducto.color);
    
    // Solo agregamos la imagen si seleccionó una nueva
    if (this.archivoSeleccionado) {
      formData.append('imagen', this.archivoSeleccionado);
    }

    const token = sessionStorage.getItem('token') || '';
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`); 

    if (this.modoEdicion) {
      
      this.http.put(`http://localhost:8080/api/productos/${this.productoEdicionId}`, formData, { headers })
        .subscribe({
          next: () => {
            this.mostrarNotificacion('PRODUCTO ACTUALIZADO', 'success');
            this.router.navigate(['/admin/inventario']); 
          },
          error: (err) => {
            this.mostrarNotificacion('ERROR AL ACTUALIZAR EL PRODUCTO', 'error');
            console.error(err);
          }
        });
    } else {
      
      this.http.post('http://localhost:8080/api/productos', formData, { headers })
        .subscribe({
          next: () => {
            this.mostrarNotificacion('PRODUCTO DESPLEGADO CON ÉXITO', 'success');
            this.resetForm();
          },
          error: (err) => {
            this.mostrarNotificacion('ERROR AL DESPLEGAR EL PRODUCTO', 'error');
            console.error(err);
          }
        });
    }
  }

  resetForm() {
    this.nuevoProducto = {
      nombre: '', descripcion: '', precio: 0, stock: 0,
      tipo: 'Camisa', corte: 'oversize', talla: 'M', color: 'Negro'
    };
    this.archivoSeleccionado = null;
    this.imgPreview = null;
  }
}