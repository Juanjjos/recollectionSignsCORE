import { Routes } from '@angular/router';
import { InicioComponent } from './pages/inicio/inicio.component';
import { NosotrosComponent } from './pages/nosotros/nosotros.component';
import { LogrosComponent } from './pages/logros/logros.component';
import { CampanasComponent } from './pages/campanas/campanas.component';
import { AportesComponent } from './pages/aportes/aportes.component';
import { FirmasComponent } from './pages/firmas/firmas.component';

export const routes: Routes = [
  { path: '', component: InicioComponent },
  { path: 'nosotros', component: NosotrosComponent },
  { path: 'logros', component: LogrosComponent },
  { path: 'campanas', component: CampanasComponent },
  { path: 'aportes', component: AportesComponent },
  { path: 'firmas', component: FirmasComponent },
  { path: '**', redirectTo: '' }
];