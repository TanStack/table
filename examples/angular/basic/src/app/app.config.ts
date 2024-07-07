import { provideRouter } from '@angular/router'

import { routes } from './app.routes'
import type { ApplicationConfig } from '@angular/core'

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes)],
}
