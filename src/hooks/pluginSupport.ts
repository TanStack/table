import { composeReducer, composeDecorator } from "../utils";

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

type StrongPluginTypes = {
    decorateCell: (column: object, meta: { getInstance: () => object}) => void,
}

export type PluginTypes = Exclude<typeof plugTypes[number][0], keyof StrongPluginTypes>
export type TablePlugin = {
    readonly name: string,
    readonly after?: string[],
} & StrongPluginTypes
 & { [key in PluginTypes]?: any }

