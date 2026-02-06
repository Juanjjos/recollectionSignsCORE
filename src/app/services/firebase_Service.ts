import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, collectionData, Timestamp } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Firma } from '../models/firma_interface';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  
  constructor(private firestore: Firestore) {}

  // Guardar una firma
  async guardarFirma(firma: Omit<Firma, 'id' | 'fecha'>): Promise<void> {
    try {
      const firmasCollection = collection(this.firestore, 'firmas');
      const firmaConFecha = {
        ...firma,
        fecha: Timestamp.now()
      };
      await addDoc(firmasCollection, firmaConFecha);
    } catch (error) {
      console.error('Error al guardar firma:', error);
      throw error;
    }
  }

  // Obtener todas las firmas (para exportar)
  obtenerFirmas(): Observable<Firma[]> {
    const firmasCollection = collection(this.firestore, 'firmas');
    return collectionData(firmasCollection, { idField: 'id' }) as Observable<Firma[]>;
  }

  // Contar firmas totales
  async contarFirmas(): Promise<number> {
    return new Promise((resolve) => {
      this.obtenerFirmas().subscribe(firmas => {
        resolve(firmas.length);
      });
    });
  }
}