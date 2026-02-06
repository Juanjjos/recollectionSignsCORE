//Se realiza la cracion de la interfaz para la recolección de firmas 
export interface Firma {
  id?: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  ciudad: string;
  cedula: string;
  tipoPersona: string; // 'estudiante', 'docente', 'egresado', 'ciudadano'
  programa?: string; // Solo si es estudiante/docente/egresado
  campana: string;
  comentario?: string;
  fecha: any; // Firestore Timestamp
  aceptaTerminos: boolean;
}