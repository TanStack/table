---
id: Table_Headers
title: Table_Headers
---

# Interface: Table\_Headers\<TFeatures, TData\>

Defined in: [packages/table-core/src/core/headers/coreHeadersFeature.types.ts:8](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/headers/coreHeadersFeature.types.ts#L8)

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

Defined in: [packages/table-core/src/core/headers/coreHeadersFeature.types.ts:23](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/headers/coreHeadersFeature.types.ts#L23)

Returns headers for all columns in the table, including parent headers.

#### Returns

[`Header`](../type-aliases/Header.md)\<`TFeatures`, `TData`, `unknown`\>[]

***

### getFooterGroups()

```ts
getFooterGroups: () => HeaderGroup<TFeatures, TData>[];
```

Defined in: [packages/table-core/src/core/headers/coreHeadersFeature.types.ts:19](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/headers/coreHeadersFeature.types.ts#L19)

Returns the footer groups for the table.

#### Returns

[`HeaderGroup`](../type-aliases/HeaderGroup.md)\<`TFeatures`, `TData`\>[]

***

### getHeaderGroups()

```ts
getHeaderGroups: () => HeaderGroup<TFeatures, TData>[];
```

Defined in: [packages/table-core/src/core/headers/coreHeadersFeature.types.ts:15](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/headers/coreHeadersFeature.types.ts#L15)

Returns all header groups for the table.

#### Returns

[`HeaderGroup`](../type-aliases/HeaderGroup.md)\<`TFeatures`, `TData`\>[]

***

### getLeafHeaders()

```ts
getLeafHeaders: () => Header<TFeatures, TData, unknown>[];
```

Defined in: [packages/table-core/src/core/headers/coreHeadersFeature.types.ts:27](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/headers/coreHeadersFeature.types.ts#L27)

Returns headers for all leaf columns in the table, (not including parent headers).

#### Returns

[`Header`](../type-aliases/Header.md)\<`TFeatures`, `TData`, `unknown`\>[]
