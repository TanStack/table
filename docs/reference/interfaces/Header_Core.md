---
id: Header_Core
title: Header_Core
---

# Interface: Header\_Core\<TFeatures, TData, TValue\>

Defined in: [packages/table-core/src/types/Header.ts:17](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/Header.ts#L17)

## Extends

- [`Header_Header`](Header_Header.md)\<`TFeatures`, `TData`, `TValue`\>

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md)

### TValue

`TValue` *extends* [`CellData`](../type-aliases/CellData.md) = [`CellData`](../type-aliases/CellData.md)

## Properties

### colSpan

```ts
colSpan: number;
```

Defined in: [packages/table-core/src/core/headers/coreHeadersFeature.types.ts:57](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/headers/coreHeadersFeature.types.ts#L57)

The col-span for the header.

#### Inherited from

[`Header_Header`](Header_Header.md).[`colSpan`](Header_Header.md#colspan)

***

### column

```ts
column: Column<TFeatures, TData, TValue>;
```

Defined in: [packages/table-core/src/core/headers/coreHeadersFeature.types.ts:61](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/headers/coreHeadersFeature.types.ts#L61)

The header's associated column object.

#### Inherited from

[`Header_Header`](Header_Header.md).[`column`](Header_Header.md#column)

***

### depth

```ts
depth: number;
```

Defined in: [packages/table-core/src/core/headers/coreHeadersFeature.types.ts:65](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/headers/coreHeadersFeature.types.ts#L65)

The depth of the header, zero-indexed based.

#### Inherited from

[`Header_Header`](Header_Header.md).[`depth`](Header_Header.md#depth)

***

### getContext()

```ts
getContext: () => HeaderContext<TFeatures, TData, TValue>;
```

Defined in: [packages/table-core/src/core/headers/coreHeadersFeature.types.ts:108](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/headers/coreHeadersFeature.types.ts#L108)

Returns the rendering context (or props) for column-based components like headers, footers and filters.

#### Returns

[`HeaderContext`](HeaderContext.md)\<`TFeatures`, `TData`, `TValue`\>

#### Inherited from

[`Header_Header`](Header_Header.md).[`getContext`](Header_Header.md#getcontext)

***

### getLeafHeaders()

```ts
getLeafHeaders: () => Header<TFeatures, TData, TValue>[];
```

Defined in: [packages/table-core/src/core/headers/coreHeadersFeature.types.ts:112](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/headers/coreHeadersFeature.types.ts#L112)

Returns the leaf headers hierarchically nested under this header.

#### Returns

[`Header`](../type-aliases/Header.md)\<`TFeatures`, `TData`, `TValue`\>[]

#### Inherited from

[`Header_Header`](Header_Header.md).[`getLeafHeaders`](Header_Header.md#getleafheaders)

***

### headerGroup

```ts
headerGroup: 
  | HeaderGroup<TFeatures, TData>
  | null;
```

Defined in: [packages/table-core/src/core/headers/coreHeadersFeature.types.ts:69](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/headers/coreHeadersFeature.types.ts#L69)

The header's associated header group object.

#### Inherited from

[`Header_Header`](Header_Header.md).[`headerGroup`](Header_Header.md#headergroup)

***

### id

```ts
id: string;
```

Defined in: [packages/table-core/src/core/headers/coreHeadersFeature.types.ts:73](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/headers/coreHeadersFeature.types.ts#L73)

The unique identifier for the header.

#### Inherited from

[`Header_Header`](Header_Header.md).[`id`](Header_Header.md#id)

***

### index

```ts
index: number;
```

Defined in: [packages/table-core/src/core/headers/coreHeadersFeature.types.ts:77](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/headers/coreHeadersFeature.types.ts#L77)

The index for the header within the header group.

#### Inherited from

[`Header_Header`](Header_Header.md).[`index`](Header_Header.md#index)

***

### isPlaceholder

```ts
isPlaceholder: boolean;
```

Defined in: [packages/table-core/src/core/headers/coreHeadersFeature.types.ts:81](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/headers/coreHeadersFeature.types.ts#L81)

A boolean denoting if the header is a placeholder header.

#### Inherited from

[`Header_Header`](Header_Header.md).[`isPlaceholder`](Header_Header.md#isplaceholder)

***

### placeholderId?

```ts
optional placeholderId: string;
```

Defined in: [packages/table-core/src/core/headers/coreHeadersFeature.types.ts:85](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/headers/coreHeadersFeature.types.ts#L85)

If the header is a placeholder header, this will be a unique header ID that does not conflict with any other headers across the table.

#### Inherited from

[`Header_Header`](Header_Header.md).[`placeholderId`](Header_Header.md#placeholderid)

***

### rowSpan

```ts
rowSpan: number;
```

Defined in: [packages/table-core/src/core/headers/coreHeadersFeature.types.ts:89](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/headers/coreHeadersFeature.types.ts#L89)

The row-span for the header.

#### Inherited from

[`Header_Header`](Header_Header.md).[`rowSpan`](Header_Header.md#rowspan)

***

### subHeaders

```ts
subHeaders: Header<TFeatures, TData, TValue>[];
```

Defined in: [packages/table-core/src/core/headers/coreHeadersFeature.types.ts:93](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/headers/coreHeadersFeature.types.ts#L93)

The header's hierarchical sub/child headers. Will be empty if the header's associated column is a leaf-column.

#### Inherited from

[`Header_Header`](Header_Header.md).[`subHeaders`](Header_Header.md#subheaders)

***

### table

```ts
table: Table<TFeatures, TData>;
```

Defined in: [packages/table-core/src/core/headers/coreHeadersFeature.types.ts:97](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/headers/coreHeadersFeature.types.ts#L97)

Reference to the parent table instance.

#### Inherited from

[`Header_Header`](Header_Header.md).[`table`](Header_Header.md#table)
