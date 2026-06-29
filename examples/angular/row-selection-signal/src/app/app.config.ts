import { isDevMode } from '@angular/core'
import { provideTanStackDevtools } from '@tanstack/angular-devtools/provider'
import type { ApplicationConfig } from '@angular/core'

export const appConfig: ApplicationConfig = {
  providers: [
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
