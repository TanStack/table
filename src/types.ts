import { composeReducer, composeDecorator } from './utils'
import type { Base, BasePlugin } from './Base'

export interface TablePlugin {
  name: string
  after: string[]
  plugs: TablePluginPlugs
}

export interface TablePluginPlugs {
  useTable: BasePlugin<TableInstance, TableOptions>
  // useReduceOptions?: BasePlugin<TableOptions, TableInstance>
  // useInstanceAfterState?: BasePlugin<TableInstance>
  // useReduceColumns?: BasePlugin<Columns, TableInstance>
  // useReduceAllColumns?: BasePlugin<AllColumns, TableInstance>
  // useReduceLeafColumns?: BasePlugin<LeafColumns, TableInstance>
  // decorateColumn?: BasePlugin<Column, TableInstance>
  // useReduceHeaderGroups?: BasePlugin<HeaderGroups, TableInstance>
  // useReduceFooterGroups?: BasePlugin<FooterGroups, TableInstance>
  // useReduceFlatHeaders?: BasePlugin<FlatHeaders, TableInstance>
  // decorateHeader?: BasePlugin<Header, TableInstance>
  // decorateRow?: BasePlugin<Row, TableInstance>
  // decorateCell?: BasePlugin<Cell, TableInstance>
  // useInstanceAfterDataModel?: BasePlugin<TableInstance>
  // reduceTableProps?: BasePlugin<TableProps, TableInstance>
  // reduceTableBodyProps?: BasePlugin<TableBodyProps, TableInstance>
  // reduceTableHeadProps?: BasePlugin<TableHeadProps, TableInstance>
  // reduceTableFootProps?: BasePlugin<TableFootProps, TableInstance>
  // reduceHeaderGroupProps?: BasePlugin<HeaderGroupProps, TableInstance>
  // reduceFooterGroupProps?: BasePlugin<FooterGroupProps, TableInstance>
  // reduceHeaderProps?: BasePlugin<HeaderProps, TableInstance>
  // reduceRowProps?: BasePlugin<RowProps, TableInstance>
  // reduceCellProps?: BasePlugin<CellProps, TableInstance>
}

export interface TableInstancePlugs {
  useTable: Base<TableInstance, TableOptions>
  // useReduceOptions?: Base<TableOptions, TableInstance>
  // useInstanceAfterState?: Base<TableInstance>
  // useReduceColumns?: Base<Columns, TableInstance>
  // useReduceAllColumns?: Base<AllColumns, TableInstance>
  // useReduceLeafColumns?: Base<LeafColumns, TableInstance>
  // decorateColumn?: Base<Column, TableInstance>
  // useReduceHeaderGroups?: Base<HeaderGroups, TableInstance>
  // useReduceFooterGroups?: Base<FooterGroups, TableInstance>
  // useReduceFlatHeaders?: Base<FlatHeaders, TableInstance>
  // decorateHeader?: Base<Header, TableInstance>
  // decorateRow?: Base<Row, TableInstance>
  // decorateCell?: Base<Cell, TableInstance>
  // useInstanceAfterDataModel?: Base<TableInstance>
  // reduceTableProps?: Base<TableProps, TableInstance>
  // reduceTableBodyProps?: Base<TableBodyProps, TableInstance>
  // reduceTableHeadProps?: Base<TableHeadProps, TableInstance>
  // reduceTableFootProps?: Base<TableFootProps, TableInstance>
  // reduceHeaderGroupProps?: Base<HeaderGroupProps, TableInstance>
  // reduceFooterGroupProps?: Base<FooterGroupProps, TableInstance>
  // reduceHeaderProps?: Base<HeaderProps, TableInstance>
  // reduceRowProps?: Base<RowProps, TableInstance>
  // reduceCellProps?: Base<CellProps, TableInstance>
}

export type PlugType = keyof TableInstancePlugs

export type PlugBuilderFn = typeof composeReducer | typeof composeDecorator
// | typeof pipe

export interface TableInstance {
  options: unknown
  plugs: TableInstancePlugs
}

export type PlugFnApplicator = ReturnType<PlugBuilderFn>

export interface TableOptions {
  data: any[]
  columns: any[]
}
