---
id: StringOrTemplateHeader
title: StringOrTemplateHeader
---

# Type Alias: StringOrTemplateHeader\<TFeatures, TData, TValue\>

```ts
type StringOrTemplateHeader<TFeatures, TData, TValue> = 
  | string
| ColumnDefTemplate<HeaderContext<TFeatures, TData, TValue>>;
```

Defined in: [packages/table-core/src/types/ColumnDef.ts:39](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/ColumnDef.ts#L39)

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](RowData.md)

### TValue

`TValue` *extends* [`CellData`](CellData.md) = [`CellData`](CellData.md)
