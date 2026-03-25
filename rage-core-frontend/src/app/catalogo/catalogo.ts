import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product';
import { Product } from '../interfaces/product.interface';

@Component({
    selector: 'app-catalogo',
    standalone: true,
    imports: [],
    templateUrl: './catalogo.html'
})

export class CatalogoComponent implements OnInit {
    public products: Product[] = [];

    constructor(private productService: ProductService) {}

    ngOnInit(): void {
        this.productService.getProducts().subscribe({
            next: (response: any) => {
                const ropaExtraida = response.productos?.productos || response.productos || response;
                this.products = ropaExtraida;
            },
            error: (err) => console.error("Error al cargar catalogo", err)
        });
    }
}
