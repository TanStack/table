---
title: Headers Guide
---

This quick guide will discuss the different ways you can retrieve and interact with `header` objects in TanStack Table.

Headers are the equivalent of cells, but meant for the `<thead>` section of the table instead of the `<tbody>` section.

## Where to Get Headers From

Headers come from [Header Groups](./header-groups), which are the equivalent of rows, but meant for the `<thead>` section of the table instead of the `<tbody>` section.

### HeaderGroup Headers

If you are in a header group, the headers are stored as an array in the `headerGroup.headers` property. Usually you will just map over this array to render your headers.

```jsx
<thead>
  {table.getHeaderGroups().map((headerGroup) => {
    return (
      <tr key={headerGroup.id}>
        {headerGroup.headers.map(
          (
            header, // map over the headerGroup headers array
          ) => (
            <th key={header.id} colSpan={header.colSpan}>
              {/* */}
            </th>
          ),
        )}
      </tr>
    )
  })}
</thead>
```

### Header Table Instance APIs

There are multiple `table` instance APIs that you can use to retrieve a list of headers depending on the features that you are using. The most common API you might use is `table.getFlatHeaders`, which will return a flat list of all headers in the table, but there are at least a dozen other APIs that are useful in tandem with the column visibility and column pinning features. APIs like `table.getStartLeafHeaders` or `table.getEndFlatHeaders` could be useful depending on your use case.

## Header Objects

Header objects are similar to [Cell](./cells) objects, but meant for the `<thead>` section of the table instead of the `<tbody>` section. Every header object can be associated with a `<th>` or similar cell element in your UI. There are a few properties and methods on `header` objects that you can use to interact with the table state and extract cell values from the table based on the state of the table.

### Header IDs

Every header object has an `id` property that makes it unique within the table instance. Usually you only need this `id` as a unique identifier for React keys or if you are following the [performant column resizing example](../framework/react/examples/column-resizing-performant).

For simple headers with no advanced nested or grouped headers logic, the `header.id` will be the same as its parent `column.id`. However, if the header is part of a group column or a placeholder cell, it will have a more complicated id that is constructed from the header family, depth/header row index, column id, and header group id.

### Nested Grouped Headers Properties

There are a few properties on `header` objects that are only useful if the header is part of a nested or grouped header structure. These properties include:

- `colSpan`: The number of columns that the header should span. This is useful for rendering the `colSpan` attribute on the `<th>` element.
- `rowSpan`: The number of rows that the header should span when merging header cells vertically. A leaf column that is shallower than the deepest leaf column produces a chain of placeholder headers above its real header. The placeholder at the top of the chain reports the chain's full span, and every header it covers (including the real leaf header in the bottom row) reports 0. This is useful for rendering the `rowSpan` attribute on the `<th>` element. See [Header Row Spanning](#header-row-spanning) below.
- `depth`: The header group "row index" that the header belongs to.
- `isPlaceholder`: A boolean flag that is true if the header is a placeholder header. Placeholder headers fill the rows above a shallow leaf column's real header so that every header row accounts for every visible column. Render them as empty cells to keep the header grid aligned, or use `header.rowSpan` to merge each placeholder chain into one vertically spanning header cell.
- `placeholderId`: The unique identifier for the placeholder header.
- `subHeaders`: The array of sub/child headers that belong to this header. Will be empty if the header is a leaf header.

> [!NOTE]
> `header.index` refers to its index within the header group (row of headers), i.e. its position from left to right. It is not the same as `header.depth`, which refers to the header group "row index".

### Header Parent Objects

Every header stores a reference to its parent [column](./columns) object and its parent [header group](./header-groups) object.

## More Header APIs

Headers have a few more useful APIs attached to them that are useful for interacting with the table state. Most of them relate to the column sizing and resizing features. See the [Column Sizing Guide](../framework/react/guide/column-sizing) and [Column Resizing Guide](../framework/react/guide/column-resizing) for more information.

## Header Rendering

Since the `header` column option you defined can be either a string, JSX, or a function returning either of those, the best way to render the headers is to use the `flexRender` utility from your adapter, which will handle all of those cases for you.

```jsx
{
  headerGroup.headers.map((header) => (
    <th key={header.id} colSpan={header.colSpan}>
      {/* Handles all possible header column def scenarios for `header` */}
      {flexRender(header.column.columnDef.header, header.getContext())}
    </th>
  ))
}
```

### Header Row Spanning

If your column tree is uneven (some leaf columns are nested deeper than others), each shallow leaf column produces a chain of placeholder headers above its real header. The placeholder at the top of the chain reports the chain's full `rowSpan`, and every header it covers reports a `rowSpan` of 0. To merge those header cells vertically, skip headers with a `rowSpan` of 0 and render everything else with the `rowSpan` attribute. Note that this replaces the usual `header.isPlaceholder` check: the spanning placeholder renders its column's header content instead of an empty cell.

```jsx
{
  headerGroup.headers.map((header) =>
    header.rowSpan === 0 ? null : (
      <th key={header.id} colSpan={header.colSpan} rowSpan={header.rowSpan}>
        {flexRender(header.column.columnDef.header, header.getContext())}
      </th>
    ),
  )
}
```

> [!NOTE]
> This recipe is for the `<thead>` section only. Footer groups render the header rows in reverse order, which puts a spanning placeholder below the cells it would need to cover, so keep the `header.isPlaceholder` empty-cell pattern in the `<tfoot>` section.

The body-cell equivalent of this convention lives in the optional `cellSpanningFeature`. See the [Cell Spanning Guide](../framework/react/guide/cell-spanning).
