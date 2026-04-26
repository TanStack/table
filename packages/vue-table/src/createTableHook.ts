import { createColumnHelper as coreCreateColumnHelper } from '@tanstack/table-core'
import { useSelector } from '@tanstack/vue-store'
import { defineComponent, h, inject, provide } from 'vue'
import { FlexRender } from './FlexRender'
import { mergeProxy } from './merge-proxy'
import { useTable } from './useTable'
import type { TableOptionsWithReactiveData, VueTable } from './useTable'
import type { Component, InjectionKey, PropType, VNodeChild } from 'vue'
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
  TableState,
} from '@tanstack/table-core'

type ComponentType<T extends Record<string, any>> = Component<T>

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

type AppColumnDefTemplate<TProps extends object> =
  | string
  | ((props: TProps) => any)

type AppColumnDefBase<
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

type AppDisplayColumnDef<
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

type AppGroupColumnDef<
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

export interface AppTableProps<
  TFeatures extends TableFeatures,
  TSelected = unknown,
> {
  selector?: (state: TableState<TFeatures>) => TSelected
}

export interface AppCellProps<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
  TSelected = unknown,
> {
  cell: Cell<TFeatures, TData, TValue>
  selector?: (state: TableState<TFeatures>) => TSelected
}

export interface AppHeaderProps<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
  TSelected = unknown,
> {
  header: Header<TFeatures, TData, TValue>
  selector?: (state: TableState<TFeatures>) => TSelected
}

export type AppVueTable<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TSelected,
  TTableComponents extends Record<string, ComponentType<any>>,
  TCellComponents extends Record<string, ComponentType<any>>,
  THeaderComponents extends Record<string, ComponentType<any>>,
> = VueTable<TFeatures, TData, TSelected> &
  NoInfer<TTableComponents> & {
    AppTable: Component<AppTableProps<TFeatures>>
    AppCell: Component<AppCellProps<TFeatures, TData>>
    AppHeader: Component<AppHeaderProps<TFeatures, TData>>
    AppFooter: Component<AppHeaderProps<TFeatures, TData>>
    FlexRender: typeof AppFlexRender
  }

export const AppFlexRender = defineComponent({
  name: 'TableFlexRender',
  props: {
    cell: {
      type: Object as PropType<Cell<any, any, any>>,
      default: undefined,
    },
    header: {
      type: Object as PropType<Header<any, any, any>>,
      default: undefined,
    },
    footer: {
      type: Object as PropType<Header<any, any, any>>,
      default: undefined,
    },
  },
  setup(props) {
    return () => {
      if (props.cell) {
        return h(FlexRender, {
          render: props.cell.column.columnDef.cell,
          props: props.cell.getContext(),
        })
      }

      if (props.header) {
        return h(FlexRender, {
          render: props.header.column.columnDef.header,
          props: props.header.getContext(),
        })
      }

      if (props.footer) {
        return h(FlexRender, {
          render: props.footer.column.columnDef.footer,
          props: props.footer.getContext(),
        })
      }

      return null
    }
  },
})

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
>) {
  const TableContext = Symbol('TableContext') as InjectionKey<
    VueTable<TFeatures, any, any>
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

  function useTableContext<TData extends RowData = RowData>(): VueTable<
    TFeatures,
    TData
  > {
    const table = inject(TableContext)

    if (!table) {
      throw new Error(
        '`useTableContext` must be used within an `AppTable` component. ' +
          'Make sure your component is wrapped with `<table.AppTable>...</table.AppTable>`.',
      )
    }

    return table as VueTable<TFeatures, TData>
  }

  function useCellContext<TValue extends CellData = CellData>(): Cell<
    TFeatures,
    any,
    TValue
  > {
    const cell = inject(CellContext)

    if (!cell) {
      throw new Error(
        '`useCellContext` must be used within an `AppCell` component. ' +
          'Make sure your component is wrapped with `<table.AppCell :cell="cell">...</table.AppCell>`.',
      )
    }

    return cell as Cell<TFeatures, any, TValue>
  }

  function useHeaderContext<TValue extends CellData = CellData>(): Header<
    TFeatures,
    any,
    TValue
  > {
    const header = inject(HeaderContext)

    if (!header) {
      throw new Error(
        '`useHeaderContext` must be used within an `AppHeader` or `AppFooter` component.',
      )
    }

    return header as Header<TFeatures, any, TValue>
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

  function useAppTable<TData extends RowData, TSelected = {}>(
    tableOptions: Omit<
      TableOptionsWithReactiveData<TFeatures, TData>,
      '_features' | '_rowModels'
    >,
    selector?: (state: TableState<TFeatures>) => TSelected,
  ): AppVueTable<
    TFeatures,
    TData,
    TSelected,
    TTableComponents,
    TCellComponents,
    THeaderComponents
  > {
    const mergedOptions = mergeProxy(
      defaultTableOptions,
      tableOptions,
    ) as TableOptionsWithReactiveData<TFeatures, TData>

    const table = useTable<TFeatures, TData, TSelected>(mergedOptions, selector)

    const AppTable = defineComponent({
      name: 'AppTable',
      props: {
        selector: {
          type: Function as PropType<(state: TableState<TFeatures>) => unknown>,
          default: undefined,
        },
      },
      setup(props, { slots }) {
        provide(TableContext, table)
        const selected = props.selector
          ? useSelector(table.store, props.selector)
          : undefined

        return () => {
          if (!props.selector) {
            return slots.default?.()
          }

          return slots.default?.({ state: selected?.value })
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
        selector: {
          type: Function as PropType<(state: TableState<TFeatures>) => unknown>,
          default: undefined,
        },
      },
      setup(props, { slots }) {
        const cell = props.cell as Cell<TFeatures, TData, any>

        provide(CellContext, cell)

        const selected = props.selector
          ? useSelector(table.store, props.selector)
          : undefined

        const extendedCell = Object.assign(cell, {
          FlexRender: CellFlexRender,
          ...(cellComponents ?? {}),
        }) as Cell<TFeatures, TData, any> &
          TCellComponents & { FlexRender: Component }

        return () => {
          return slots.default?.(
            props.selector
              ? { cell: extendedCell, state: selected?.value }
              : { cell: extendedCell },
          )
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
        selector: {
          type: Function as PropType<(state: TableState<TFeatures>) => unknown>,
          default: undefined,
        },
      },
      setup(props, { slots }) {
        const header = props.header as Header<TFeatures, TData, any>

        provide(HeaderContext, header)

        const selected = props.selector
          ? useSelector(table.store, props.selector)
          : undefined

        const extendedHeader = Object.assign(header, {
          FlexRender: HeaderFlexRender,
          ...(headerComponents ?? {}),
        }) as Header<TFeatures, TData, any> &
          THeaderComponents & { FlexRender: Component }

        return () => {
          return slots.default?.(
            props.selector
              ? { header: extendedHeader, state: selected?.value }
              : { header: extendedHeader },
          )
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
        selector: {
          type: Function as PropType<(state: TableState<TFeatures>) => unknown>,
          default: undefined,
        },
      },
      setup(props, { slots }) {
        const header = props.header as Header<TFeatures, TData, any>

        provide(HeaderContext, header)

        const selected = props.selector
          ? useSelector(table.store, props.selector)
          : undefined

        const extendedHeader = Object.assign(header, {
          FlexRender: FooterFlexRender,
          ...(headerComponents ?? {}),
        }) as Header<TFeatures, TData, any> &
          THeaderComponents & { FlexRender: Component }

        return () => {
          return slots.default?.(
            props.selector
              ? { header: extendedHeader, state: selected?.value }
              : { header: extendedHeader },
          )
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
      TSelected,
      TTableComponents,
      TCellComponents,
      THeaderComponents
    >
  }

  return {
    appFeatures: defaultTableOptions._features as TFeatures,
    createAppColumnHelper,
    useAppTable,
    useTableContext,
    useCellContext,
    useHeaderContext,
  }
}
