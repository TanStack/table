---
id: flexRender
title: flexRender
---

# Function: flexRender()

```ts
function flexRender<TProps>(Comp, props): Element;
```

Defined in: [FlexRender.tsx:23](https://github.com/TanStack/table/blob/main/packages/solid-table/src/FlexRender.tsx#L23)

Renders a Solid table template value with the provided context props.

Use this for custom header, cell, or footer renderers when you need the
lower-level function form. Most Solid UIs can use the `FlexRender` component
instead.

## Type Parameters

### TProps

`TProps`

## Parameters

### Comp

`Element` | (`_props`) => `Element`

### props

`TProps`

## Returns

`Element`

## Example

```tsx
flexRender(cell.column.columnDef.cell, cell.getContext())
```
