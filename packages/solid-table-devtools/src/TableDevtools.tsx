import { createSolidPanel } from '@tanstack/devtools-utils/solid'
import { TableDevtoolsCore } from '@tanstack/table-devtools'
import type { DevtoolsPanelProps } from '@tanstack/devtools-utils/solid'
import type { JSX } from 'solid-js'

export interface TableDevtoolsSolidInit extends Partial<DevtoolsPanelProps> {}

type TableDevtoolsPanelComponent = (
  props?: TableDevtoolsSolidInit,
) => JSX.Element

const [TableDevtoolsPanelBase, TableDevtoolsPanelNoOpBase] =
  createSolidPanel(TableDevtoolsCore)

function resolvePanelProps(props?: TableDevtoolsSolidInit): DevtoolsPanelProps {
  return {
    theme: props?.theme ?? 'dark',
    devtoolsOpen: props?.devtoolsOpen ?? false,
  }
}

export const TableDevtoolsPanel: TableDevtoolsPanelComponent = (props) =>
  TableDevtoolsPanelBase(resolvePanelProps(props))

export const TableDevtoolsPanelNoOp: TableDevtoolsPanelComponent = (props) =>
  TableDevtoolsPanelNoOpBase(resolvePanelProps(props))
