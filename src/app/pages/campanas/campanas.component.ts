import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FirmaCounterService } from '../../services/firma-counter.service';

@Component({
  selector: 'app-campanas',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './campanas.component.html',
  styleUrls: ['./campanas.component.css']
})
export class CampanasComponent implements OnInit {
  firmasTotales: number = 0;
  metaFirmas: number = 10000;

  constructor(private firmaCounterService: FirmaCounterService) {}

  ngOnInit() {
    this.firmaCounterService.obtenerContador().subscribe(contador => {
      this.firmasTotales = contador;
    });
  }

  get porcentajeProgreso(): number {
    return Math.min((this.firmasTotales / this.metaFirmas) * 100, 100);
  }
}
