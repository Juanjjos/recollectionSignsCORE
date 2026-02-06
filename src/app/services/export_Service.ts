import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import { Firma } from '../models/firma_interface';

@Injectable({
  providedIn: 'root'
})
export class ExportService {

  exportarAExcel(firmas: Firma[], nombreArchivo: string = 'firmas-tarifa-diferencial-utp'): void {
    // Preparar datos para Excel
    const datosExcel = firmas.map(firma => ({
      'Nombre': firma.nombre,
      'Apellido': firma.apellido,
      'Email': firma.email,
      'Teléfono': firma.telefono,
      'Ciudad': firma.ciudad,
      'Cédula': firma.cedula,
      'Tipo de Persona': firma.tipoPersona,
      'Programa Académico': firma.programa || 'N/A',
      'Comentario': firma.comentario || 'Sin comentario',
      'Fecha': this.formatearFecha(firma.fecha),
      'Acepta Términos': firma.aceptaTerminos ? 'Sí' : 'No'
    }));

    // Crear libro de Excel
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(datosExcel);
    const workbook: XLSX.WorkBook = {
      Sheets: { 'Firmas': worksheet },
      SheetNames: ['Firmas']
    };

    // Ajustar ancho de columnas
    const columnas = [
      { wch: 15 }, // Nombre
      { wch: 15 }, // Apellido
      { wch: 30 }, // Email
      { wch: 15 }, // Teléfono
      { wch: 20 }, // Ciudad
      { wch: 15 }, // Cédula
      { wch: 15 }, // Tipo
      { wch: 30 }, // Programa
      { wch: 40 }, // Comentario
      { wch: 20 }, // Fecha
      { wch: 15 }  // Términos
    ];
    worksheet['!cols'] = columnas;

    // Descargar archivo
    const fechaHoy = new Date().toISOString().split('T')[0];
    XLSX.writeFile(workbook, `${nombreArchivo}_${fechaHoy}.xlsx`);
  }

  private formatearFecha(timestamp: any): string {
    if (!timestamp) return 'Sin fecha';
    
    if (timestamp.toDate) {
      const fecha = timestamp.toDate();
      return fecha.toLocaleString('es-CO');
    }
    
    if (timestamp instanceof Date) {
      return timestamp.toLocaleString('es-CO');
    }
    
    return 'Fecha inválida';
  }
}