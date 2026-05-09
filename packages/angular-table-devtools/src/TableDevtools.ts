import { TableDevtoolsCore } from '@tanstack/table-devtools'
import { createAngularPanel } from '@tanstack/devtools-utils/angular'
import type { DevtoolsPanelProps } from '@tanstack/devtools-utils/angular'

export interface TableDevtoolsAngularInit extends Partial<DevtoolsPanelProps> {}

const [TableDevtoolsPanelBase, TableDevtoolsPanelNoOpBase] =
  createAngularPanel(TableDevtoolsCore)

function resolvePanelProps(
  props?: TableDevtoolsAngularInit,
): DevtoolsPanelProps {
  return {
    theme: props?.theme ?? 'dark',
    devtoolsOpen: props?.devtoolsOpen ?? false,
  }
}

type TableDevtoolsPanelComponent = () => (
  inputs: () => TableDevtoolsAngularInit,
  hostElement: HTMLElement,
) => () => void

export const TableDevtoolsPanel: TableDevtoolsPanelComponent =
  () => (props, host) => {
    const panel = TableDevtoolsPanelBase()
    return panel(() => resolvePanelProps(props()), host)
  }

export const TableDevtoolsPanelNoOp: TableDevtoolsPanelComponent =
  () => (props, host) => {
    const panel = TableDevtoolsPanelNoOpBase()
    return () => panel
  }
