import { Routes } from '@angular/router';
import { Formulario_firmaComponent } from './components/formularioFirmas/formulario_firmas';

export const routes: Routes = [
  { path: '', component: Formulario_firmaComponent },
  { path: '**', redirectTo: '' }
];