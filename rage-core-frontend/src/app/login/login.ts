import { Component, inject } from '@angular/core';
import { Router, RouterLink, ActivatedRoute } from '@angular/router'; // 🔥 Agregamos ActivatedRoute
import { FormsModule } from '@angular/forms'; 
import { AuthService } from '../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './login.html'
})
export class LoginComponent {
  correo = '';
  password = '';

  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute); 

  iniciarSesion() {
    this.authService.login(this.correo, this.password).subscribe({
      next: (res) => {
        const rol = this.authService.getRol();
        
        if (rol === 'admin' || rol === 'staff') {
          this.router.navigate(['/admin']); 
        } else {

          const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
          this.router.navigateByUrl(returnUrl); 
        }
      },
      error: (err) => {
        console.error(err);
        alert('Credenciales incorrectas. La resistencia no te reconoce.');
      }
    });
  }
}