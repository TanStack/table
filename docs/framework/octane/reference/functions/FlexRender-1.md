---
id: FlexRender
title: FlexRender
---

# Function: FlexRender()

```ts
function FlexRender<TFeatures, TData, TValue>(props): unknown;
```

Defined in: [FlexRender.ts:54](https://github.com/TanStack/table/blob/main/packages/octane-table/src/FlexRender.ts#L54)

Simplified component wrapper of [flexRender](flexRender.md). Use this utility component
to render headers, cells, or footers with custom markup. Only one prop
(`cell`, `header`, or `footer`) may be passed.

## Type Parameters

### TFeatures

`TFeatures` *extends* `TableFeatures`

### TData

`TData` *extends* `RowData`

### TValue

`TValue` *extends* `unknown` = `unknown`

## Parameters

### props

[`FlexRenderProps`](../type-aliases/FlexRenderProps.md)\<`TFeatures`, `TData`, `TValue`\>

## Returns

`unknown`

## Example

```tsx
<FlexRender cell={cell} />
<FlexRender header={header} />
<FlexRender footer={footer} />
```

This replaces calling `flexRender` directly like this:
```tsx
flexRender(cell.column.columnDef.cell, cell.getContext())
flexRender(header.column.columnDef.header, header.getContext())
flexRender(footer.column.columnDef.footer, footer.getContext())
```
