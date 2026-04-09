import { createReactPanel } from '@tanstack/devtools-utils/react'
import { TableDevtoolsCore } from '@tanstack/table-devtools'
import type { DevtoolsPanelProps } from '@tanstack/devtools-utils/react'
import type { JSX } from 'react'

export interface TableDevtoolsReactInit extends DevtoolsPanelProps {}

type TableDevtoolsPanelComponent = (
  props: TableDevtoolsReactInit,
) => JSX.Element

const [TableDevtoolsPanelBase, TableDevtoolsPanelNoOpBase] =
  createReactPanel(TableDevtoolsCore)

export const TableDevtoolsPanel: TableDevtoolsPanelComponent =
  TableDevtoolsPanelBase as TableDevtoolsPanelComponent

export const TableDevtoolsPanelNoOp: TableDevtoolsPanelComponent =
  TableDevtoolsPanelNoOpBase as TableDevtoolsPanelComponent
