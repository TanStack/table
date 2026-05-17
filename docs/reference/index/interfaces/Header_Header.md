---
id: Header_Header
title: Header_Header
---

# Interface: Header\_Header\<TFeatures, TData, TValue\>

Defined in: [core/headers/coreHeadersFeature.types.ts:102](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/headers/coreHeadersFeature.types.ts#L102)

## Extends

- [`Header_CoreProperties`](Header_CoreProperties.md)\<`TFeatures`, `TData`, `TValue`\>

## Extended by

- [`Header_Core`](Header_Core.md)

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

Defined in: [core/headers/coreHeadersFeature.types.ts:59](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/headers/coreHeadersFeature.types.ts#L59)

The col-span for the header.

#### Inherited from

[`Header_CoreProperties`](Header_CoreProperties.md).[`colSpan`](Header_CoreProperties.md#colspan)

***

### column

```ts
column: Column<TFeatures, TData, TValue>;
```

Defined in: [core/headers/coreHeadersFeature.types.ts:63](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/headers/coreHeadersFeature.types.ts#L63)

The header's associated column object.

#### Inherited from

[`Header_CoreProperties`](Header_CoreProperties.md).[`column`](Header_CoreProperties.md#column)

***

### depth

```ts
depth: number;
```

Defined in: [core/headers/coreHeadersFeature.types.ts:67](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/headers/coreHeadersFeature.types.ts#L67)

The depth of the header, zero-indexed based.

#### Inherited from

[`Header_CoreProperties`](Header_CoreProperties.md).[`depth`](Header_CoreProperties.md#depth)

***

### getContext()

```ts
getContext: () => HeaderContext<TFeatures, TData, TValue>;
```

Defined in: [core/headers/coreHeadersFeature.types.ts:110](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/headers/coreHeadersFeature.types.ts#L110)

Returns the rendering context (or props) for column-based components like headers, footers and filters.

#### Returns

[`HeaderContext`](HeaderContext.md)\<`TFeatures`, `TData`, `TValue`\>

***

### getLeafHeaders()

```ts
getLeafHeaders: () => Header<TFeatures, TData, TValue>[];
```

Defined in: [core/headers/coreHeadersFeature.types.ts:114](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/headers/coreHeadersFeature.types.ts#L114)

Returns the leaf headers hierarchically nested under this header.

#### Returns

[`Header`](../type-aliases/Header.md)\<`TFeatures`, `TData`, `TValue`\>[]

***

### headerGroup

```ts
headerGroup: 
  | HeaderGroup<TFeatures, TData>
  | null;
```

Defined in: [core/headers/coreHeadersFeature.types.ts:71](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/headers/coreHeadersFeature.types.ts#L71)

The header's associated header group object.

#### Inherited from

[`Header_CoreProperties`](Header_CoreProperties.md).[`headerGroup`](Header_CoreProperties.md#headergroup)

***

### id

```ts
id: string;
```

Defined in: [core/headers/coreHeadersFeature.types.ts:75](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/headers/coreHeadersFeature.types.ts#L75)

The unique identifier for the header.

#### Inherited from

[`Header_CoreProperties`](Header_CoreProperties.md).[`id`](Header_CoreProperties.md#id)

***

### index

```ts
index: number;
```

Defined in: [core/headers/coreHeadersFeature.types.ts:79](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/headers/coreHeadersFeature.types.ts#L79)

The index for the header within the header group.

#### Inherited from

[`Header_CoreProperties`](Header_CoreProperties.md).[`index`](Header_CoreProperties.md#index)

***

### isPlaceholder

```ts
isPlaceholder: boolean;
```

Defined in: [core/headers/coreHeadersFeature.types.ts:83](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/headers/coreHeadersFeature.types.ts#L83)

A boolean denoting if the header is a placeholder header.

#### Inherited from

[`Header_CoreProperties`](Header_CoreProperties.md).[`isPlaceholder`](Header_CoreProperties.md#isplaceholder)

***

### placeholderId?

```ts
optional placeholderId: string;
```

Defined in: [core/headers/coreHeadersFeature.types.ts:87](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/headers/coreHeadersFeature.types.ts#L87)

If the header is a placeholder header, this will be a unique header ID that does not conflict with any other headers across the table.

#### Inherited from

[`Header_CoreProperties`](Header_CoreProperties.md).[`placeholderId`](Header_CoreProperties.md#placeholderid)

***

### rowSpan

```ts
rowSpan: number;
```

Defined in: [core/headers/coreHeadersFeature.types.ts:91](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/headers/coreHeadersFeature.types.ts#L91)

The row-span for the header.

#### Inherited from

[`Header_CoreProperties`](Header_CoreProperties.md).[`rowSpan`](Header_CoreProperties.md#rowspan)

***

### subHeaders

```ts
subHeaders: Header<TFeatures, TData, TValue>[];
```

Defined in: [core/headers/coreHeadersFeature.types.ts:95](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/headers/coreHeadersFeature.types.ts#L95)

The header's hierarchical sub/child headers. Will be empty if the header's associated column is a leaf-column.

#### Inherited from

[`Header_CoreProperties`](Header_CoreProperties.md).[`subHeaders`](Header_CoreProperties.md#subheaders)

***

### table

```ts
table: Table<TFeatures, TData>;
```

Defined in: [core/headers/coreHeadersFeature.types.ts:99](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/headers/coreHeadersFeature.types.ts#L99)

Reference to the parent table instance.

#### Inherited from

[`Header_CoreProperties`](Header_CoreProperties.md).[`table`](Header_CoreProperties.md#table)
