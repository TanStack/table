import { createVuePanel } from '@tanstack/devtools-utils/vue'
import { TableDevtoolsCore } from '@tanstack/table-devtools/production'
import { defineComponent, h } from 'vue'
import type { DevtoolsPanelProps } from '@tanstack/devtools-utils/vue'
import type { DefineComponent } from 'vue'
import type { TableDevtoolsVueInit } from '../VueTableDevtools'

class TableDevtoolsVueCore {
  private readonly core = new TableDevtoolsCore()

  constructor(_props: DevtoolsPanelProps) {}

  mount(el: HTMLElement, props?: DevtoolsPanelProps) {
    void this.core.mount(el, {
      theme: props?.theme ?? 'dark',
      devtoolsOpen: props?.devtoolsOpen ?? true,
    })
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
      const devtoolsProps = {
        theme: props.theme ?? 'dark',
        devtoolsOpen: props.devtoolsOpen ?? true,
      }
      return h(TableDevtoolsPanelBase, {
        key: `${devtoolsProps.theme}:${devtoolsProps.devtoolsOpen}`,
        props,
        devtoolsProps,
      })
    }
  },
}) as DefineComponent<TableDevtoolsVueInit, {}, unknown>
