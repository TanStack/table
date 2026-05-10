---
id: FlexRender
title: FlexRender
---

# Function: FlexRender()

```ts
function FlexRender<TFeatures, TData, TValue>(props): ComponentChild;
```

Defined in: [FlexRender.tsx:98](https://github.com/TanStack/table/blob/main/packages/preact-table/src/FlexRender.tsx#L98)

Simplified component wrapper of `flexRender`. Use this utility component to render headers, cells, or footers with custom markup.
Only one prop (`cell`, `header`, or `footer`) may be passed.

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

`ComponentChild`

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
