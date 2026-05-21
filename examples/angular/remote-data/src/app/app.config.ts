import {
  provideClientHydration,
  withEventReplay,
  withHttpTransferCacheOptions,
} from '@angular/platform-browser'
import { isDevMode, provideBrowserGlobalErrorListeners } from '@angular/core'
import { provideTanStackDevtools } from '@tanstack/angular-devtools/provider'
import type { ApplicationConfig } from '@angular/core'

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideClientHydration(
      withEventReplay(),
      withHttpTransferCacheOptions({
        includeHeaders: ['X-Total-Count'],
      }),
    ),
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
