import { isDevMode, provideBrowserGlobalErrorListeners } from '@angular/core'
import { provideTanStackDevtools } from '@tanstack/angular-devtools/provider'
import {
  QueryClient,
  provideTanStackQuery,
} from '@tanstack/angular-query-experimental'
import { provideRouter } from '@angular/router'
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
              render: () =>
                import('@tanstack/angular-table-devtools').then((m) =>
                  m.TableDevtoolsPanel(),
                ),
            },
          ],
        }))
      : [],
  ],
}
