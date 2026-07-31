---
id: flexRender
title: flexRender
---

# Function: flexRender()

```ts
function flexRender<TProps>(Comp, props): unknown;
```

Defined in: [FlexRender.ts:24](https://github.com/TanStack/table/blob/main/packages/octane-table/src/FlexRender.ts#L24)

If rendering headers, cells, or footers with custom markup, use `flexRender`
instead of `cell.getValue()` or `cell.renderValue()`.

## Type Parameters

### TProps

`TProps` *extends* `object`

## Parameters

### Comp

[`Renderable`](../type-aliases/Renderable.md)\<`TProps`\>

### props

`TProps`

## Returns

`unknown`

## Example

```ts
flexRender(cell.column.columnDef.cell, cell.getContext())

Port note: upstream additionally detects class components and
`react.memo`/`react.forward_ref` exotic objects. Both branches are dead in
octane — there are no class components or `forwardRef`, and octane's `memo()`
returns a plain function — so a component is exactly `typeof === 'function'`.
The descriptor `createElement` returns renders at value position; non-component
values (strings, numbers, pre-created descriptors) pass through as-is.
```
