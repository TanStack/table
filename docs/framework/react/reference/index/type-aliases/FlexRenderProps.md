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

Defined in: [FlexRender.tsx:63](https://github.com/TanStack/table/blob/main/packages/react-table/src/FlexRender.tsx#L63)

Simplified component wrapper of `flexRender`. Use this utility component to render headers, cells, or footers with custom markup.
Only one prop (`cell`, `header`, or `footer`) may be passed.

## Type Parameters

### TFeatures

`TFeatures` *extends* `TableFeatures`

### TData

`TData` *extends* `RowData`

### TValue

`TValue` *extends* `CellData` = `CellData`

## Examples

```ts
<FlexRender cell={cell} />
```

```ts
<FlexRender header={header} />
```

```ts
<FlexRender footer={footer} />
```
