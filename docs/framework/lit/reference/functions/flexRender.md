---
id: flexRender
title: flexRender
---

# Function: flexRender()

```ts
function flexRender<TProps>(Comp, props): string | TemplateResult | null;
```

Defined in: [flexRender.ts:22](https://github.com/TanStack/table/blob/main/packages/lit-table/src/flexRender.ts#L22)

Renders a Lit table template value with the provided context props.

Use this lower-level helper for custom header, cell, or footer renderers when
you already have the render function and context. `FlexRender` is the
convenience wrapper for table cell/header/footer objects.

## Type Parameters

### TProps

`TProps`

## Parameters

### Comp

`string` | `TemplateResult` | (`props`) => `string` \| `TemplateResult` | `undefined`

### props

`TProps`

## Returns

`string` \| `TemplateResult` \| `null`

## Example

```ts
flexRender(cell.column.columnDef.cell, cell.getContext())
```
