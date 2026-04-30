---
id: constructReactivityFeature
title: constructReactivityFeature
---

# Function: constructReactivityFeature()

```ts
function constructReactivityFeature<TFeatures, TData>(bindings): TableFeature<TableReactivityFeatureConstructors<TFeatures, TData>>;
```

Defined in: [features/table-reactivity/tableReactivityFeature.ts:10](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/table-reactivity/tableReactivityFeature.ts#L10)

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md)

## Parameters

### bindings

#### optionsNotifier?

() => `unknown`

#### stateNotifier?

() => `unknown`

## Returns

[`TableFeature`](../interfaces/TableFeature.md)\<[`TableReactivityFeatureConstructors`](../interfaces/TableReactivityFeatureConstructors.md)\<`TFeatures`, `TData`\>\>
