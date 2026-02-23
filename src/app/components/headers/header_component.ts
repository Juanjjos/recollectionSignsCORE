import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FirmaCounterService } from '../../services/firma-counter.service'; // ← CAMBIAR import
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header_component.html',
  styleUrl: './header_component.css'
})
export class HeaderComponent implements OnInit, OnDestroy {
  firmasTotales: number = 0;
  metaFirmas: number = 10000;
  private subscription?: Subscription;

  constructor(private firmaCounterService: FirmaCounterService) {} // ← CAMBIAR

  ngOnInit() {
    this.subscription = this.firmaCounterService.obtenerContador().subscribe({ // ← CAMBIAR
      next: (total) => {
        this.firmasTotales = total;
      },
      error: (error) => {
        console.error('❌ Error en suscripción del contador:', error);
        this.firmasTotales = 0;
      }
    });
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  get porcentajeProgreso(): number {
    return Math.min((this.firmasTotales / this.metaFirmas) * 100, 100);
  }
}