import {
  provideClientHydration,
  withEventReplay,
} from '@angular/platform-browser'
import type { ApplicationConfig } from '@angular/core'

export const appConfig: ApplicationConfig = {
  providers: [provideClientHydration(withEventReplay())],
}
