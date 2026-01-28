---
id: Column_Internal
title: Column_Internal
---

# Type Alias: Column\_Internal\<TFeatures, TData, TValue\>

```ts
type Column_Internal<TFeatures, TData, TValue> = Column<TFeatures, TData, TValue> & object;
```

Defined in: [packages/table-core/src/types/Column.ts:80](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/Column.ts#L80)

## Type Declaration

### columnDef

```ts
columnDef: ColumnDefBase_All<TFeatures, TData, TValue>;
```

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](RowData.md)

### TValue

`TValue` = `unknown`
