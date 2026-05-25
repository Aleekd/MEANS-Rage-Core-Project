import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin-layout', 
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin.html' 
})


export class AdminComponent implements OnInit {
  isAdmin: boolean = false;
  isStaff: boolean = false; 
  rolActual: string = 'cliente';

  ngOnInit() {
    // Obtenemos el rol
    this.rolActual = localStorage.getItem('rol') || 'cliente';
    
    // Evaluamos permisos
    if (this.rolActual === 'admin') {
      this.isAdmin = true;
      this.isStaff = false;
    } else if (this.rolActual === 'staff') {
      this.isAdmin = false;
      this.isStaff = true;
    }
  }

  cerrarSesion() {
    sessionStorage.removeItem('token'); 
    localStorage.removeItem('token'); 
  }
}