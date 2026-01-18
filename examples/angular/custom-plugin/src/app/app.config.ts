import { provideBrowserGlobalErrorListeners } from '@angular/core'

import type { ApplicationConfig } from '@angular/core'

export const appConfig: ApplicationConfig = {
  providers: [provideBrowserGlobalErrorListeners()],
}
