import { h } from 'preact'
import { useMemo } from 'preact/hooks'
import { createPreactPanel } from '@tanstack/devtools-utils/preact'
import { TableDevtoolsCore } from '@tanstack/table-devtools/production'
import type { DevtoolsPanelProps } from '@tanstack/devtools-utils/preact'
import type { JSX } from 'preact'
import type { TableDevtoolsPreactInit } from '../PreactTableDevtools'

type TableDevtoolsPanelComponent = (
  props?: TableDevtoolsPreactInit,
) => JSX.Element

const [TableDevtoolsPanelBase] = createPreactPanel(TableDevtoolsCore)

function resolvePanelProps(
  props?: TableDevtoolsPreactInit,
): DevtoolsPanelProps {
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
  return h(TableDevtoolsPanelBase, panelProps)
}
