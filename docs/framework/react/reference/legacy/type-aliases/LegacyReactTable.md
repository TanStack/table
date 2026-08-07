---
id: LegacyReactTable
title: LegacyReactTable
---

# ~~Type Alias: LegacyReactTable\<TData\>~~

```ts
type LegacyReactTable<TData> = ReactTable<LegacyFeatures, TData, TableState<LegacyFeatures>> & object;
```

Defined in: [react-table/src/useLegacyTable.ts:290](https://github.com/TanStack/table/blob/main/packages/react-table/src/useLegacyTable.ts#L290)

Legacy table instance type that includes the v8-style `getState()` method.

## Type Declaration

### ~~getState()~~

```ts
getState: () => TableState<LegacyFeatures>;
```

Returns the current table state.

#### Returns

`TableState`\<[`LegacyFeatures`](../interfaces/LegacyFeatures.md)\>

#### Deprecated

In v9, access state directly via `table.state` or use `table.state` for the full state.

### ~~setState()~~

```ts
setState: (state) => void;
```

Sets the current table state.

#### Parameters

##### state

`TableState`\<[`LegacyFeatures`](../interfaces/LegacyFeatures.md)\>

#### Returns

`void`

#### Deprecated

In v9, access state directly via `table.baseAtoms`

## Type Parameters

### TData

`TData` *extends* `RowData`

## Deprecated

Use `useTable` with explicit state selection instead.
