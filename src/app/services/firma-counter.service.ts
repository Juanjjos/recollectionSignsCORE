import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { FirebaseService } from './firebase_Service';

@Injectable({
  providedIn: 'root'
})
export class FirmaCounterService implements OnDestroy {
  private firmasSubject = new BehaviorSubject<number>(0);
  public firmas$ = this.firmasSubject.asObservable();
  private subscription?: Subscription;

  constructor(private firebaseService: FirebaseService) {
    this.iniciarListener();
  }

  private iniciarListener() {
    this.subscription = this.firebaseService.contadorObservable().subscribe({
      next: (total) => {
        console.log('✅ FirmaCounterService recibió:', total);
        this.firmasSubject.next(total);
      },
      error: (err) => {
        console.error('❌ Error en listener de contador:', err);
        // Reintentar después de 3 segundos si hay error
        setTimeout(() => this.iniciarListener(), 3000);
      },
      complete: () => {
        // Si el observable se completa inesperadamente, reiniciar
        console.warn('⚠️ Listener completado inesperadamente, reiniciando...');
        setTimeout(() => this.iniciarListener(), 1000);
      }
    });
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  incrementarContador() {
    this.firmasSubject.next(this.firmasSubject.value + 1);
  }

  obtenerContador(): Observable<number> {
    return this.firmas$;
  }
}