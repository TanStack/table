---
id: FlexRenderProps
title: FlexRenderProps
---

# Type Alias: FlexRenderProps\<TFeatures, TData, TValue\>

```ts
type FlexRenderProps<TFeatures, TData, TValue> =
  | {
  cell: Cell<TFeatures, TData, TValue>;
  footer?: never;
  header?: never;
}
  | {
  cell?: never;
  footer?: never;
  header: Header<TFeatures, TData, TValue>;
}
  | {
  cell?: never;
  footer: Header<TFeatures, TData, TValue>;
  header?: never;
};
```

Defined in: [types.ts:78](https://github.com/TanStack/table/blob/main/packages/octane-table/src/types.ts#L78)

Props for the [FlexRender](../functions/FlexRender-1.md) component. Exactly one of `cell`, `header`,
or `footer` may be passed.

## Type Parameters

### TFeatures

`TFeatures` *extends* `TableFeatures`

### TData

`TData` *extends* `RowData`

### TValue

`TValue` *extends* `CellData` = `CellData`
