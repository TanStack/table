import { isDevMode, provideBrowserGlobalErrorListeners } from '@angular/core'
import { provideTanStackDevtools } from '@tanstack/angular-devtools/provider'
import { TableDevtoolsPanel } from '@tanstack/angular-table-devtools'
import {
  QueryClient,
  provideTanStackQuery,
} from '@tanstack/angular-query-experimental'
import { provideRouter } from '@angular/router'
import { queryDevtoolsPanel } from './query-devtools-panel'
import { routes } from './app.routes'
import type { ApplicationConfig } from '@angular/core'

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideTanStackQuery(new QueryClient()),
    isDevMode()
      ? provideTanStackDevtools(() => ({
          plugins: [
            {
              name: 'TanStack Table',
              render: TableDevtoolsPanel,
            },
            {
              name: 'TanStack Query',
              render: () => queryDevtoolsPanel,
            },
          ],
        }))
      : [],
  ],
}
