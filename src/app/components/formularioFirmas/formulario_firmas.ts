import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { FirebaseService } from '../../services/firebase_Service';
import { FirmaCounterService } from '../../services/firma-counter.service';

@Component({
  selector: 'app-formulario-firma',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './formulario_firmas.html',
  styleUrls: ['./formulario_firmas.css']
})
export class Formulario_firmaComponent {
  @Output() firmaGuardada = new EventEmitter<void>(); // ← NUEVO

  firmaForm: FormGroup;
  enviando: boolean = false;
  exitoso: boolean = false;
  error: string = '';

  tiposPersona = [
    { valor: 'estudiante', label: 'Estudiante UTP' },
    { valor: 'docente', label: 'Docente UTP' },
    { valor: 'egresado', label: 'Egresado UTP' },
    { valor: 'ciudadano', label: 'Ciudadano/a' }
  ];

  programasAcademicos = [
    'Administración Ambiental',
    'Administración de Empresas - Jornada especial',
    'Administración del Turismo Sostenible',
    'Administración Industrial',
    'Ciencias del Deporte y la Recreación',
    'Física',
    'Ingeniería Civil',
    'Ingeniería de Manufactura',
    'Ingeniería de Sistemas y Computación',
    'Ingeniería de Sistemas y Computación - Jornada especial',
    'Ingeniería Eléctrica',
    'Ingeniería Electrónica',
    'Ingeniería Física',
    'Ingeniería Industrial',
    'Ingeniería Industrial - Jornada especial',
    'Ingeniería Mecánica',
    'Ingeniería Mecatrónica',
    'Ingeniería en Procesos Agroindustriales',
    'Ingeniería en Procesos Sostenibles de las Maderas',
    'Licenciatura en Artes Visuales',
    'Licenciatura en Bilingüismo con Énfasis en Inglés',
    'Licenciatura en Ciencias Sociales',
    'Licenciatura en Educación Básica Primaria',
    'Licenciatura en Educación Infantil',
    'Licenciatura en Etnoeducación',
    'Licenciatura en Filosofía',
    'Licenciatura en Literatura y Lengua Castellana',
    'Licenciatura en Música',
    'Licenciatura en Tecnología',
    'Matemáticas',
    'Medicina',
    'Medicina Veterinaria y Zootecnia',
    'Química Industrial',
    'Tecnología Eléctrica',
    'Tecnología en Atención Prehospitalaria',
    'Tecnología en Desarrollo de Procesos Químicos Sostenibles',
    'Tecnología en Desarrollo del Software',
    'Tecnología en Diseño y Construcción de Instalaciones Eléctricas de Media y Baja Tensión',
    'Tecnología en Gestión del Turismo Sostenible',
    'Tecnología en Gestión Logística',
    'Tecnología en Procesos de Fabricación Metalmecánica',
    'Tecnología en Producción Agrícola',
    'Tecnología en Producción Agrícola Integrada',
    'Tecnología en Producción Forestal',
    'Tecnología en Regencia de Farmacia',
    'Tecnología Industrial',
    'Tecnología Química'
  ];
  
  semestres = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14
  ];

  constructor(
    private fb: FormBuilder,
    private firebaseService: FirebaseService,
    private firmaCounterService: FirmaCounterService
  ) {
    this.firmaForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      apellido: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      telefono: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      ciudad: ['Pereira', [Validators.required]],
      cedula: ['', [Validators.required, Validators.pattern(/^[0-9]{6,10}$/)]],
      tipoPersona: ['', [Validators.required]],
      programa: [''],
      semestre: [''],
      semestreOtro: [''],
      fechaNacimiento: ['', [Validators.required]],
      campana: ['Tarifa Diferencial UTP'],
      comentario: [''],
      aceptaTerminos: [false, [Validators.requiredTrue]]
    });

    this.firmaForm.get('tipoPersona')?.valueChanges.subscribe(tipo => {
      const programaControl = this.firmaForm.get('programa');
      const semestreControl = this.firmaForm.get('semestre');

      if (tipo === 'estudiante' || tipo === 'docente' || tipo === 'egresado') {
        programaControl?.setValidators([Validators.required]);
      } else {
        programaControl?.clearValidators();
        programaControl?.setValue('');
      }

      if (tipo === 'estudiante') {
        semestreControl?.setValidators([Validators.required]);
      } else {
        semestreControl?.clearValidators();
        semestreControl?.setValue('');
      }

      programaControl?.updateValueAndValidity();
      semestreControl?.updateValueAndValidity();
    });

    // Cuando el usuario selecciona "Otro" en el select de semestre, activar
    // el control `semestreOtro` con validación numérica (número entero positivo).
    this.firmaForm.get('semestre')?.valueChanges.subscribe(value => {
      const semestreOtroControl = this.firmaForm.get('semestreOtro');
      if (value === 'Otro') {
        semestreOtroControl?.setValidators([Validators.required, Validators.pattern(/^[1-9][0-9]*$/)]);
      } else {
        semestreOtroControl?.clearValidators();
        semestreOtroControl?.setValue('');
      }
      semestreOtroControl?.updateValueAndValidity();
    });
  }

  async onSubmit() {
    if (this.firmaForm.valid) {
      this.enviando = true;
      this.error = '';
      this.exitoso = false;

      try {
        // Construir payload — si el usuario eligió "Otro" usar el valor numérico de `semestreOtro`.
        const payload = { ...this.firmaForm.value } as any;
        if (payload.semestre === 'Otro') {
          payload.semestre = Number(payload.semestreOtro);
        }

        await this.firebaseService.guardarFirma(payload);
        this.exitoso = true;
        this.firmaGuardada.emit(); // ← EMITIR EVENTO
        this.firmaCounterService.incrementarContador(); // ← NOTIFICAR AL SERVICIO

        // Resetear formulario (incluyendo semestreOtro)
        this.firmaForm.reset();
        this.firmaForm.patchValue({ 
          ciudad: 'Pereira',
          campana: 'Tarifa Diferencial UTP',
          aceptaTerminos: false 
        });

        window.scrollTo({ top: 0, behavior: 'smooth' });

        setTimeout(() => {
          this.exitoso = false;
        }, 8000);

      } catch (err) {
        this.error = 'Hubo un error al guardar tu firma. Por favor intenta de nuevo.';
        console.error('Error:', err);
      } finally {
        this.enviando = false;
      }
    } else {
      this.marcarCamposComoTocados();
    }
  }

  private marcarCamposComoTocados() {
    Object.keys(this.firmaForm.controls).forEach(key => {
      this.firmaForm.get(key)?.markAsTouched();
    });
  }

  esInvalido(campo: string): boolean {
    const control = this.firmaForm.get(campo);
    return !!(control && control.invalid && control.touched);
  }

  obtenerMensajeError(campo: string): string {
    const control = this.firmaForm.get(campo);
    if (!control || !control.errors) return '';

    if (control.errors['required']) return 'Este campo es obligatorio';
    if (control.errors['email']) return 'Email inválido';
    if (control.errors['minlength']) return `Mínimo ${control.errors['minlength'].requiredLength} caracteres`;
    if (control.errors['pattern']) {
      if (campo === 'telefono') return 'Debe tener 10 dígitos';
      if (campo === 'cedula') return 'Cédula inválida (6-10 dígitos)';
      if (campo === 'semestreOtro') return 'Ingresa un número de semestre válido (ej. 16)';
    }
    
    return 'Campo inválido';
  }

  get mostrarPrograma(): boolean {
    const tipo = this.firmaForm.get('tipoPersona')?.value;
    return tipo === 'estudiante' || tipo === 'docente' || tipo === 'egresado';
  }

  get mostrarSemestre(): boolean {
    const tipo = this.firmaForm.get('tipoPersona')?.value;
    return tipo === 'estudiante';
  }
}