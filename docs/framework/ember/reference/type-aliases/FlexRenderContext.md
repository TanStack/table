---
id: FlexRenderContext
title: FlexRenderContext
---

# Type Alias: FlexRenderContext\<TFeatures, TData, TValue\>

```ts
type FlexRenderContext<TFeatures, TData, TValue> = 
  | CellContext<TFeatures, TData, TValue>
| HeaderContext<TFeatures, TData, TValue>;
```

Defined in: packages/ember-table/declarations/flex-render-helpers.d.ts:4

## Type Parameters

### TFeatures

`TFeatures` *extends* `TableFeatures` = `TableFeatures`

### TData

`TData` *extends* `RowData` = `RowData`

### TValue

`TValue` *extends* `CellData` = `CellData`
