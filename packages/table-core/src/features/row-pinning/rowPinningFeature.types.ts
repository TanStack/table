import type { OnChangeFn, RowData, Updater } from '../../types/type-utils'
import type { TableFeatures } from '../../types/TableFeatures'
import type { Row } from '../../types/Row'

export type RowPinningPosition = false | 'top' | 'bottom'

export interface RowPinningState {
  bottom: Array<string>
  top: Array<string>
}

export interface TableState_RowPinning {
  rowPinning: RowPinningState
}

export interface TableOptions_RowPinning<
  TFeatures extends TableFeatures,
  TData extends RowData,
> {
  /**
   * Enables/disables row pinning for the table. Defaults to `true`.
   * [API Docs](https://tanstack.com/table/v8/docs/api/features/row-pinning#enablerowpinning)
   * [Guide](https://tanstack.com/table/v8/docs/guide/row-pinning)
   */
  enableRowPinning?: boolean | ((row: Row<TFeatures, TData>) => boolean)
  /**
   * When `false`, pinned rows will not be visible if they are filtered or paginated out of the table. When `true`, pinned rows will always be visible regardless of filtering or pagination. Defaults to `true`.
   * [API Docs](https://tanstack.com/table/v8/docs/api/features/row-pinning#keeppinnedrows)
   * [Guide](https://tanstack.com/table/v8/docs/guide/row-pinning)
   */
  keepPinnedRows?: boolean
  /**
   * If provided, this function will be called with an `updaterFn` when `state.rowPinning` changes. This overrides the default internal state management, so you will also need to supply `state.rowPinning` from your own managed state.
   * [API Docs](https://tanstack.com/table/v8/docs/api/features/row-pinning#onrowpinningchange)
   * [Guide](https://tanstack.com/table/v8/docs/guide/onrowpinningchange)
   */
  onRowPinningChange?: OnChangeFn<RowPinningState>
}

export interface RowPinningDefaultOptions {
  onRowPinningChange: OnChangeFn<RowPinningState>
}

export interface Row_RowPinning {
  /**
   * Returns whether or not the row can be pinned.
   * [API Docs](https://tanstack.com/table/v8/docs/api/features/row-pinning#getcanpin-1)
   * [Guide](https://tanstack.com/table/v8/docs/guide/row-pinning)
   */
  getCanPin: () => boolean
  /**
   * Returns the pinned position of the row. (`'top'`, `'bottom'` or `false`)
   * [API Docs](https://tanstack.com/table/v8/docs/api/features/row-pinning#getispinned-1)
   * [Guide](https://tanstack.com/table/v8/docs/guide/row-pinning)
   */
  getIsPinned: () => RowPinningPosition
  /**
   * Returns the numeric pinned index of the row within a pinned row group.
   * [API Docs](https://tanstack.com/table/v8/docs/api/features/row-pinning#getpinnedindex-1)
   * [Guide](https://tanstack.com/table/v8/docs/guide/row-pinning)
   */
  getPinnedIndex: () => number
  /**
   * Pins a row to the `'top'` or `'bottom'`, or unpins the row to the center if `false` is passed.
   * [API Docs](https://tanstack.com/table/v8/docs/api/features/row-pinning#pin-1)
   * [Guide](https://tanstack.com/table/v8/docs/guide/row-pinning)
   */
  pin: (
    position: RowPinningPosition,
    includeLeafRows?: boolean,
    includeParentRows?: boolean,
  ) => void
}

export interface Table_RowPinning<
  TFeatures extends TableFeatures,
  TData extends RowData,
> {
  /**
   * Returns all bottom pinned rows.
   * [API Docs](https://tanstack.com/table/v8/docs/api/features/row-pinning#getbottomrows)
   * [Guide](https://tanstack.com/table/v8/docs/guide/row-pinning)
   */
  getBottomRows: () => Array<Row<TFeatures, TData>>
  /**
   * Returns all rows that are not pinned to the top or bottom.
   * [API Docs](https://tanstack.com/table/v8/docs/api/features/row-pinning#getcenterrows)
   * [Guide](https://tanstack.com/table/v8/docs/guide/row-pinning)
   */
  getCenterRows: () => Array<Row<TFeatures, TData>>
  /**
   * Returns whether or not any rows are pinned. Optionally specify to only check for pinned rows in either the `top` or `bottom` position.
   * [API Docs](https://tanstack.com/table/v8/docs/api/features/row-pinning#getissomerowspinned)
   * [Guide](https://tanstack.com/table/v8/docs/guide/row-pinning)
   */
  getIsSomeRowsPinned: (position?: RowPinningPosition) => boolean
  /**
   * Returns all top pinned rows.
   * [API Docs](https://tanstack.com/table/v8/docs/api/features/row-pinning#gettoprows)
   * [Guide](https://tanstack.com/table/v8/docs/guide/row-pinning)
   */
  getTopRows: () => Array<Row<TFeatures, TData>>
  /**
   * Resets the **rowPinning** state to `initialState.rowPinning`, or `true` can be passed to force a default blank state reset to `{ top: [], bottom: [], }`.
   * [API Docs](https://tanstack.com/table/v8/docs/api/features/row-pinning#resetrowpinning)
   * [Guide](https://tanstack.com/table/v8/docs/guide/row-pinning)
   */
  resetRowPinning: (defaultState?: boolean) => void
  /**
   * Sets or updates the `state.rowPinning` state.
   * [API Docs](https://tanstack.com/table/v8/docs/api/features/row-pinning#setrowpinning)
   * [Guide](https://tanstack.com/table/v8/docs/guide/row-pinning)
   */
  setRowPinning: (updater: Updater<RowPinningState>) => void
}
