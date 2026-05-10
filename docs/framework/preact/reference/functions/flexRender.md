---
id: flexRender
title: flexRender
---

# Function: flexRender()

```ts
function flexRender<TProps>(Comp, props): ComponentChild | Element;
```

Defined in: [FlexRender.tsx:46](https://github.com/TanStack/table/blob/main/packages/preact-table/src/FlexRender.tsx#L46)

If rendering headers, cells, or footers with custom markup, use flexRender instead of `cell.getValue()` or `cell.renderValue()`.

## Type Parameters

### TProps

`TProps` *extends* `object`

## Parameters

### Comp

[`Renderable`](../type-aliases/Renderable.md)\<`TProps`\>

### props

`TProps`

## Returns

`ComponentChild` \| `Element`

## Example

```ts
flexRender(cell.column.columnDef.cell, cell.getContext())
```
