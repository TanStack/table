---
name: Header
id: Header
---

These are **core** options and API properties for all headers. More options and API properties may be available for other [table features](../guide/09-features.md).

## Header API

All header objects have the following properties:

#### `id`

```tsx
id: string
```

The unique identifier for the header.

#### `index`

```tsx
id: number
```

The index for the header within the header group.

#### `depth`

```tsx
id: number
```

The depth of the header, zero-indexed based.

#### `column`

```tsx
column: Column<TGenerics>
```

The header's associated [Column](./Column.md) object

#### `headerGroup`

```tsx
headerGroup: HeaderGroup<TGenerics>
```

The header's associated [HeaderGroup](./HeaderGroup.md) object

#### `subHeaders`

```tsx
type subHeaders = Header<TGenerics>[]
```

The header's hierarchical sub/child headers. Will be empty if the header's associated column is a leaf-column.

#### `colSpan`

```tsx
colSpan: number
```

The col-span for the header.

#### `rowSpan`

```tsx
rowSpan: number
```

The row-span for the header.

#### `getLeafHeaders`

```tsx
type getLeafHeaders = () => Header<TGenerics>[]
```

Returns the leaf headers hierarchically nested under this header.

#### `isPlaceholder`

```tsx
isPlaceholder: boolean
```

A boolean denoting if the header is a placeholder header

#### `placeholderId`

```tsx
placeholderId?: string
```

If the header is a placeholder header, this will be a unique header ID that does not conflict with any other headers across the table

#### `renderHeader`

```tsx
renderHeader: (options?: { renderPlaceholder?: boolean }) =>
  string | null | TGenerics['Rendered']
```

Returns the rendered header using the associated column's `header` template. The exact return type of this function depends on the adapter being used.

#### `renderFooter`

```tsx
renderFooter: (options?: { renderPlaceholder?: boolean }) =>
  string | null | TGenerics['Rendered']
```

Returns the rendered footer using the associated column's `footer` template. The exact return type of this function depends on the adapter being used.
