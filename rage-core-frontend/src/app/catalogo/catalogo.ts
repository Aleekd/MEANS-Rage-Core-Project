import { Component, OnInit, inject, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ProductService } from '../services/product';
import { Product } from '../interfaces/product.interface';
import { Subscription, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { FormsModule } from '@angular/forms';
import { CartService } from '../services/cart';


@Component({
  selector: 'app-catalogo',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './catalogo.html'
})
export class CatalogoComponent implements OnInit, OnDestroy {
  // --- Bóvedas de Datos ---
  public allProducts: Product[] = []; 
  public productsFiltrados: Product[] = []; 
  public productsPaginados: Product[] = [];  
  
  // --- Estados de Control ---
  public categoriaActual: string = 'Todo';
  public buscarTexto: string = '';
  public ordenActual: string = 'reciente';

  // --- Motor de Paginación ---
  public paginaActual: number = 1;
  public itemsPorPagina: number = 12;
  public totalPaginas: number = 1;

  // --- Herramientas de Sistema ---
  private buscadorSubject = new Subject<string>();
  private subs: Subscription = new Subscription();
  private productService = inject(ProductService);
  private route = inject(ActivatedRoute);
  private cdr = inject(ChangeDetectorRef);
  private cartService = inject(CartService);

  // -- Modal de vista rapida -- 
  public productoSeleccionado: any = null;
  public modalVisible: boolean = false;


  ngOnInit(): void {
    // 1. RADAR DE BASE DE DATOS
    this.subs.add(this.productService.getProducts().subscribe({
      next: (res: any) => {
        this.allProducts = res.productos || [];
        this.aplicarLogicaGlobal(); 
      },
      error: (err) => console.error("Radar desconectado del backend", err)
    }));

    // 2. RADAR DE URL
    this.subs.add(this.route.queryParams.subscribe(params => {
      this.categoriaActual = params['filtro'] || 'Todo';
      this.paginaActual = 1;
      this.aplicarLogicaGlobal(); 
    }));

    // 3. RADAR DEL BUSCADOR (Debounce)
    this.subs.add(
      this.buscadorSubject.pipe(
        debounceTime(350),
        distinctUntilChanged()
      ).subscribe(texto => {
        this.buscarTexto = texto;
        this.paginaActual = 1;
        this.aplicarLogicaGlobal();
      })
    );
  }

  
  onSearchChange(event: Event) {
    const texto = (event.target as HTMLInputElement).value;
    this.buscadorSubject.next(texto);
  }

  // --- LÓGICA PRINCIPAL ---
  aplicarLogicaGlobal() {
    if (!this.allProducts || this.allProducts.length === 0) return;

    let temp = [...this.allProducts];

    // A. Filtrar por Categoría / Drops
    if (this.categoriaActual !== 'Todo') {
      if (this.categoriaActual === 'Drops') {
        const hoy = new Date();
        
        let dropsReales = temp.filter((p: any) => {
          if (!p.createdAt) return false; 
          const diff = (hoy.getTime() - new Date(p.createdAt).getTime()) / (1000 * 3600 * 24);
          return diff <= 30; 
        });

        if (dropsReales.length === 0) {
          temp = [...this.allProducts].reverse().slice(0, 8);
        } else {
          temp = dropsReales;
        }
        
      } else {
        temp = temp.filter((p: any) => p.tipo?.toLowerCase() === this.categoriaActual.toLowerCase());
      }
    }

    // B. Filtrar por Texto
    if (this.buscarTexto.trim()) {
      const search = this.buscarTexto.toLowerCase();
      temp = temp.filter(p => 
        p.nombre.toLowerCase().includes(search) || 
        p.descripcion.toLowerCase().includes(search)
      );
    }

    // C. Ordenamiento
    if (this.ordenActual === 'precio-bajo') temp.sort((a, b) => a.precio - b.precio);
    else if (this.ordenActual === 'precio-alto') temp.sort((a, b) => b.precio - a.precio);
    else temp.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    this.productsFiltrados = temp;
    this.actualizarPaginacion();
  }

  actualizarPaginacion() {
    this.totalPaginas = Math.ceil(this.productsFiltrados.length / this.itemsPorPagina);
    const inicio = (this.paginaActual - 1) * this.itemsPorPagina;
    this.productsPaginados = this.productsFiltrados.slice(inicio, inicio + this.itemsPorPagina);
    this.cdr.detectChanges();
  }

  cambiarPagina(p: number) {
    this.paginaActual = p;
    this.actualizarPaginacion();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  obtenerImagen(imagen: string): string {
    if (!imagen) return 'assets/placeholder.jpg';
    return imagen.startsWith('http') ? imagen : `http://localhost:8080/${imagen}`;
  }


  abrirModal(producto: any) {
    this.productoSeleccionado = producto;
    this.modalVisible = true;
    // Bloqueamos el scroll del fondo para que la página no se mueva
    document.body.style.overflow = 'hidden';
  }

  cerrarModal() {
    this.modalVisible = false;
    // Devolvemos el scroll a la normalidad
    document.body.style.overflow = 'auto';
    // Le damos 300ms antes de borrar la data para que la animación de cierre se vea fluida
    setTimeout(() => this.productoSeleccionado = null, 300);
  }

  agregarAlCarrito(producto: any, event?: Event) {
    if (event) {
      event.stopPropagation(); 
    }
    
    // Mandamos el producto, cantidad 1, y su talla/color por defecto
    this.cartService.agregar(producto, 1, producto.talla, producto.color);
    
    // Si el modal estaba abierto, lo cerramos para que siga explorando
    if (this.modalVisible) {
      this.cerrarModal();
    }
    
    console.log("¡Arma agregada al arsenal!");
  }

  ngOnDestroy() { 
    this.subs.unsubscribe(); 
  }
}