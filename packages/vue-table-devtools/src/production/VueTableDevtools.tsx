import { createVuePanel } from '@tanstack/devtools-utils/vue'
import { resolveDevtoolsPanelProps } from '@tanstack/table-devtools'
import { TableDevtoolsCore } from '@tanstack/table-devtools/production'
import { defineComponent, h } from 'vue'
import type { DevtoolsPanelProps } from '@tanstack/devtools-utils/vue'
import type { DefineComponent } from 'vue'
import type { TableDevtoolsVueInit } from '../VueTableDevtools'

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

const [TableDevtoolsPanelBase] = createVuePanel<
  DevtoolsPanelProps,
  TableDevtoolsVueCore
>(TableDevtoolsVueCore)

export const TableDevtoolsPanel = defineComponent({
  name: 'TableDevtoolsPanel',
  props: ['theme', 'devtoolsOpen'],
  setup(props: TableDevtoolsVueInit) {
    return () => {
      const panelProps = resolveDevtoolsPanelProps(props)
      return h(TableDevtoolsPanelBase, {
        key: `${panelProps.theme}:${panelProps.devtoolsOpen}`,
        props: panelProps,
        devtoolsProps: panelProps,
      })
    }
  },
}) as DefineComponent<TableDevtoolsVueInit, {}, unknown>
