---
id: Table_Headers
title: Table_Headers
---

# Interface: Table\_Headers\<TFeatures, TData\>

Defined in: [core/headers/coreHeadersFeature.types.ts:8](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/headers/coreHeadersFeature.types.ts#L8)

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md)

## Properties

### getFlatHeaders()

```ts
getFlatHeaders: () => Header<TFeatures, TData, unknown>[];
```

Defined in: [core/headers/coreHeadersFeature.types.ts:25](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/headers/coreHeadersFeature.types.ts#L25)

Flattens every header from every header group, including parent and
placeholder headers.

#### Returns

[`Header`](../type-aliases/Header.md)\<`TFeatures`, `TData`, `unknown`\>[]

***

### getFooterGroups()

```ts
getFooterGroups: () => HeaderGroup<TFeatures, TData>[];
```

Defined in: [core/headers/coreHeadersFeature.types.ts:20](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/headers/coreHeadersFeature.types.ts#L20)

Builds footer groups by reversing the current header group order.

#### Returns

[`HeaderGroup`](../type-aliases/HeaderGroup.md)\<`TFeatures`, `TData`\>[]

***

### getHeaderGroups()

```ts
getHeaderGroups: () => HeaderGroup<TFeatures, TData>[];
```

Defined in: [core/headers/coreHeadersFeature.types.ts:16](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/headers/coreHeadersFeature.types.ts#L16)

Builds the visible header groups for the current column tree, visibility,
and pinning state.

#### Returns

[`HeaderGroup`](../type-aliases/HeaderGroup.md)\<`TFeatures`, `TData`\>[]

***

### getLeafHeaders()

```ts
getLeafHeaders: () => Header<TFeatures, TData, unknown>[];
```

Defined in: [core/headers/coreHeadersFeature.types.ts:29](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/headers/coreHeadersFeature.types.ts#L29)

Collects only leaf headers, excluding parent/group headers.

#### Returns

[`Header`](../type-aliases/Header.md)\<`TFeatures`, `TData`, `unknown`\>[]
