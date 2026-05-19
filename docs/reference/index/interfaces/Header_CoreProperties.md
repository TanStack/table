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

The depth of the header, zero-indexed based.

***

### headerGroup

```ts
headerGroup: 
  | HeaderGroup<TFeatures, TData>
  | null;
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

Defined in: [core/headers/coreHeadersFeature.types.ts:83](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/headers/coreHeadersFeature.types.ts#L83)

A boolean denoting if the header is a placeholder header.

***

### placeholderId?

```ts
optional placeholderId: string;
```

Defined in: [core/headers/coreHeadersFeature.types.ts:87](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/headers/coreHeadersFeature.types.ts#L87)

If the header is a placeholder header, this will be a unique header ID that does not conflict with any other headers across the table.

***

### rowSpan

```ts
rowSpan: number;
```

Defined in: [core/headers/coreHeadersFeature.types.ts:91](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/headers/coreHeadersFeature.types.ts#L91)

The row-span for the header.

***

### subHeaders

```ts
subHeaders: Header<TFeatures, TData, TValue>[];
```

Defined in: [core/headers/coreHeadersFeature.types.ts:95](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/headers/coreHeadersFeature.types.ts#L95)

The header's hierarchical sub/child headers. Will be empty if the header's associated column is a leaf-column.

***

### table

```ts
table: Table<TFeatures, TData>;
```

Defined in: [core/headers/coreHeadersFeature.types.ts:99](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/headers/coreHeadersFeature.types.ts#L99)

Reference to the parent table instance.
