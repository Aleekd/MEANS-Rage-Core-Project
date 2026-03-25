import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { ProductService } from '../services/product';
import { Product } from '../interfaces/product.interface'; 

@Component({
  selector: 'app-content',
  standalone: true,
  imports: [CommonModule], 
  templateUrl: './content.html'
})
export class ContentComponent implements OnInit {
  public products: Product[] = []; 

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    // Cuando el componente carga, pedimos los productos al backend
    this.productService.getProducts().subscribe({
      next: (response: any) => { 
        const ropaExtraida = response.productos?.productos || response.productos || response;

        this.products = ropaExtraida;
        console.log("Lista real de Rage Core", this.products);
      },
      error: (error: any) => {
        console.error("No se pudieron cargar los productos", error);
      }
    });
  }
}