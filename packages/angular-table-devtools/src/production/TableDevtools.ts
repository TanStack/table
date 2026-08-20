import { computed, effect } from '@angular/core'
import { resolveDevtoolsPanelProps } from '@tanstack/table-devtools'
import { TableDevtoolsCore } from '@tanstack/table-devtools/production'
import type { DevtoolsPanelProps } from '@tanstack/devtools-utils/angular'
import type { TableDevtoolsAngularInit } from '../TableDevtools'

function resolvePanelProps(
  props?: TableDevtoolsAngularInit,
): DevtoolsPanelProps {
  return resolveDevtoolsPanelProps(props)
}

type TableDevtoolsPanelComponent = () => (
  inputs: () => TableDevtoolsAngularInit,
  hostElement: HTMLElement,
) => () => void

export const TableDevtoolsPanel: TableDevtoolsPanelComponent =
  () => (props, host) => {
    const panel = host.ownerDocument.createElement('div')
    panel.style.height = '100%'
    host.appendChild(panel)

    const panelProps = computed(() => resolvePanelProps(props()), {
      equal: (previous, next) =>
        previous.theme === next.theme &&
        previous.devtoolsOpen === next.devtoolsOpen,
    })
    const panelEffect = effect((onCleanup) => {
      const instance = new TableDevtoolsCore()
      void instance.mount(panel, panelProps())
      onCleanup(() => instance.unmount())
    })

    return () => {
      panelEffect.destroy()
      panel.remove()
    }
  }
