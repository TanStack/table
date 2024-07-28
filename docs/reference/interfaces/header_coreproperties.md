---
id: Header_CoreProperties
title: Header_CoreProperties
---

# Interface: Header\_CoreProperties\<TFeatures, TData, TValue\>

## Extended by

- [`Header_Header`](header_header.md)

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

#### Defined in

[core/headers/Headers.types.ts:88](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/core/headers/Headers.types.ts#L88)

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

#### Defined in

[core/headers/Headers.types.ts:130](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/core/headers/Headers.types.ts#L130)
