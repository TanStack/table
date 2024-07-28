---
id: Table_Headers
title: Table_Headers
---

# Interface: Table\_Headers\<TFeatures, TData\>

## Extended by

- [`Table_Core`](table_core.md)

## Type Parameters

• **TFeatures** *extends* [`TableFeatures`](tablefeatures.md)

• **TData** *extends* [`RowData`](../type-aliases/rowdata.md)

## Properties

### getFlatHeaders()

```ts
getFlatHeaders: () => Header<TFeatures, TData, unknown>[];
```

Returns headers for all columns in the table, including parent headers.

#### Returns

[`Header`](../type-aliases/header.md)\<`TFeatures`, `TData`, `unknown`\>[]

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/core/headers#getflatheaders)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/headers)

#### Defined in

[core/headers/Headers.types.ts:38](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/core/headers/Headers.types.ts#L38)

***

### getFooterGroups()

```ts
getFooterGroups: () => HeaderGroup<TFeatures, TData>[];
```

Returns the footer groups for the table.

#### Returns

[`HeaderGroup`](headergroup.md)\<`TFeatures`, `TData`\>[]

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/core/headers#getfootergroups)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/headers)

#### Defined in

[core/headers/Headers.types.ts:32](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/core/headers/Headers.types.ts#L32)

***

### getHeaderGroups()

```ts
getHeaderGroups: () => HeaderGroup<TFeatures, TData>[];
```

Returns all header groups for the table.

#### Returns

[`HeaderGroup`](headergroup.md)\<`TFeatures`, `TData`\>[]

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/core/headers#getheadergroups)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/headers)

#### Defined in

[core/headers/Headers.types.ts:26](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/core/headers/Headers.types.ts#L26)

***

### getLeafHeaders()

```ts
getLeafHeaders: () => Header<TFeatures, TData, unknown>[];
```

Returns headers for all leaf columns in the table, (not including parent headers).

#### Returns

[`Header`](../type-aliases/header.md)\<`TFeatures`, `TData`, `unknown`\>[]

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/core/headers#getleafheaders)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/headers)

#### Defined in

[core/headers/Headers.types.ts:44](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/core/headers/Headers.types.ts#L44)
