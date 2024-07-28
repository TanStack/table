---
id: flexRender
title: flexRender
---

# Function: flexRender()

```ts
function flexRender<TProps>(Comp, props): React.ReactNode | JSX.Element
```

If rendering headers, cells, or footers with custom markup, use flexRender instead of `cell.getValue()` or `cell.renderValue()`.

## Type Parameters

• **TProps** *extends* `object`

## Parameters

• **Comp**: [`Renderable`](../type-aliases/renderable.md)\<`TProps`\>

• **props**: `TProps`

## Returns

`React.ReactNode` \| `JSX.Element`

## Example

```ts
flexRender(cell.column.columnDef.cell, cell.getContext())
```

## Defined in

[react-table/src/FlexRender.tsx:37](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/react-table/src/FlexRender.tsx#L37)
