---
id: Column_Internal
title: Column_Internal
---

# Type Alias: Column\_Internal\<TFeatures, TData, TValue\>

```ts
type Column_Internal<TFeatures, TData, TValue>: Column<TFeatures, TData, TValue> & object;
```

## Type declaration

### columnDef

```ts
columnDef: ColumnDefBase_All<TFeatures, TData, TValue>;
```

## Type Parameters

• **TFeatures** *extends* [`TableFeatures`](tablefeatures.md)

• **TData** *extends* [`RowData`](rowdata.md)

• **TValue** = `unknown`

## Defined in

[types/Column.ts:46](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/Column.ts#L46)
