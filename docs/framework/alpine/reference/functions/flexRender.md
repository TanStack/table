---
id: flexRender
title: flexRender
---

# Function: flexRender()

```ts
function flexRender<TProps>(render, props): any;
```

Defined in: [flexRender.ts:22](https://github.com/TanStack/table/blob/main/packages/alpine-table/src/flexRender.ts#L22)

Renders an Alpine table value with the provided context props.

Use this lower-level helper for custom header, cell, or footer renderers when
you already have the render function and context. `FlexRender` is the
convenience wrapper for table cell/header/footer objects. Renderers typically
return a string of markup that you render into the DOM with `x-html`.

## Type Parameters

### TProps

`TProps` *extends* `object`

## Parameters

### render

`any`

### props

`TProps`

## Returns

`any`

## Example

```ts
flexRender(cell.column.columnDef.cell, cell.getContext())
```
