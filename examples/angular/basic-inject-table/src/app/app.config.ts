import { provideRouter } from '@angular/router'
import { provideBrowserGlobalErrorListeners } from '@angular/core'
import { routes } from './app.routes'
import type { ApplicationConfig } from '@angular/core'

export const appConfig: ApplicationConfig = {
  providers: [provideBrowserGlobalErrorListeners(), provideRouter(routes)],
}
