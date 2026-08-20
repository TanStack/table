---
id: Header_CoreProperties
title: Header_CoreProperties
---

# Interface: Header\_CoreProperties\<TFeatures, TData, TValue\>

Defined in: [core/headers/coreHeadersFeature.types.ts:51](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/headers/coreHeadersFeature.types.ts#L51)

## Extended by

- [`Header_Header`](Header_Header.md)

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

***

### column

```ts
column: Column<TFeatures, TData, TValue>;
```

Defined in: [core/headers/coreHeadersFeature.types.ts:63](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/headers/coreHeadersFeature.types.ts#L63)

The header's associated column object.

***

### depth

```ts
depth: number;
```

Defined in: [core/headers/coreHeadersFeature.types.ts:67](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/headers/coreHeadersFeature.types.ts#L67)

The depth of the header, zero-indexed.

***

### headerGroup

```ts
headerGroup: HeaderGroup<TFeatures, TData> | null;
```

Defined in: [core/headers/coreHeadersFeature.types.ts:71](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/headers/coreHeadersFeature.types.ts#L71)

The header's associated header group object.

***

### id

```ts
id: string;
```

Defined in: [core/headers/coreHeadersFeature.types.ts:75](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/headers/coreHeadersFeature.types.ts#L75)

The unique identifier for the header.

***

### index

```ts
index: number;
```

Defined in: [core/headers/coreHeadersFeature.types.ts:79](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/headers/coreHeadersFeature.types.ts#L79)

The index for the header within the header group.

***

### isPlaceholder

```ts
isPlaceholder: boolean;
```

Defined in: [core/headers/coreHeadersFeature.types.ts:87](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/headers/coreHeadersFeature.types.ts#L87)

A boolean denoting if the header is a placeholder header. Placeholder
headers fill the rows above a shallow leaf column's real header so that
every header group row accounts for every visible column. Render them as
empty cells, or use `header.rowSpan` to merge each chain of placeholders
into one vertically spanning header cell.

***

### placeholderId?

```ts
optional placeholderId: string;
```

Defined in: [core/headers/coreHeadersFeature.types.ts:91](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/headers/coreHeadersFeature.types.ts#L91)

If the header is a placeholder header, this will be a unique header ID that does not conflict with any other headers across the table.

***

### rowSpan

```ts
rowSpan: number;
```

Defined in: [core/headers/coreHeadersFeature.types.ts:103](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/headers/coreHeadersFeature.types.ts#L103)

The number of header group rows the header should span when merging header
cells vertically. A leaf column that is shallower than the deepest leaf
column produces a chain of placeholder headers above its real header; the
placeholder at the top of the chain reports the chain's full span, and
every header it covers (including the real leaf header in the bottom row)
reports 0. To merge vertically, skip headers with a rowSpan of 0 and
render every other header with the `rowSpan` attribute and its column's
header content, even when it is a placeholder. Headers in even column
trees always report 1.

***

### subHeaders

```ts
subHeaders: Header<TFeatures, TData, TValue>[];
```

Defined in: [core/headers/coreHeadersFeature.types.ts:107](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/headers/coreHeadersFeature.types.ts#L107)

The header's hierarchical sub/child headers. Will be empty if the header's associated column is a leaf-column.

***

### table

```ts
table: Table_Internal<TFeatures, TData>;
```

Defined in: [core/headers/coreHeadersFeature.types.ts:111](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/headers/coreHeadersFeature.types.ts#L111)

Reference to the parent table instance.
