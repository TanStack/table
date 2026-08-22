import { handleCellNavigation } from './table-interactions'
import type { Accessor, JSX } from 'solid-js'
import type { WithDataAttributes } from './jsx-attributes'
import type { TradingTableInstance } from './trading-table-features'

export interface TradingGridPropsOptions {
  table: TradingTableInstance
  virtualized: Accessor<boolean>
}

export function createTradingGridProps(
  options: TradingGridPropsOptions,
): WithDataAttributes<JSX.IntrinsicElements['div']> {
  return {
    class: 'table-scroll',
    get classList() {
      return { 'is-virtualized': options.virtualized() }
    },
    'data-trading-table': true,
    tabindex: 0,
    onKeyDown: (event) => handleCellNavigation(options.table, event),
  }
}

export function createTradingTableElementProps(
  options: TradingGridPropsOptions,
  style: Accessor<Record<string, string>>,
): WithDataAttributes<JSX.IntrinsicElements['table']> {
  return {
    class: 'trading-data-grid',
    get classList() {
      return { 'virtual-table': options.virtualized() }
    },
    'data-testid': 'trading-table',
    role: 'grid',
    'aria-multiselectable': true,
    get style() {
      return style()
    },
  }
}
