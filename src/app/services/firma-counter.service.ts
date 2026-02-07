import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { FirebaseService } from './firebase_Service';

@Injectable({
  providedIn: 'root'
})
export class FirmaCounterService {
  private firmasSubject = new BehaviorSubject<number>(0);
  public firmas$ = this.firmasSubject.asObservable();

  constructor(private firebaseService: FirebaseService) {
    this.cargarContador();
  }

  async cargarContador() {
    try {
      const firmas = await this.firebaseService.obtenerFirmas();
      this.firmasSubject.next(firmas.length);
    } catch (error) {
      console.error('Error al cargar contador:', error);
    }
  }

  incrementarContador() {
    const contador = this.firmasSubject.value;
    this.firmasSubject.next(contador + 1);
  }

  obtenerContador(): Observable<number> {
    return this.firmas$;
  }
}
