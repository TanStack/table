import { createColumnHelper as coreCreateColumnHelper } from '@tanstack/table-core'
import { defineComponent, h, inject, provide } from 'vue'
import { FlexRender } from './FlexRender'
import { mergeProxy } from './merge-proxy'
import { useTable } from './useTable'
import type { TableOptionsWithReactiveData, VueTable } from './useTable'
import type { FlexRenderCell, FlexRenderHeader } from './FlexRender'
import type { Component, InjectionKey, PropType } from 'vue'
import type {
  AccessorFn,
  AccessorFnColumnDef,
  AccessorKeyColumnDef,
  Cell,
  CellContext,
  CellData,
  Column,
  ColumnDef,
  DeepKeys,
  DeepValue,
  DisplayColumnDef,
  GroupColumnDef,
  Header,
  IdentifiedColumnDef,
  NoInfer,
  Row,
  RowData,
  Table,
  TableFeatures,
} from '@tanstack/table-core'

export type ComponentType<T extends Record<string, any>> = Component<T>

export type AppCellContext<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData,
  TCellComponents extends Record<string, ComponentType<any>>,
> = {
  cell: Cell<TFeatures, TData, TValue> &
    TCellComponents & { FlexRender: Component }
  column: Column<TFeatures, TData, TValue>
  getValue: CellContext<TFeatures, TData, TValue>['getValue']
  renderValue: CellContext<TFeatures, TData, TValue>['renderValue']
  row: Row<TFeatures, TData>
  table: Table<TFeatures, TData>
}

export type AppHeaderContext<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData,
  THeaderComponents extends Record<string, ComponentType<any>>,
> = {
  column: Column<TFeatures, TData, TValue>
  header: Header<TFeatures, TData, TValue> &
    THeaderComponents & { FlexRender: Component }
  table: Table<TFeatures, TData>
}

export type AppColumnDefTemplate<TProps extends object> =
  | string
  | ((props: TProps) => any)

export type AppColumnDefBase<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData,
  TCellComponents extends Record<string, ComponentType<any>>,
  THeaderComponents extends Record<string, ComponentType<any>>,
> = Omit<
  IdentifiedColumnDef<TFeatures, TData, TValue>,
  'cell' | 'header' | 'footer'
> & {
  cell?: AppColumnDefTemplate<
    AppCellContext<TFeatures, TData, TValue, TCellComponents>
  >
  header?: AppColumnDefTemplate<
    AppHeaderContext<TFeatures, TData, TValue, THeaderComponents>
  >
  footer?: AppColumnDefTemplate<
    AppHeaderContext<TFeatures, TData, TValue, THeaderComponents>
  >
}

export type AppDisplayColumnDef<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TCellComponents extends Record<string, ComponentType<any>>,
  THeaderComponents extends Record<string, ComponentType<any>>,
> = Omit<
  DisplayColumnDef<TFeatures, TData, unknown>,
  'cell' | 'header' | 'footer'
> & {
  cell?: AppColumnDefTemplate<
    AppCellContext<TFeatures, TData, unknown, TCellComponents>
  >
  header?: AppColumnDefTemplate<
    AppHeaderContext<TFeatures, TData, unknown, THeaderComponents>
  >
  footer?: AppColumnDefTemplate<
    AppHeaderContext<TFeatures, TData, unknown, THeaderComponents>
  >
}

export type AppGroupColumnDef<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TCellComponents extends Record<string, ComponentType<any>>,
  THeaderComponents extends Record<string, ComponentType<any>>,
> = Omit<
  GroupColumnDef<TFeatures, TData, unknown>,
  'cell' | 'header' | 'footer' | 'columns'
> & {
  cell?: AppColumnDefTemplate<
    AppCellContext<TFeatures, TData, unknown, TCellComponents>
  >
  header?: AppColumnDefTemplate<
    AppHeaderContext<TFeatures, TData, unknown, THeaderComponents>
  >
  footer?: AppColumnDefTemplate<
    AppHeaderContext<TFeatures, TData, unknown, THeaderComponents>
  >
  columns?: Array<ColumnDef<TFeatures, TData, unknown>>
}

export type AppColumnHelper<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TCellComponents extends Record<string, ComponentType<any>>,
  THeaderComponents extends Record<string, ComponentType<any>>,
> = {
  accessor: <
    TAccessor extends AccessorFn<TData> | DeepKeys<TData>,
    TValue extends TAccessor extends AccessorFn<TData, infer TReturn>
      ? TReturn
      : TAccessor extends DeepKeys<TData>
        ? DeepValue<TData, TAccessor>
        : never,
  >(
    accessor: TAccessor,
    column: TAccessor extends AccessorFn<TData>
      ? AppColumnDefBase<
          TFeatures,
          TData,
          TValue,
          TCellComponents,
          THeaderComponents
        > & { id: string }
      : AppColumnDefBase<
          TFeatures,
          TData,
          TValue,
          TCellComponents,
          THeaderComponents
        >,
  ) => TAccessor extends AccessorFn<TData>
    ? AccessorFnColumnDef<TFeatures, TData, TValue>
    : AccessorKeyColumnDef<TFeatures, TData, TValue>
  columns: <TColumns extends ReadonlyArray<ColumnDef<TFeatures, TData, any>>>(
    columns: [...TColumns],
  ) => Array<ColumnDef<TFeatures, TData, any>> & [...TColumns]
  display: (
    column: AppDisplayColumnDef<
      TFeatures,
      TData,
      TCellComponents,
      THeaderComponents
    >,
  ) => DisplayColumnDef<TFeatures, TData, unknown>
  group: (
    column: AppGroupColumnDef<
      TFeatures,
      TData,
      TCellComponents,
      THeaderComponents
    >,
  ) => GroupColumnDef<TFeatures, TData, unknown>
}

export type CreateTableHookOptions<
  TFeatures extends TableFeatures,
  TTableComponents extends Record<string, ComponentType<any>>,
  TCellComponents extends Record<string, ComponentType<any>>,
  THeaderComponents extends Record<string, ComponentType<any>>,
> = Omit<
  TableOptionsWithReactiveData<TFeatures, any>,
  'columns' | 'data' | 'store' | 'state' | 'initialState'
> & {
  tableComponents?: TTableComponents
  cellComponents?: TCellComponents
  headerComponents?: THeaderComponents
}

export interface AppTableProps {}

export interface AppCellProps<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
> {
  cell: Cell<TFeatures, TData, TValue>
}

export interface AppHeaderProps<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
> {
  header: Header<TFeatures, TData, TValue>
}

export type AppVueTable<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TTableComponents extends Record<string, ComponentType<any>>,
  _TCellComponents extends Record<string, ComponentType<any>>,
  _THeaderComponents extends Record<string, ComponentType<any>>,
> = VueTable<TFeatures, TData> &
  NoInfer<TTableComponents> & {
    AppTable: Component<AppTableProps>
    AppCell: Component<AppCellProps<TFeatures, TData>>
    AppHeader: Component<AppHeaderProps<TFeatures, TData>>
    AppFooter: Component<AppHeaderProps<TFeatures, TData>>
    FlexRender: typeof AppFlexRender
  }

export interface CreateTableHookResult<
  TFeatures extends TableFeatures,
  TTableComponents extends Record<string, ComponentType<any>>,
  TCellComponents extends Record<string, ComponentType<any>>,
  THeaderComponents extends Record<string, ComponentType<any>>,
> {
  /** The features object that was passed to `createTableHook`. */
  appFeatures: TFeatures
  /**
   * A column helper pre-bound to `TFeatures` and the registered components, so
   * the cell/header/footer render props expose the bound components.
   */
  createAppColumnHelper: <TData extends RowData>() => AppColumnHelper<
    TFeatures,
    TData,
    TCellComponents,
    THeaderComponents
  >
  /**
   * Creates a table with the `App*` wrapper components and registered
   * `tableComponents` attached. `TData` is inferred from the `data` option.
   */
  useAppTable: <TData extends RowData>(
    tableOptions: Omit<
      TableOptionsWithReactiveData<TFeatures, TData>,
      'features'
    >,
  ) => AppVueTable<
    TFeatures,
    TData,
    TTableComponents,
    TCellComponents,
    THeaderComponents
  >
  /**
   * Reads the table provided by the nearest `<table.AppTable>`. This is the same
   * extended instance `useAppTable` returns, so the `App*` components and your
   * `tableComponents` are available on it.
   */
  useTableContext: <TData extends RowData = RowData>() => AppVueTable<
    TFeatures,
    TData,
    TTableComponents,
    TCellComponents,
    THeaderComponents
  >
  /**
   * Reads the cell provided by the nearest `<table.AppCell>`, extended with your
   * `cellComponents` and a context-bound `FlexRender`.
   */
  useCellContext: <TValue extends CellData = CellData>() => Cell<
    TFeatures,
    any,
    TValue
  > &
    TCellComponents & { FlexRender: Component }
  /**
   * Reads the header provided by the nearest `<table.AppHeader>` /
   * `<table.AppFooter>`, extended with your `headerComponents` and a
   * context-bound `FlexRender`.
   */
  useHeaderContext: <TValue extends CellData = CellData>() => Header<
    TFeatures,
    any,
    TValue
  > &
    THeaderComponents & { FlexRender: Component }
}

export const AppFlexRender = defineComponent({
  name: 'TableFlexRender',
  props: {
    cell: {
      type: Object as PropType<FlexRenderCell>,
      default: undefined,
    },
    header: {
      type: Object as PropType<FlexRenderHeader>,
      default: undefined,
    },
    footer: {
      type: Object as PropType<FlexRenderHeader>,
      default: undefined,
    },
  },
  setup(props) {
    return () => {
      if (props.cell) {
        return h(FlexRender, {
          cell: props.cell,
        })
      }

      if (props.header) {
        return h(FlexRender, {
          header: props.header,
        })
      }

      if (props.footer) {
        return h(FlexRender, {
          footer: props.footer,
        })
      }

      return null
    }
  },
})

/**
 * Creates app-scoped Vue table helpers with features, row models, and
 * renderable component maps pre-bound.
 *
 * Use this when an app or design system wants typed `useAppTable`, a pre-bound
 * column helper, and context helpers for table, cell, and header components.
 *
 * @example
 * ```ts
 * const { useAppTable, createAppColumnHelper } = createTableHook({
 *   features,
 *   tableComponents: {},
 *   cellComponents: {},
 *   headerComponents: {},
 * })
 * ```
 */
export function createTableHook<
  TFeatures extends TableFeatures,
  const TTableComponents extends Record<string, ComponentType<any>>,
  const TCellComponents extends Record<string, ComponentType<any>>,
  const THeaderComponents extends Record<string, ComponentType<any>>,
>({
  tableComponents,
  cellComponents,
  headerComponents,
  ...defaultTableOptions
}: CreateTableHookOptions<
  TFeatures,
  TTableComponents,
  TCellComponents,
  THeaderComponents
>): CreateTableHookResult<
  TFeatures,
  TTableComponents,
  TCellComponents,
  THeaderComponents
> {
  const TableContext = Symbol('TableContext') as InjectionKey<
    VueTable<TFeatures, any>
  >
  const CellContext = Symbol('CellContext') as InjectionKey<
    Cell<TFeatures, any, any>
  >
  const HeaderContext = Symbol('HeaderContext') as InjectionKey<
    Header<TFeatures, any, any>
  >

  function createAppColumnHelper<TData extends RowData>(): AppColumnHelper<
    TFeatures,
    TData,
    TCellComponents,
    THeaderComponents
  > {
    return coreCreateColumnHelper<TFeatures, TData>() as AppColumnHelper<
      TFeatures,
      TData,
      TCellComponents,
      THeaderComponents
    >
  }

  function useTableContext<TData extends RowData = RowData>(): AppVueTable<
    TFeatures,
    TData,
    TTableComponents,
    TCellComponents,
    THeaderComponents
  > {
    const table = inject(TableContext)

    if (!table) {
      throw new Error(
        '`useTableContext` must be used within an `AppTable` component. ' +
          'Make sure your component is wrapped with `<table.AppTable>...</table.AppTable>`.',
      )
    }

    // The value provided by `<table.AppTable>` is the extended table (the App*
    // wrapper components and `tableComponents` are Object.assign-ed onto the same
    // instance `useAppTable` returns), so this asserts the runtime shape.
    return table as unknown as AppVueTable<
      TFeatures,
      TData,
      TTableComponents,
      TCellComponents,
      THeaderComponents
    >
  }

  function useCellContext<TValue extends CellData = CellData>(): Cell<
    TFeatures,
    any,
    TValue
  > &
    TCellComponents & { FlexRender: Component } {
    const cell = inject(CellContext)

    if (!cell) {
      throw new Error(
        '`useCellContext` must be used within an `AppCell` component. ' +
          'Make sure your component is wrapped with `<table.AppCell :cell="cell">...</table.AppCell>`.',
      )
    }

    // `<table.AppCell>` Object.assign-es `cellComponents` and `FlexRender` onto
    // the same cell instance it provides, so this asserts the runtime shape.
    return cell as unknown as Cell<TFeatures, any, TValue> &
      TCellComponents & { FlexRender: Component }
  }

  function useHeaderContext<TValue extends CellData = CellData>(): Header<
    TFeatures,
    any,
    TValue
  > &
    THeaderComponents & { FlexRender: Component } {
    const header = inject(HeaderContext)

    if (!header) {
      throw new Error(
        '`useHeaderContext` must be used within an `AppHeader` or `AppFooter` component.',
      )
    }

    // `<table.AppHeader>` / `<table.AppFooter>` Object.assign `headerComponents`
    // and `FlexRender` onto the same header instance they provide.
    return header as unknown as Header<TFeatures, any, TValue> &
      THeaderComponents & { FlexRender: Component }
  }

  const CellFlexRender = defineComponent({
    name: 'AppCellFlexRender',
    setup() {
      const cell = useCellContext()
      return () => h(AppFlexRender, { cell })
    },
  })

  const HeaderFlexRender = defineComponent({
    name: 'AppHeaderFlexRender',
    setup() {
      const header = useHeaderContext()
      return () => h(AppFlexRender, { header })
    },
  })

  const FooterFlexRender = defineComponent({
    name: 'AppFooterFlexRender',
    setup() {
      const header = useHeaderContext()
      return () => h(AppFlexRender, { footer: header })
    },
  })

  function useAppTable<TData extends RowData>(
    tableOptions: Omit<
      TableOptionsWithReactiveData<TFeatures, TData>,
      'features'
    >,
  ): AppVueTable<
    TFeatures,
    TData,
    TTableComponents,
    TCellComponents,
    THeaderComponents
  > {
    const mergedOptions = mergeProxy(
      defaultTableOptions,
      tableOptions,
    ) as TableOptionsWithReactiveData<TFeatures, TData>

    const table = useTable<TFeatures, TData>(mergedOptions)

    const AppTable = defineComponent({
      name: 'AppTable',
      setup(_, { slots }) {
        provide(TableContext, table)
        return () => {
          return slots.default?.()
        }
      },
    })

    const AppCell = defineComponent({
      name: 'AppCell',
      props: {
        cell: {
          type: Object as PropType<object>,
          required: true,
        },
      },
      setup(props, { slots }) {
        const cell = props.cell as Cell<TFeatures, TData, any>

        provide(CellContext, cell)

        const extendedCell = Object.assign(cell, {
          FlexRender: CellFlexRender,
          ...(cellComponents ?? {}),
        }) as Cell<TFeatures, TData, any> &
          TCellComponents & { FlexRender: Component }

        return () => {
          return slots.default?.({ cell: extendedCell })
        }
      },
    })

    const AppHeader = defineComponent({
      name: 'AppHeader',
      props: {
        header: {
          type: Object as PropType<object>,
          required: true,
        },
      },
      setup(props, { slots }) {
        const header = props.header as Header<TFeatures, TData, any>

        provide(HeaderContext, header)

        const extendedHeader = Object.assign(header, {
          FlexRender: HeaderFlexRender,
          ...(headerComponents ?? {}),
        }) as Header<TFeatures, TData, any> &
          THeaderComponents & { FlexRender: Component }

        return () => {
          return slots.default?.({ header: extendedHeader })
        }
      },
    })

    const AppFooter = defineComponent({
      name: 'AppFooter',
      props: {
        header: {
          type: Object as PropType<object>,
          required: true,
        },
      },
      setup(props, { slots }) {
        const header = props.header as Header<TFeatures, TData, any>

        provide(HeaderContext, header)

        const extendedHeader = Object.assign(header, {
          FlexRender: FooterFlexRender,
          ...(headerComponents ?? {}),
        }) as Header<TFeatures, TData, any> &
          THeaderComponents & { FlexRender: Component }

        return () => {
          return slots.default?.({ header: extendedHeader })
        }
      },
    })

    return Object.assign(table, {
      AppTable,
      AppCell,
      AppHeader,
      AppFooter,
      FlexRender: AppFlexRender,
      ...(tableComponents ?? {}),
    }) as AppVueTable<
      TFeatures,
      TData,
      TTableComponents,
      TCellComponents,
      THeaderComponents
    >
  }

  return {
    // `TableOptionsWithReactiveData` widens `features` to allow a reactive ref,
    // so this narrows it back to the resolved `TFeatures` for `appFeatures`.
    appFeatures: defaultTableOptions.features as TFeatures,
    createAppColumnHelper,
    useAppTable,
    useTableContext,
    useCellContext,
    useHeaderContext,
  }
}
