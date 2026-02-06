import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { FirebaseService } from '../../services/firebase_Service';

@Component({
  selector: 'app-formulario-firma',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './formulario_firmas.html',
  styleUrl: './formulario_firmas.css'
})
export class Formulario_firmaComponent {
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
    'Ingeniería de Sistemas y Computación',
    'Ingeniería Industrial',
    'Ingeniería Eléctrica',
    'Ingeniería Electrónica',
    'Ingeniería Mecánica',
    'Ingeniería Física',
    'Licenciatura en Español y Literatura',
    'Licenciatura en Pedagogía Infantil',
    'Medicina',
    'Tecnología Química',
    'Administración Ambiental',
    'Administración Industrial',
    'Diseño Industrial',
    'Otro'
  ];

  constructor(
    private fb: FormBuilder,
    private firebaseService: FirebaseService
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
      campana: ['Tarifa Diferencial UTP'],
      comentario: [''],
      aceptaTerminos: [false, [Validators.requiredTrue]]
    });

    // Hacer campo "programa" obligatorio si es estudiante/docente/egresado
    this.firmaForm.get('tipoPersona')?.valueChanges.subscribe(tipo => {
      const programaControl = this.firmaForm.get('programa');
      if (tipo === 'estudiante' || tipo === 'docente' || tipo === 'egresado') {
        programaControl?.setValidators([Validators.required]);
      } else {
        programaControl?.clearValidators();
        programaControl?.setValue('');
      }
      programaControl?.updateValueAndValidity();
    });
  }

  async onSubmit() {
    if (this.firmaForm.valid) {
      this.enviando = true;
      this.error = '';
      this.exitoso = false;

      try {
        await this.firebaseService.guardarFirma(this.firmaForm.value);
        this.exitoso = true;
        this.firmaForm.reset();
        this.firmaForm.patchValue({ 
          ciudad: 'Pereira',
          campana: 'Tarifa Diferencial UTP',
          aceptaTerminos: false 
        });

        // Scroll al mensaje de éxito
        window.scrollTo({ top: 0, behavior: 'smooth' });

        // Ocultar mensaje después de 8 segundos
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
    }
    
    return 'Campo inválido';
  }

  get mostrarPrograma(): boolean {
    const tipo = this.firmaForm.get('tipoPersona')?.value;
    return tipo === 'estudiante' || tipo === 'docente' || tipo === 'egresado';
  }
}