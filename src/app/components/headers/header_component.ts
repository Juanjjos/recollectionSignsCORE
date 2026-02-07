import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FirmaCounterService } from '../../services/firma-counter.service';

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