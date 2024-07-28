---
id: Header_Header
title: Header_Header
---

# Interface: Header\_Header\<TFeatures, TData, TValue\>

## Extends

- [`Header_CoreProperties`](header_coreproperties.md)\<`TFeatures`, `TData`, `TValue`\>

## Type Parameters

• **TFeatures** *extends* [`TableFeatures`](tablefeatures.md)

• **TData** *extends* [`RowData`](../type-aliases/rowdata.md)

• **TValue** *extends* [`CellData`](../type-aliases/celldata.md) = [`CellData`](../type-aliases/celldata.md)

## Properties

### colSpan

```ts
colSpan: number;
```

The col-span for the header.

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/core/header#colspan)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/headers)

#### Inherited from

[`Header_CoreProperties`](header_coreproperties.md).[`colSpan`](Header_CoreProperties.md#colspan)

#### Defined in

[core/headers/Headers.types.ts:76](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/core/headers/Headers.types.ts#L76)

***

### column

```ts
column: Column<TFeatures, TData, TValue>;
```

The header's associated column object.

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/core/header#column)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/headers)

#### Inherited from

[`Header_CoreProperties`](header_coreproperties.md).[`column`](Header_CoreProperties.md#column)

#### Defined in

[core/headers/Headers.types.ts:82](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/core/headers/Headers.types.ts#L82)

***

### depth

```ts
depth: number;
```

The depth of the header, zero-indexed based.

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/core/header#depth)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/headers)

#### Inherited from

[`Header_CoreProperties`](header_coreproperties.md).[`depth`](Header_CoreProperties.md#depth)

#### Defined in

[core/headers/Headers.types.ts:88](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/core/headers/Headers.types.ts#L88)

***

### getContext()

```ts
getContext: () => HeaderContext<TFeatures, TData, TValue>;
```

Returns the rendering context (or props) for column-based components like headers, footers and filters.

#### Returns

[`HeaderContext`](headercontext.md)\<`TFeatures`, `TData`, `TValue`\>

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/core/header#getcontext)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/headers)

#### Defined in

[core/headers/Headers.types.ts:143](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/core/headers/Headers.types.ts#L143)

***

### getLeafHeaders()

```ts
getLeafHeaders: () => Header<TFeatures, TData, TValue>[];
```

Returns the leaf headers hierarchically nested under this header.

#### Returns

[`Header`](../type-aliases/header.md)\<`TFeatures`, `TData`, `TValue`\>[]

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/core/header#getleafheaders)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/headers)

#### Defined in

[core/headers/Headers.types.ts:149](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/core/headers/Headers.types.ts#L149)

***

### headerGroup

```ts
headerGroup: null | HeaderGroup<TFeatures, TData>;
```

The header's associated header group object.

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/core/header#headergroup)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/headers)

#### Inherited from

[`Header_CoreProperties`](header_coreproperties.md).[`headerGroup`](Header_CoreProperties.md#headergroup)

#### Defined in

[core/headers/Headers.types.ts:94](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/core/headers/Headers.types.ts#L94)

***

### id

```ts
id: string;
```

The unique identifier for the header.

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/core/header#id)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/headers)

#### Inherited from

[`Header_CoreProperties`](header_coreproperties.md).[`id`](Header_CoreProperties.md#id)

#### Defined in

[core/headers/Headers.types.ts:100](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/core/headers/Headers.types.ts#L100)

***

### index

```ts
index: number;
```

The index for the header within the header group.

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/core/header#index)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/headers)

#### Inherited from

[`Header_CoreProperties`](header_coreproperties.md).[`index`](Header_CoreProperties.md#index)

#### Defined in

[core/headers/Headers.types.ts:106](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/core/headers/Headers.types.ts#L106)

***

### isPlaceholder

```ts
isPlaceholder: boolean;
```

A boolean denoting if the header is a placeholder header.

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/core/header#isplaceholder)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/headers)

#### Inherited from

[`Header_CoreProperties`](header_coreproperties.md).[`isPlaceholder`](Header_CoreProperties.md#isplaceholder)

#### Defined in

[core/headers/Headers.types.ts:112](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/core/headers/Headers.types.ts#L112)

***

### placeholderId?

```ts
optional placeholderId: string;
```

If the header is a placeholder header, this will be a unique header ID that does not conflict with any other headers across the table.

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/core/header#placeholderid)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/headers)

#### Inherited from

[`Header_CoreProperties`](header_coreproperties.md).[`placeholderId`](Header_CoreProperties.md#placeholderid)

#### Defined in

[core/headers/Headers.types.ts:118](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/core/headers/Headers.types.ts#L118)

***

### rowSpan

```ts
rowSpan: number;
```

The row-span for the header.

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/core/header#rowspan)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/headers)

#### Inherited from

[`Header_CoreProperties`](header_coreproperties.md).[`rowSpan`](Header_CoreProperties.md#rowspan)

#### Defined in

[core/headers/Headers.types.ts:124](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/core/headers/Headers.types.ts#L124)

***

### subHeaders

```ts
subHeaders: Header<TFeatures, TData, TValue>[];
```

The header's hierarchical sub/child headers. Will be empty if the header's associated column is a leaf-column.

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/core/header#subheaders)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/headers)

#### Inherited from

[`Header_CoreProperties`](header_coreproperties.md).[`subHeaders`](Header_CoreProperties.md#subheaders)

#### Defined in

[core/headers/Headers.types.ts:130](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/core/headers/Headers.types.ts#L130)
