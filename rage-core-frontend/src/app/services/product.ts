import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../interfaces/product.interface';

@Injectable({
  providedIn: 'root',
})

export class ProductService {
  private apiUrl = 'http://localhost:8080/api/productos';

  constructor(private http: HttpClient) {}

  //Metodo para obtener los productos de la BD
  getProducts(): Observable<any> {
    return this.http.get(this.apiUrl);
  }
}
