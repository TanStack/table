---
id: Header_CoreProperties
title: Header_CoreProperties
---

# Interface: Header\_CoreProperties\<TFeatures, TData, TValue\>

Defined in: [core/headers/coreHeadersFeature.types.ts:49](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/headers/coreHeadersFeature.types.ts#L49)

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

Defined in: [core/headers/coreHeadersFeature.types.ts:57](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/headers/coreHeadersFeature.types.ts#L57)

The col-span for the header.

***

### column

```ts
column: Column<TFeatures, TData, TValue>;
```

Defined in: [core/headers/coreHeadersFeature.types.ts:61](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/headers/coreHeadersFeature.types.ts#L61)

The header's associated column object.

***

### depth

```ts
depth: number;
```

Defined in: [core/headers/coreHeadersFeature.types.ts:65](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/headers/coreHeadersFeature.types.ts#L65)

The depth of the header, zero-indexed based.

***

### headerGroup

```ts
headerGroup: 
  | HeaderGroup<TFeatures, TData>
  | null;
```

Defined in: [core/headers/coreHeadersFeature.types.ts:69](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/headers/coreHeadersFeature.types.ts#L69)

The header's associated header group object.

***

### id

```ts
id: string;
```

Defined in: [core/headers/coreHeadersFeature.types.ts:73](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/headers/coreHeadersFeature.types.ts#L73)

The unique identifier for the header.

***

### index

```ts
index: number;
```

Defined in: [core/headers/coreHeadersFeature.types.ts:77](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/headers/coreHeadersFeature.types.ts#L77)

The index for the header within the header group.

***

### isPlaceholder

```ts
isPlaceholder: boolean;
```

Defined in: [core/headers/coreHeadersFeature.types.ts:81](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/headers/coreHeadersFeature.types.ts#L81)

A boolean denoting if the header is a placeholder header.

***

### placeholderId?

```ts
optional placeholderId: string;
```

Defined in: [core/headers/coreHeadersFeature.types.ts:85](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/headers/coreHeadersFeature.types.ts#L85)

If the header is a placeholder header, this will be a unique header ID that does not conflict with any other headers across the table.

***

### rowSpan

```ts
rowSpan: number;
```

Defined in: [core/headers/coreHeadersFeature.types.ts:89](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/headers/coreHeadersFeature.types.ts#L89)

The row-span for the header.

***

### subHeaders

```ts
subHeaders: Header<TFeatures, TData, TValue>[];
```

Defined in: [core/headers/coreHeadersFeature.types.ts:93](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/headers/coreHeadersFeature.types.ts#L93)

The header's hierarchical sub/child headers. Will be empty if the header's associated column is a leaf-column.

***

### table

```ts
table: Table<TFeatures, TData>;
```

Defined in: [core/headers/coreHeadersFeature.types.ts:97](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/headers/coreHeadersFeature.types.ts#L97)

Reference to the parent table instance.
