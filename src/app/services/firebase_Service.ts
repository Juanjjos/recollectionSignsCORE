import { Injectable, inject, EnvironmentInjector, runInInjectionContext } from '@angular/core';
import { 
  Firestore, 
  collection, 
  addDoc, 
  getDocs, 
  Timestamp, 
  doc, 
  getDoc,
  onSnapshot,
  DocumentReference
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Firma } from '../models/firma_interface';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  private firestore: Firestore = inject(Firestore);
  private injector: EnvironmentInjector = inject(EnvironmentInjector); // ← AGREGAR

  async guardarFirma(firma: Omit<Firma, 'id' | 'fecha'>): Promise<void> {
    try {
      const firmasCollection = collection(this.firestore, 'firmas');
      const firmaConFecha = { ...firma, fecha: Timestamp.now() };
      await addDoc(firmasCollection, firmaConFecha);
      console.log('✅ Firma guardada exitosamente');
    } catch (error) {
      console.error('❌ Error al guardar firma:', error);
      throw error;
    }
  }

  contadorObservable(): Observable<number> {
    return new Observable<number>((observer) => {
      const docRef = doc(this.firestore, 'estadisticas', 'contador') as DocumentReference;
      
      // ← ENVOLVER con runInInjectionContext para corregir el warning
      let unsubscribe: () => void;

      runInInjectionContext(this.injector, () => {
        unsubscribe = onSnapshot(
          docRef,
          (snapshot) => {
            if (snapshot.exists()) {
              const data = snapshot.data();
              const total = data?.['total'] || 0;
              console.log('📊 Contador actualizado:', total);
              observer.next(Number(total));
            } else {
              console.warn('⚠️ Documento contador no existe');
              observer.next(0);
            }
          },
          (error) => {
            console.error('❌ Error en listener del contador:', error);
            observer.error(error);
          }
        );
      });

      return () => {
        console.log('🔌 Desconectando listener del contador');
        unsubscribe();
      };
    });
  }

  async obtenerContadorUnaVez(): Promise<number> {
    try {
      const docRef = doc(this.firestore, 'estadisticas', 'contador');
      const snapshot = await getDoc(docRef);
      if (snapshot.exists()) {
        const total = snapshot.data()?.['total'] || 0;
        return Number(total);
      }
      return 0;
    } catch (error) {
      console.error('❌ Error al obtener contador:', error);
      return 0;
    }
  }
}