---
id: TableHookContexts
title: TableHookContexts
---

# Interface: TableHookContexts\<TFeatures, TData\>

Defined in: [types.ts:313](https://github.com/TanStack/table/blob/main/packages/octane-table/src/types.ts#L313)

The object returned by `createTableHookContexts`: three scoped octane
contexts plus matching context hooks.

## Type Parameters

### TFeatures

`TFeatures` *extends* `TableFeatures`

### TData

`TData` *extends* `RowData`

## Properties

### cellContext

```ts
cellContext: Context<Cell<any, any, any>>;
```

Defined in: [types.ts:318](https://github.com/TanStack/table/blob/main/packages/octane-table/src/types.ts#L318)

***

### headerContext

```ts
headerContext: Context<Header<any, any, any>>;
```

Defined in: [types.ts:319](https://github.com/TanStack/table/blob/main/packages/octane-table/src/types.ts#L319)

***

### tableContext

```ts
tableContext: Context<OctaneTable<any, any, TableState_ColumnResizing & TableState_RowPinning & TableState_RowSelection & TableState_ColumnOrdering & TableState_ColumnFiltering & TableState_GlobalFiltering & TableState_RowPagination & TableState_RowSorting & TableState_ColumnGrouping & TableState_ColumnVisibility & TableState_CellSelection & TableState_ColumnPinning & TableState_ColumnSizing & TableState_RowExpanding & TableState_WorkerRowModels>>;
```

Defined in: [types.ts:317](https://github.com/TanStack/table/blob/main/packages/octane-table/src/types.ts#L317)

***

### useCellContext()

```ts
useCellContext: <TValue>() => Cell<TFeatures, any, TValue>;
```

Defined in: [types.ts:324](https://github.com/TanStack/table/blob/main/packages/octane-table/src/types.ts#L324)

#### Type Parameters

##### TValue

`TValue` *extends* `unknown` = `unknown`

#### Returns

`Cell`\<`TFeatures`, `any`, `TValue`\>

***

### useHeaderContext()

```ts
useHeaderContext: <TValue>() => Header<TFeatures, any, TValue>;
```

Defined in: [types.ts:329](https://github.com/TanStack/table/blob/main/packages/octane-table/src/types.ts#L329)

#### Type Parameters

##### TValue

`TValue` *extends* `unknown` = `unknown`

#### Returns

`Header`\<`TFeatures`, `any`, `TValue`\>

***

### useTableContext()

```ts
useTableContext: <TTableData>() => OctaneTable<TFeatures, TTableData>;
```

Defined in: [types.ts:320](https://github.com/TanStack/table/blob/main/packages/octane-table/src/types.ts#L320)

#### Type Parameters

##### TTableData

`TTableData` *extends* `RowData` = `TData`

#### Returns

[`OctaneTable`](../type-aliases/OctaneTable.md)\<`TFeatures`, `TTableData`\>
