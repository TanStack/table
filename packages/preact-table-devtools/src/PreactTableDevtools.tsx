import { h } from 'preact'
import { createPreactPanel } from '@tanstack/devtools-utils/preact'
import { TableDevtoolsCore } from '@tanstack/table-devtools'
import type { DevtoolsPanelProps } from '@tanstack/devtools-utils/preact'
import type { JSX } from 'preact'

export interface TableDevtoolsPreactInit extends Partial<DevtoolsPanelProps> {}

type TableDevtoolsPanelComponent = (
  props?: TableDevtoolsPreactInit,
) => JSX.Element

const [TableDevtoolsPanelBase, TableDevtoolsPanelNoOpBase] =
  createPreactPanel(TableDevtoolsCore)

function resolvePanelProps(
  props?: TableDevtoolsPreactInit,
): DevtoolsPanelProps {
  return {
    theme: props?.theme ?? 'dark',
    devtoolsOpen: props?.devtoolsOpen ?? false,
  }
}

export const TableDevtoolsPanel: TableDevtoolsPanelComponent = (props) =>
  h(TableDevtoolsPanelBase, resolvePanelProps(props))

export const TableDevtoolsPanelNoOp: TableDevtoolsPanelComponent = (props) =>
  h(TableDevtoolsPanelNoOpBase, resolvePanelProps(props))
