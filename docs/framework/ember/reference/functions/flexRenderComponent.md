---
id: flexRenderComponent
title: flexRenderComponent
---

# Function: flexRenderComponent()

## Call Signature

```ts
function flexRenderComponent<TFeatures, TData, TValue>(component): FlexRenderComponentConfig<TFeatures, TData, TValue, undefined>;
```

Defined in: packages/ember-table/declarations/flex-render-helpers.d.ts:23

### Type Parameters

#### TFeatures

`TFeatures` *extends* `TableFeatures`

#### TData

`TData` *extends* `RowData`

#### TValue

`TValue` *extends* `unknown`

### Parameters

#### component

`FlexRenderableComponent`\<`TFeatures`, `TData`, `TValue`, `undefined`\>

### Returns

[`FlexRenderComponentConfig`](../classes/FlexRenderComponentConfig.md)\<`TFeatures`, `TData`, `TValue`, `undefined`\>

## Call Signature

```ts
function flexRenderComponent<TFeatures, TData, TValue, TOptions>(component, options): FlexRenderComponentConfig<TFeatures, TData, TValue, TOptions>;
```

Defined in: packages/ember-table/declarations/flex-render-helpers.d.ts:24

### Type Parameters

#### TFeatures

`TFeatures` *extends* `TableFeatures`

#### TData

`TData` *extends* `RowData`

#### TValue

`TValue` *extends* `unknown`

#### TOptions

`TOptions`

### Parameters

#### component

`FlexRenderableComponent`\<`TFeatures`, `TData`, `TValue`, `TOptions`\>

#### options

`TOptions`

### Returns

[`FlexRenderComponentConfig`](../classes/FlexRenderComponentConfig.md)\<`TFeatures`, `TData`, `TValue`, `TOptions`\>
