import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FirebaseService } from '../../services/firebase_Service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header_component.html',
  styleUrls: ['./header_component.css']
})
export class HeaderComponent implements OnInit {
  firmasTotales: number = 0;
  metaFirmas: number = 10000;

  constructor(private firebaseService: FirebaseService) {}

  ngOnInit() {
    this.firebaseService.obtenerFirmas().subscribe(firmas => {
      this.firmasTotales = firmas.length;
    });
  }

  get porcentajeProgreso(): number {
    return Math.min((this.firmasTotales / this.metaFirmas) * 100, 100);
  }
}