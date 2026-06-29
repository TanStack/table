---
id: createTableHook
title: createTableHook
---

# Function: createTableHook()

```ts
function createTableHook<TFeatures, TTableComponents, TCellComponents, THeaderComponents>(__namedParameters): CreateTableHookResult<TFeatures, TTableComponents, TCellComponents, THeaderComponents>;
```

Defined in: [packages/angular-table/src/helpers/createTableHook.ts:364](https://github.com/TanStack/table/blob/main/packages/angular-table/src/helpers/createTableHook.ts#L364)

Creates app-scoped Angular table helpers with features, row models, and
renderable component maps pre-bound.

Use this when an app or design system wants typed `injectAppTable`,
pre-bound column helpers, and typed table/cell/header context injection
helpers without repeating the same feature and component generics.

## Type Parameters

### TFeatures

`TFeatures` *extends* `TableFeatures`

### TTableComponents

`TTableComponents` *extends* `Record`\<`string`, [`RenderableComponent`](../type-aliases/RenderableComponent.md)\>

### TCellComponents

`TCellComponents` *extends* `Record`\<`string`, [`RenderableComponent`](../type-aliases/RenderableComponent.md)\>

### THeaderComponents

`THeaderComponents` *extends* `Record`\<`string`, [`RenderableComponent`](../type-aliases/RenderableComponent.md)\>

## Parameters

### \_\_namedParameters

[`CreateTableContextOptions`](../type-aliases/CreateTableContextOptions.md)\<`TFeatures`, `TTableComponents`, `TCellComponents`, `THeaderComponents`\>

## Returns

[`CreateTableHookResult`](../type-aliases/CreateTableHookResult.md)\<`TFeatures`, `TTableComponents`, `TCellComponents`, `THeaderComponents`\>

## Example

```ts
const { injectAppTable, createAppColumnHelper } = createTableHook({
  features,
  tableComponents: {},
  cellComponents: {},
  headerComponents: {},
})
```
