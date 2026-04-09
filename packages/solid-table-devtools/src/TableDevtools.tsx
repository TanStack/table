import { createSolidPanel } from '@tanstack/devtools-utils/solid'
import { TableDevtoolsCore } from '@tanstack/table-devtools'
import type { DevtoolsPanelProps } from '@tanstack/devtools-utils/solid'
import type { JSX } from 'solid-js'

export interface TableDevtoolsSolidInit extends DevtoolsPanelProps {}

type TableDevtoolsPanelComponent = (
  props: TableDevtoolsSolidInit,
) => JSX.Element

const [TableDevtoolsPanelBase, TableDevtoolsPanelNoOpBase] =
  createSolidPanel(TableDevtoolsCore)

export const TableDevtoolsPanel: TableDevtoolsPanelComponent =
  TableDevtoolsPanelBase as TableDevtoolsPanelComponent

export const TableDevtoolsPanelNoOp: TableDevtoolsPanelComponent =
  TableDevtoolsPanelNoOpBase as TableDevtoolsPanelComponent
