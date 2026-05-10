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

Defined in: [flexRender.ts:56](https://github.com/TanStack/table/blob/main/packages/lit-table/src/flexRender.ts#L56)

Simplified component wrapper of `flexRender`. Use this utility function to render headers, cells, or footers with custom markup.
Only one prop (`cell`, `header`, or `footer`) may be passed.

## Type Parameters

### TFeatures

`TFeatures` *extends* `TableFeatures`

### TData

`TData` *extends* `RowData`

### TValue

`TValue` *extends* `CellData` = `CellData`

## Example

```ts
${FlexRender({ cell })}
${FlexRender({ header })}
${FlexRender({ footer: header })}
```

This replaces calling `flexRender` directly like this:
```ts
flexRender(cell.column.columnDef.cell, cell.getContext())
flexRender(header.column.columnDef.header, header.getContext())
flexRender(footer.column.columnDef.footer, footer.getContext())
```
