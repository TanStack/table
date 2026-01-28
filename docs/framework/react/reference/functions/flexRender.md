---
id: flexRender
title: flexRender
---

# Function: flexRender()

```ts
function flexRender<TProps>(Comp, props): ReactNode | Element;
```

Defined in: [FlexRender.tsx:45](https://github.com/TanStack/table/blob/main/packages/react-table/src/FlexRender.tsx#L45)

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

`ReactNode` \| `Element`

## Example

```ts
flexRender(cell.column.columnDef.cell, cell.getContext())
```
