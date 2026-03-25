import { Component } from '@angular/core';

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [],
  templateUrl: './productos.html'
})
export class ProductosComponent {
  onSave() {
    console.log("Guardando nuevo producto en la BD...");
  }
}