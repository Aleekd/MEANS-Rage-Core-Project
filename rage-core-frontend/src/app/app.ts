import { Component, signal } from '@angular/core';
import { HeaderComponent } from './header/header';
import { RouterOutlet } from '@angular/router';
import { Footer } from './footer/footer';

@Component({
  selector: 'app-root',
  imports: [ HeaderComponent, RouterOutlet, Footer],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('rage-core-frontend');
}
