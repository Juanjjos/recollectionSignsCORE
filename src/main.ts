import 'zone.js';

import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app_components';

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));