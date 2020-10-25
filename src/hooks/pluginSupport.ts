import {composeDecorator, composeReducer} from "../utils";

export const plugTypes = [
    ['useReduceOptions', composeReducer],
    ['useInstanceAfterState', composeDecorator],
    ['useReduceColumns', composeReducer],
    ['useReduceAllColumns', composeReducer],
    ['useReduceLeafColumns', composeReducer],
    ['decorateColumn', composeDecorator],
    ['useReduceHeaderGroups', composeReducer],
    ['useReduceFooterGroups', composeReducer],
    ['useReduceFlatHeaders', composeReducer],
    ['decorateHeader', composeDecorator],
    ['decorateRow', composeDecorator],
    ['decorateCell', composeDecorator],
    ['useInstanceAfterDataModel', composeDecorator],
    ['reduceTableProps', composeReducer],
    ['reduceTableBodyProps', composeReducer],
    ['reduceTableHeadProps', composeReducer],
    ['reduceTableFootProps', composeReducer],
    ['reduceHeaderGroupProps', composeReducer],
    ['reduceFooterGroupProps', composeReducer],
    ['reduceHeaderProps', composeReducer],
    ['reduceRowProps', composeReducer],
    ['reduceCellProps', composeReducer],
] as const;

export type TableColumn = {
  id: string,
}
export type TableCell = {
  value: any
}
export type PluginMetaData = { getInstance: () => object }

type CellArgument<
  Column extends TableColumn,
  Cell extends TableCell
> = Cell & {column: Column}

export type StrongPluginTypes<
  Column extends TableColumn,
  Cell extends TableCell>
= {
    decorateCell: (cell: CellArgument<Column, Cell>, meta: PluginMetaData) => void,
    decorateHeader: (cell: CellArgument<Column, Cell>, meta: PluginMetaData) => void,
}

export type PluginTypes = Exclude<typeof plugTypes[number][0], keyof StrongPluginTypes<any, any>>

export type TablePlugin<
  Column extends TableColumn = TableColumn,
  Cell extends TableCell = TableCell,
> = {
    readonly name: string,
    readonly after?: string[],
} & StrongPluginTypes<Column,Cell>
 & { [key in PluginTypes]?: any }

