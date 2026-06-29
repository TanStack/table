'use client'
import { createContext, useContext } from 'react'
import type {
  Cell,
  CellData,
  Header,
  RowData,
  TableFeatures,
} from '@tanstack/table-core'
import type { Context } from 'react'
import type { ReactTable } from './useTable'

/**
 * The object returned by {@link createTableHookContexts}: three scoped React
 * contexts plus matching context hooks.
 */
export interface TableHookContexts<
  TFeatures extends TableFeatures,
  TData extends RowData,
> {
  tableContext: Context<ReactTable<any, any>>
  cellContext: Context<Cell<any, any, any>>
  headerContext: Context<Header<any, any, any>>
  useTableContext: <TTableData extends RowData = TData>() => ReactTable<
    TFeatures,
    TTableData
  >
  useCellContext: <TValue extends CellData = CellData>() => Cell<
    TFeatures,
    any,
    TValue
  >
  useHeaderContext: <TValue extends CellData = CellData>() => Header<
    TFeatures,
    any,
    TValue
  >
}

/**
 * Creates a fresh, scoped set of table/cell/header contexts (plus matching
 * context hooks) that you can pass into {@link createTableHook}. This mirrors
 * TanStack Form's `createFormHookContexts`.
 *
 * You usually do NOT need this: by default `createTableHook` wires its
 * `AppTable`/`AppCell`/`AppHeader` providers to a shared module-scoped context,
 * and you read it with the `useTableContext`/`useCellContext`/`useHeaderContext`
 * hooks returned from `createTableHook`. Reach for `createTableHookContexts`
 * when you need an *isolated* context, e.g. when nesting one table inside
 * another and a consumer would otherwise read the wrong (nearest) provider.
 *
 * Type-safety note: the hooks returned here are typed with `TFeatures` only.
 * They do NOT know the component maps you register in `createTableHook`
 * (`tableComponents`/`cellComponents`/`headerComponents`), because those are
 * defined later. For the richest types (the `App*` components and your
 * registered components attached), prefer the `use*Context` hooks returned from
 * your `createTableHook` call. The hooks here are the escape hatch for reading
 * context from a module that does not / cannot import the `createTableHook`
 * result.
 *
 * @example
 * ```tsx
 * // scoped-table-context.ts
 * export const {
 *   tableContext,
 *   cellContext,
 *   headerContext,
 *   useTableContext,
 *   useCellContext,
 *   useHeaderContext,
 * } = createTableHookContexts<typeof features>()
 *
 * // table.ts
 * export const { useAppTable } = createTableHook({
 *   features,
 *   tableContext, // <- pass the scoped contexts so the providers use them
 *   cellContext,
 *   headerContext,
 *   tableComponents: { PaginationControls },
 * })
 * ```
 */
export function createTableHookContexts<
  TFeatures extends TableFeatures,
  TData extends RowData = RowData,
>(): TableHookContexts<TFeatures, TData> {
  // Fresh contexts per call: this is what makes them scoped/isolated. They are
  // intentionally loosely typed (`any` features); the `TFeatures` typing is
  // layered on by the hooks below.
  // eslint-disable-next-line @eslint-react/naming-convention-context-name
  const tableContext = createContext<ReactTable<any, any> | null>(null)
  // eslint-disable-next-line @eslint-react/naming-convention-context-name
  const cellContext = createContext<Cell<any, any, any> | null>(null)
  // eslint-disable-next-line @eslint-react/naming-convention-context-name
  const headerContext = createContext<Header<any, any, any> | null>(null)

  /**
   * Access the table instance from within an `AppTable` wrapper bound to these
   * scoped contexts. `TFeatures` is known; the registered component maps are not
   * (see {@link createTableHookContexts}).
   */
  function useTableContext<TTableData extends RowData = TData>(): ReactTable<
    TFeatures,
    TTableData
  > {
    // eslint-disable-next-line @eslint-react/no-use-context -- intentional for React 18
    const table = useContext(tableContext)

    if (!table) {
      throw new Error(
        '`useTableContext` must be used within an `AppTable` component. ' +
          'Make sure your component is wrapped with `<table.AppTable>...</table.AppTable>`.',
      )
    }

    return table as unknown as ReactTable<TFeatures, TTableData>
  }

  /**
   * Access the cell instance from within an `AppCell` wrapper bound to these
   * scoped contexts.
   */
  function useCellContext<TValue extends CellData = CellData>(): Cell<
    TFeatures,
    any,
    TValue
  > {
    // eslint-disable-next-line @eslint-react/no-use-context -- intentional for React 18
    const cell = useContext(cellContext)

    if (!cell) {
      throw new Error(
        '`useCellContext` must be used within an `AppCell` component. ' +
          'Make sure your component is wrapped with `<table.AppCell cell={cell}>...</table.AppCell>`.',
      )
    }

    return cell as unknown as Cell<TFeatures, any, TValue>
  }

  /**
   * Access the header instance from within an `AppHeader` or `AppFooter` wrapper
   * bound to these scoped contexts.
   */
  function useHeaderContext<TValue extends CellData = CellData>(): Header<
    TFeatures,
    any,
    TValue
  > {
    // eslint-disable-next-line @eslint-react/no-use-context -- intentional for React 18
    const header = useContext(headerContext)

    if (!header) {
      throw new Error(
        '`useHeaderContext` must be used within an `AppHeader` or `AppFooter` component.',
      )
    }

    return header as unknown as Header<TFeatures, any, TValue>
  }

  return {
    // Re-typed without `| null` so they drop straight into `createTableHook`'s
    // `tableContext`/`cellContext`/`headerContext` options.
    tableContext: tableContext as unknown as Context<ReactTable<any, any>>,
    cellContext: cellContext as unknown as Context<Cell<any, any, any>>,
    headerContext: headerContext as unknown as Context<Header<any, any, any>>,
    useTableContext,
    useCellContext,
    useHeaderContext,
  }
}
