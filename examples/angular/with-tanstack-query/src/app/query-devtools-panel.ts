import { ElementRef } from '@angular/core'
import { injectDevtoolsPanel } from '@tanstack/angular-query-experimental/devtools-panel'
import type { TanStackDevtoolsAngularFunctionalComponent } from '@tanstack/angular-devtools'

export const queryDevtoolsPanel: TanStackDevtoolsAngularFunctionalComponent =
  (_inputs, hostElement) => {
    const panel = injectDevtoolsPanel(() => ({
      hostElement: new ElementRef(hostElement),
    }))

    return () => panel.destroy()
  }
