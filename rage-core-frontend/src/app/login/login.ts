import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink], 
  templateUrl: '../login/login.html'
})

export class LoginComponent {
  onLogin() {
    console.log("Iniciando sesion en Rage Core...");
  }
}