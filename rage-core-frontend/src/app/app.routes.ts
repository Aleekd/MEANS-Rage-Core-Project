import { Routes } from '@angular/router';
import { ContentComponent } from './content/content';
import { CatalogoComponent } from './catalogo/catalogo';
import { LoginComponent } from './login/login';
import { AdminComponent } from './admin/admin';


// Imports de Administración
import { DashboardComponent } from './admin/dashboard/dashboard';
import { OrdenesComponent } from './admin/ordenes/ordenes';
import { CuponesComponent } from './admin/cupones/cupones';
import { UsuariosComponent } from './admin/usuarios/usuarios';
import { ProductosComponent } from './admin/productos/productos';
import { InventarioComponent } from './admin/inventario/inventario'; 

import { PerfilComponent } from './perfil/perfil';
import { DatosComponent } from './perfil/datos/datos';
import { PedidosComponent } from './perfil/pedidos/pedidos';
import { SeguridadComponent } from './perfil/seguridad/seguridad';
import { CarritoComponent } from './carrito/carrito';

import { CheckoutComponent } from './checkout/checkout';

export const routes: Routes = [
  { path: '', component: ContentComponent },
  { path: 'catalogo', component: CatalogoComponent },
  { path: 'login', component: LoginComponent },
  { path: 'carrito', component: CarritoComponent },
  { path: 'checkout', component: CheckoutComponent },
  // ÁREA ADMINISTRATIVA (El Cascarón)
  { 
    path: 'admin', 
    component: AdminComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }, 
      { path: 'dashboard', component: DashboardComponent },
      { path: 'ordenes', component: OrdenesComponent },
      { path: 'cupones', component: CuponesComponent },
      { path: 'usuarios', component: UsuariosComponent },
      { path: 'productos', component: ProductosComponent },
      { path: 'inventario', component: InventarioComponent },
    ]
  },
  
  { 
    path: 'perfil', 
    component: PerfilComponent,
    children: [
      { path: '', redirectTo: 'datos', pathMatch: 'full' },
      { path: 'datos', component: DatosComponent },
      { path: 'pedidos', component: PedidosComponent },
      { path: 'seguridad', component: SeguridadComponent }
    ]
  },
  
  { path: '**', redirectTo: '' } 
];