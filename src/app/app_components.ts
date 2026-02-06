import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/headers/header_component';
import { FirebaseService } from './services/firebase_Service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, HeaderComponent], // ← ASEGÚRATE DE TENER HeaderComponent aquí
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class AppComponent implements OnInit {
  firmasTotales: number = 0;

  constructor(private firebaseService: FirebaseService) {}

  ngOnInit() {
    this.firebaseService.obtenerFirmas().subscribe(firmas => {
      this.firmasTotales = firmas.length;
    });
  }
}