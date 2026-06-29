---
id: flexRender
title: flexRender
---

# Function: flexRender()

```ts
function flexRender(render, props): any;
```

Defined in: [packages/vue-table/src/FlexRender.ts:30](https://github.com/TanStack/table/blob/main/packages/vue-table/src/FlexRender.ts#L30)

If rendering headers, cells, or footers with custom markup, use flexRender instead of `cell.getValue()` or `cell.renderValue()`.

## Parameters

### render

`any`

### props

`any`

## Returns

`any`

## Example

```ts
flexRender(cell.column.columnDef.cell, cell.getContext())
```
