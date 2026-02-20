import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Router } from '@angular/router';
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
  maxFecha: string = ''; 

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

  facultades = [
    'Bellas Artes y Humanidades',
    'Ciencias Agrarias y Agroindustria',
    'Ciencias Ambientales',
    'Ciencias Básicas',
    'Ciencias de la Educación',
    'Ciencias de la Salud',
    'Ciencias Empresariales',
    'Ingenierías',
    'Mecánica Aplicada',
    'Tecnología'
  ];
  
  semestres = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14
  ];

  constructor(
    private fb: FormBuilder,
    private firebaseService: FirebaseService,
    private firmaCounterService: FirmaCounterService,
    private router: Router
  ) {
    this.firmaForm = this.fb.group({
          nombre: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50), Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s]+$/)]],
          apellido: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50), Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s]+$/)]],
          email: ['', [Validators.required, Validators.email]],
          telefono: ['', [Validators.required, Validators.pattern(/^3[0-9]{9}$/)]],
      ciudad: ['Pereira', [Validators.required]],
      cedula: ['', [Validators.required, Validators.pattern(/^[0-9]{6,10}$/)]],
      tipoPersona: ['', [Validators.required]],
      programa: [''],
      semestre: [''],
      fechaNacimiento: ['', [Validators.required, this.fechaNacimientoValidator(15)]],
      campana: ['Tarifa Diferencial UTP'],
      comentario: [''],
      aceptaTerminos: [false, [Validators.requiredTrue]]
    });

    // establecer maxFecha para el input type="date" (UX: bloquear fechas futuras)
    this.maxFecha = this.formatDate(new Date());

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
  }

  async onSubmit() {
    if (this.firmaForm.valid) {
      this.enviando = true;
      this.error = '';
      this.exitoso = false;

      try {
        const payload = { ...this.firmaForm.value };
        await this.firebaseService.guardarFirma(payload);
        this.exitoso = true;
        this.firmaGuardada.emit(); // ← EMITIR EVENTO
        this.firmaCounterService.incrementarContador(); // ← NOTIFICAR AL SERVICIO

        // Navegar a la página de aportes y abrir el modal de donación
        try {
          await this.router.navigate(['/aportes'], { queryParams: { donate: 'true' } });
        } catch (navErr) {
          console.warn('No se pudo navegar a /aportes:', navErr);
        }

        // Resetear formulario
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
        if (control.errors['maxlength']) return `Máximo ${control.errors['maxlength'].requiredLength} caracteres`;
        if (control.errors['pattern']) {
          if (campo === 'telefono') return 'Teléfono inválido (debe tener 10 dígitos y empezar por 3)';
          if (campo === 'cedula') return 'Cédula inválida (6-10 dígitos)';
          if (campo === 'nombre' || campo === 'apellido') return 'Nombre/Apellido inválido (solo letras y espacios, sin números ni símbolos)';
        }
    if (control.errors['futureDate']) return 'La fecha no puede ser en el futuro';
    if (control.errors['minAge']) return 'Debes tener al menos 15 años';

    return 'Campo inválido';
  }

  // Validador: no permitir fechas futuras y exigir edad >= 15 años
  fechaNacimientoValidator(minYearsInclusive: number): ValidatorFn {
    return (control: AbstractControl) => {
      const value = control.value;
      if (!value) return null;
      const dob = new Date(value);
      if (isNaN(dob.getTime())) return { invalidDate: true };
      const today = new Date();
      const dobMid = new Date(dob.getFullYear(), dob.getMonth(), dob.getDate());
      const todayMid = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      if (dobMid > todayMid) return { futureDate: true };
      const age = this.calculateAge(dobMid, todayMid);
      if (age < minYearsInclusive) return { minAge: true };
      return null;
    };
  }

  private calculateAge(birthDate: Date, now = new Date()): number {
    let age = now.getFullYear() - birthDate.getFullYear();
    const m = now.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && now.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }

  private formatDate(date: Date): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  get mostrarPrograma(): boolean {
    const tipo = this.firmaForm.get('tipoPersona')?.value;
    return (tipo === 'estudiante' || tipo === 'egresado');
  }

  get mostrarFacultad(): boolean {
    const tipo = this.firmaForm.get('tipoPersona')?.value;
    return tipo === 'docente';
  }

  get mostrarSemestre(): boolean {
    const tipo = this.firmaForm.get('tipoPersona')?.value;
    return tipo === 'estudiante';
  }
}