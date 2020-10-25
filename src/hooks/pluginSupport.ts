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
} & Record<string, any>
export type TableCell = {
  column: TableColumn
  value: any
} & Record<string, any>
export type PluginMetaData = { getInstance: () => object }
export type StrongPluginTypes = {
    decorateCell: (cell: TableCell, meta: PluginMetaData) => void,
    decorateHeader: (cell: TableCell, meta: PluginMetaData) => void,
}

export type PluginTypes = Exclude<typeof plugTypes[number][0], keyof StrongPluginTypes>
export type TablePlugin = {
    readonly name: string,
    readonly after?: string[],
} & StrongPluginTypes
 & { [key in PluginTypes]?: any }

