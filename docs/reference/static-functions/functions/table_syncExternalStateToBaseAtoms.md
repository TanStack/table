---
id: table_syncExternalStateToBaseAtoms
title: table_syncExternalStateToBaseAtoms
---

# Function: table\_syncExternalStateToBaseAtoms()

```ts
function table_syncExternalStateToBaseAtoms<TFeatures, TData>(table): void;
```

Defined in: [core/table/coreTablesFeature.utils.ts:18](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/table/coreTablesFeature.utils.ts#L18)

Synchronizes externally controlled state slices into the table's base atoms.

This keeps legacy `options.state` values reflected in the atom graph so
derived atoms, stores, and table APIs read a consistent snapshot.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../../index/interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../../index/type-aliases/RowData.md)

## Parameters

### table

[`Table_Internal`](../../index/type-aliases/Table_Internal.md)\<`TFeatures`, `TData`\>

## Returns

`void`

## Example

```ts
table_syncExternalStateToBaseAtoms(table)
```
