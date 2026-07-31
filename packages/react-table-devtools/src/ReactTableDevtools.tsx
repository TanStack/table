import { createElement } from 'react'
import { createReactPanel } from '@tanstack/devtools-utils/react'
import { TableDevtoolsCore } from '@tanstack/table-devtools'
import type { DevtoolsPanelProps } from '@tanstack/devtools-utils/react'
import type { JSX } from 'react'

export interface TableDevtoolsReactInit extends Partial<DevtoolsPanelProps> {}

type TableDevtoolsPanelComponent = (
  props?: TableDevtoolsReactInit,
) => JSX.Element

const [TableDevtoolsPanelBase, TableDevtoolsPanelNoOpBase] =
  createReactPanel(TableDevtoolsCore)

function resolvePanelProps(props?: TableDevtoolsReactInit): DevtoolsPanelProps {
  return {
    theme: props?.theme ?? 'dark',
    devtoolsOpen: props?.devtoolsOpen ?? false,
  }
}

export const TableDevtoolsPanel: TableDevtoolsPanelComponent = (props) =>
  createElement(TableDevtoolsPanelBase, resolvePanelProps(props))

export const TableDevtoolsPanelNoOp: TableDevtoolsPanelComponent = (props) =>
  createElement(TableDevtoolsPanelNoOpBase, resolvePanelProps(props))
