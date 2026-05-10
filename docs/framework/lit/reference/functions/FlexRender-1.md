---
id: FlexRender
title: FlexRender
---

# Function: FlexRender()

```ts
function FlexRender<TFeatures, TData, TValue>(props): string | TemplateResult | null;
```

Defined in: [flexRender.ts:90](https://github.com/TanStack/table/blob/main/packages/lit-table/src/flexRender.ts#L90)

Simplified component wrapper of `flexRender`. Use this utility function to render headers, cells, or footers with custom markup.
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

`string` \| `TemplateResult` \| `null`

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
