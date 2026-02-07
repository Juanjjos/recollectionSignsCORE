import { Injectable, inject } from '@angular/core';
import { Firestore, collection, addDoc, getDocs, Timestamp } from '@angular/fire/firestore';
import { Firma } from '../models/firma_interface';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  private firestore: Firestore = inject(Firestore);

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
  async obtenerFirmas(): Promise<Firma[]> {
    try {
      const firmasCollection = collection(this.firestore, 'firmas');
      const snapshot = await getDocs(firmasCollection);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Firma));
    } catch (error) {
      console.error('Error al obtener firmas:', error);
      return [];
    }
  }

  // Contar firmas totales
  async contarFirmas(): Promise<number> {
    const firmas = await this.obtenerFirmas();
    return firmas.length;
  }
}