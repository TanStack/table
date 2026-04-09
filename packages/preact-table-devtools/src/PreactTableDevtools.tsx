import { createPreactPanel } from '@tanstack/devtools-utils/preact'
import { TableDevtoolsCore } from '@tanstack/table-devtools'
import type { DevtoolsPanelProps } from '@tanstack/devtools-utils/preact'
import type { JSX } from 'preact'

export interface TableDevtoolsPreactInit extends DevtoolsPanelProps {}

type TableDevtoolsPanelComponent = (
  props: TableDevtoolsPreactInit,
) => JSX.Element

const [TableDevtoolsPanelBase, TableDevtoolsPanelNoOpBase] =
  createPreactPanel(TableDevtoolsCore)

export const TableDevtoolsPanel: TableDevtoolsPanelComponent =
  TableDevtoolsPanelBase as TableDevtoolsPanelComponent

export const TableDevtoolsPanelNoOp: TableDevtoolsPanelComponent =
  TableDevtoolsPanelNoOpBase as TableDevtoolsPanelComponent
