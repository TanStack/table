import { createElement, useMemo } from 'react'
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
    devtoolsOpen: props?.devtoolsOpen ?? true,
  }
}

export const TableDevtoolsPanel: TableDevtoolsPanelComponent = (props) => {
  const theme = props?.theme
  const devtoolsOpen = props?.devtoolsOpen
  const panelProps = useMemo(
    () => resolvePanelProps({ theme, devtoolsOpen }),
    [devtoolsOpen, theme],
  )
  return createElement(TableDevtoolsPanelBase, panelProps)
}

export const TableDevtoolsPanelNoOp: TableDevtoolsPanelComponent = (props) => {
  const theme = props?.theme
  const devtoolsOpen = props?.devtoolsOpen
  const panelProps = useMemo(
    () => resolvePanelProps({ theme, devtoolsOpen }),
    [devtoolsOpen, theme],
  )
  return createElement(TableDevtoolsPanelNoOpBase, panelProps)
}
