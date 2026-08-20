import { createVuePanel } from '@tanstack/devtools-utils/vue'
import {
  TableDevtoolsCore,
  resolveDevtoolsPanelProps,
} from '@tanstack/table-devtools'
import { defineComponent, h } from 'vue'
import type { DevtoolsPanelProps } from '@tanstack/devtools-utils/vue'
import type { DefineComponent } from 'vue'

export interface TableDevtoolsVueInit extends Partial<DevtoolsPanelProps> {}

class TableDevtoolsVueCore {
  private readonly core = new TableDevtoolsCore()

  constructor(_props: DevtoolsPanelProps) {}

  mount(el: HTMLElement, props?: DevtoolsPanelProps) {
    void this.core.mount(el, resolveDevtoolsPanelProps(props))
  }

  unmount() {
    this.core.unmount()
  }
}

const [TableDevtoolsPanelBase, TableDevtoolsPanelNoOpBase] = createVuePanel<
  DevtoolsPanelProps,
  TableDevtoolsVueCore
>(TableDevtoolsVueCore)

function createPanelWrapper(
  name: string,
  Component: typeof TableDevtoolsPanelBase,
) {
  return defineComponent({
    name,
    props: ['theme', 'devtoolsOpen'],
    setup(props: TableDevtoolsVueInit) {
      return () => {
        const panelProps = resolveDevtoolsPanelProps(props)
        return h(Component, {
          key: `${panelProps.theme}:${panelProps.devtoolsOpen}`,
          props: panelProps,
          devtoolsProps: panelProps,
        })
      }
    },
  }) as DefineComponent<TableDevtoolsVueInit, {}, unknown>
}

export const TableDevtoolsPanel = createPanelWrapper(
  'TableDevtoolsPanel',
  TableDevtoolsPanelBase,
)

export const TableDevtoolsPanelNoOp = createPanelWrapper(
  'TableDevtoolsPanelNoOp',
  TableDevtoolsPanelNoOpBase,
)
