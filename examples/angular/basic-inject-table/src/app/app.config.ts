import { isDevMode, provideBrowserGlobalErrorListeners } from '@angular/core'
import { provideTanStackDevtools } from '@tanstack/angular-devtools/provider'
import { TableDevtoolsPanel } from '@tanstack/angular-table-devtools'
import { provideRouter } from '@angular/router'
import { routes } from './app.routes'
import type { ApplicationConfig } from '@angular/core'

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    isDevMode()
      ? provideTanStackDevtools(() => ({
          plugins: [
            {
              name: 'TanStack Table',
              render: TableDevtoolsPanel,
            },
          ],
        }))
      : [],
  ],
}
