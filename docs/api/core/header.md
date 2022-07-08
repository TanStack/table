---
title: Header
---

These are **core** options and API properties for all headers. More options and API properties may be available for other [table features](../guide/features.md).

## Header API

All header objects have the following properties:

### `id`

```tsx
id: string
```

The unique identifier for the header.

### `index`

```tsx
id: number
```

The index for the header within the header group.

### `depth`

```tsx
id: number
```

The depth of the header, zero-indexed based.

### `column`

```tsx
column: Column<TData>
```

The header's associated [Column](./column.md) object

### `headerGroup`

```tsx
headerGroup: HeaderGroup<TData>
```

The header's associated [HeaderGroup](./header-group.md) object

### `subHeaders`

```tsx
type subHeaders = Header<TData>[]
```

The header's hierarchical sub/child headers. Will be empty if the header's associated column is a leaf-column.

### `colSpan`

```tsx
colSpan: number
```

The col-span for the header.

### `rowSpan`

```tsx
rowSpan: number
```

The row-span for the header.

### `getLeafHeaders`

```tsx
type getLeafHeaders = () => Header<TData>[]
```

Returns the leaf headers hierarchically nested under this header.

### `isPlaceholder`

```tsx
isPlaceholder: boolean
```

A boolean denoting if the header is a placeholder header

### `placeholderId`

```tsx
placeholderId?: string
```

If the header is a placeholder header, this will be a unique header ID that does not conflict with any other headers across the table

### `getContext`

```tsx
getContext: () => {
  table: Table<TData>
  header: Header<TData, TValue>
  column: Column<TData, TValue>
}
```

Returns the rendering context (or props) for column-based components like headers, footers and filters. Use these props with your framework's `flexRender` utility to render these using the template of your choice:

```tsx
flexRender(header.column.columnDef.header, header.getContext())
```
