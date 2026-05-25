import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet, Router } from '@angular/router';
import { AuthService } from '../services/auth'; 

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './perfil.html'
})
export class PerfilComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  cerrarSesion() {
    // 1. Destruimos el token y los datos del usuario en la memoria
    this.authService.logout(); 
    
    // 2. Lo mandamos de vuelta a la pantalla de login (o al inicio '/')
    this.router.navigate(['/login']); 
  }
}