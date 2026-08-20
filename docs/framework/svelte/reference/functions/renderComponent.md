---
id: renderComponent
title: renderComponent
---

# Function: renderComponent()

```ts
function renderComponent<TComponent, TProps>(component, props?): RenderComponentConfig<TComponent>;
```

Defined in: [packages/svelte-table/src/render-component.ts:71](https://github.com/TanStack/table/blob/main/packages/svelte-table/src/render-component.ts#L71)

Wraps a Svelte component so it can be returned from a column definition
renderer such as `cell`, `header`, or `footer`.

This is only to be used with Svelte Components - use `renderSnippet` for Svelte Snippets.

## Type Parameters

### TComponent

`TComponent` *extends* `Component`\<`any`, \{
\}, `string`\>

### TProps

`TProps` *extends* `any`

## Parameters

### component

`TComponent`

A Svelte component

### props?

`TProps`

The props to pass to `component`

## Returns

`RenderComponentConfig`\<`TComponent`\>

A `RenderComponentConfig` object that helps svelte-table know how to render the header/cell component.

## Example

```ts
// +page.svelte
const defaultColumns = [
  columnHelper.accessor('name', {
    header: header => renderComponent(SortHeader, { label: 'Name', header }),
  }),
  columnHelper.accessor('state', {
    header: header => renderComponent(SortHeader, { label: 'State', header }),
  }),
]
```

## See

[https://tanstack.com/table/latest/docs/guide/column-defs](https://tanstack.com/table/latest/docs/guide/column-defs)
