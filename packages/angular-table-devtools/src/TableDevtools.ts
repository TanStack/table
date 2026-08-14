import {
  TableDevtoolsCore,
  resolveDevtoolsPanelProps,
  seedDevtoolsFontStyle,
} from '@tanstack/table-devtools'
import { computed, effect } from '@angular/core'
import type { DevtoolsPanelProps } from '@tanstack/devtools-utils/angular'

seedDevtoolsFontStyle()

export interface TableDevtoolsAngularInit extends Partial<DevtoolsPanelProps> {}

export function resolvePanelProps(
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
    seedDevtoolsFontStyle(host.ownerDocument)
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

export const TableDevtoolsPanelNoOp: TableDevtoolsPanelComponent =
  () => (_props, _host) => () => {}
