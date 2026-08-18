---
id: TableHookContexts
title: TableHookContexts
---

# Interface: TableHookContexts\<TFeatures, TData\>

Defined in: [types.ts:310](https://github.com/TanStack/table/blob/main/packages/octane-table/src/types.ts#L310)

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

Defined in: [types.ts:315](https://github.com/TanStack/table/blob/main/packages/octane-table/src/types.ts#L315)

***

### headerContext

```ts
headerContext: Context<Header<any, any, any>>;
```

Defined in: [types.ts:316](https://github.com/TanStack/table/blob/main/packages/octane-table/src/types.ts#L316)

***

### tableContext

```ts
tableContext: Context<OctaneTable<any, any, TableState_ColumnSizing & TableState_ColumnResizing & TableState_RowExpanding & TableState_ColumnFiltering & TableState_RowPagination & TableState_ColumnGrouping & TableState_GlobalFiltering & TableState_ColumnOrdering & TableState_ColumnVisibility & TableState_RowPinning & TableState_RowSelection & TableState_CellSelection & TableState_ColumnPinning & TableState_RowSorting & TableState_WorkerRowModels>>;
```

Defined in: [types.ts:314](https://github.com/TanStack/table/blob/main/packages/octane-table/src/types.ts#L314)

***

### useCellContext()

```ts
useCellContext: <TValue>() => Cell<TFeatures, any, TValue>;
```

Defined in: [types.ts:321](https://github.com/TanStack/table/blob/main/packages/octane-table/src/types.ts#L321)

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

Defined in: [types.ts:326](https://github.com/TanStack/table/blob/main/packages/octane-table/src/types.ts#L326)

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

Defined in: [types.ts:317](https://github.com/TanStack/table/blob/main/packages/octane-table/src/types.ts#L317)

#### Type Parameters

##### TTableData

`TTableData` *extends* `RowData` = `TData`

#### Returns

[`OctaneTable`](../type-aliases/OctaneTable.md)\<`TFeatures`, `TTableData`\>
