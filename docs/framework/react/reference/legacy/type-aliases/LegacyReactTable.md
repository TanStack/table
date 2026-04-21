---
id: LegacyReactTable
title: LegacyReactTable
---

# ~~Type Alias: LegacyReactTable\<TData\>~~

```ts
type LegacyReactTable<TData> = ReactTable<StockFeatures, TData, TableState<StockFeatures>> & object;
```

Defined in: [useLegacyTable.ts:275](https://github.com/TanStack/table/blob/main/packages/react-table/src/useLegacyTable.ts#L275)

Legacy table instance type that includes the v8-style `getState()` method.

## Type Declaration

### ~~getState()~~

```ts
getState: () => TableState<StockFeatures>;
```

Returns the current table state.

#### Returns

`TableState`\<`StockFeatures`\>

#### Deprecated

In v9, access state directly via `table.state` or use `table.store.state` for the full state.

### ~~setState()~~

```ts
setState: (state) => void;
```

Sets the current table state.

#### Parameters

##### state

`TableState`\<`StockFeatures`\>

#### Returns

`void`

#### Deprecated

In v9, access state directly via `table.baseAtoms`

## Type Parameters

### TData

`TData` *extends* `RowData`

## Deprecated

Use `useTable` with explicit state selection instead.
