import { createVuePanel } from '@tanstack/devtools-utils/vue'
import { TableDevtoolsCore } from '@tanstack/table-devtools'
import { defineComponent, h } from 'vue'
import type { DevtoolsPanelProps } from '@tanstack/devtools-utils/vue'
import type { DefineComponent } from 'vue'

export interface TableDevtoolsVueInit extends Partial<DevtoolsPanelProps> {}

class TableDevtoolsVueCore {
  private readonly core = new TableDevtoolsCore()

  constructor(_props: DevtoolsPanelProps) {}

  mount(el: HTMLElement, props?: DevtoolsPanelProps) {
    void this.core.mount(el, {
      theme: props?.theme ?? 'dark',
      devtoolsOpen: props?.devtoolsOpen ?? false,
    })
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
    props: ['theme', 'devtoolsOpen'] as unknown as undefined,
    setup(props: TableDevtoolsVueInit) {
      const devtoolsProps = {
        theme: props.theme ?? 'dark',
        devtoolsOpen: props.devtoolsOpen ?? false,
      }

      return () =>
        h(Component, {
          props,
          devtoolsProps,
        })
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
