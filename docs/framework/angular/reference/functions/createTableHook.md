---
id: createTableHook
title: createTableHook
---

# Function: createTableHook()

```ts
function createTableHook<TFeatures, TTableComponents, TCellComponents, THeaderComponents>(__namedParameters): CreateTableHookResult<TFeatures, TTableComponents, TCellComponents, THeaderComponents>;
```

Defined in: [helpers/createTableHook.ts:352](https://github.com/TanStack/table/blob/main/packages/angular-table/src/helpers/createTableHook.ts#L352)

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
