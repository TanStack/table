---
id: renderSnippet
title: renderSnippet
---

# Function: renderSnippet()

```ts
function renderSnippet<TProps>(snippet, params?): RenderSnippetConfig<TProps>;
```

Defined in: [packages/svelte-table/src/render-component.ts:104](https://github.com/TanStack/table/blob/main/packages/svelte-table/src/render-component.ts#L104)

Wraps a Svelte snippet so it can be returned from a column definition
renderer such as `cell`, `header`, or `footer`.

*The snippet must only take one parameter.*

This is only to be used with Snippets - use `renderComponent` for Svelte Components.

## Type Parameters

### TProps

`TProps`

## Parameters

### snippet

`Snippet`\<\[`TProps`\]\>

The snippet to render.

### params?

`TProps`

The single parameter object passed to the snippet.

## Returns

`RenderSnippetConfig`\<`TProps`\>

A `RenderSnippetConfig` consumed by the Svelte `FlexRender` component.

## Example

```ts
// +page.svelte
const defaultColumns = [
  columnHelper.accessor('name', {
    cell: cell => renderSnippet(nameSnippet, { name: cell.row.name }),
  }),
  columnHelper.accessor('state', {
    cell: cell => renderSnippet(stateSnippet, { state: cell.row.state }),
  }),
]
```

## See

[https://tanstack.com/table/latest/docs/guide/column-defs](https://tanstack.com/table/latest/docs/guide/column-defs)
