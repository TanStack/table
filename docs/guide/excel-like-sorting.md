---
title: Excel-like Sorting
---

# Excel-like Sorting with Null/Undefined Values

Excel and other spreadsheet applications handle empty cells in a specific way during sorting - they always appear at the bottom regardless of sort direction. This guide shows how to achieve the same behavior in TanStack Table.

## The Challenge

By default, JavaScript's sorting behavior for null/undefined values can be inconsistent. The `sortUndefined` option only handles undefined values, not null. To achieve true Excel-like sorting, we need a custom approach.

## Solution

### Step 1: Create a Custom Sorting Function

```tsx
const excelLikeSortingFn = (rowA, rowB, columnId) => {
  const a = rowA.getValue(columnId);
  const b = rowB.getValue(columnId);
  
  // Check for empty values (null, undefined)
  const aEmpty = a == null;
  const bEmpty = b == null;
  
  // If both are empty, they're equal
  if (aEmpty && bEmpty) return 0;
  
  // Empty values always go to bottom
  if (aEmpty) return 1;
  if (bEmpty) return -1;
  
  // Normal comparison for non-empty values
  return a < b ? -1 : a > b ? 1 : 0;
};
```

### Step 2: Apply to Your Columns

```tsx
const columns = [
  {
    id: 'price',
    accessorFn: row => row.price ?? null,
    header: 'Price',
    cell: ({ getValue }) => {
      const value = getValue();
      return value == null ? '-' : `$${value}`;
    },
    sortingFn: excelLikeSortingFn,
    sortUndefined: 'last'
  }
];
```

### Step 3: Global Configuration (Optional)

Register the sorting function globally for reuse:

```tsx
const table = useReactTable({
  data,
  columns,
  sortingFns: {
    excelLike: excelLikeSortingFn
  },
  defaultColumn: {
    sortingFn: 'excelLike'
  },
  getCoreRowModel: getCoreRowModel(),
  getSortedRowModel: getSortedRowModel()
});
```

## Complete Example

```tsx
import React from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender
} from '@tanstack/react-table';

// Sample data with null/undefined values
const data = [
  { id: 1, product: 'Laptop', price: 999, stock: 10 },
  { id: 2, product: 'Mouse', price: 25, stock: null },
  { id: 3, product: 'Keyboard', price: null, stock: 5 },
  { id: 4, product: 'Monitor', price: 399, stock: undefined },
  { id: 5, product: 'Headphones', price: 89, stock: 0 }
];

function ExcelSortingTable() {
  // Excel-like sorting function
  const excelLikeSortingFn = (rowA, rowB, columnId) => {
    const a = rowA.getValue(columnId);
    const b = rowB.getValue(columnId);
    
    if (a == null && b == null) return 0;
    if (a == null) return 1;
    if (b == null) return -1;
    
    return a < b ? -1 : a > b ? 1 : 0;
  };

  const columns = React.useMemo(
    () => [
      {
        accessorKey: 'product',
        header: 'Product'
      },
      {
        id: 'price',
        accessorFn: row => row.price ?? null,
        header: 'Price',
        cell: ({ getValue }) => {
          const value = getValue();
          return value == null ? '-' : `$${value}`;
        },
        sortingFn: excelLikeSortingFn,
        sortUndefined: 'last'
      },
      {
        id: 'stock',
        accessorFn: row => row.stock ?? null,
        header: 'Stock',
        cell: ({ getValue }) => {
          const value = getValue();
          return value == null ? 'N/A' : value;
        },
        sortingFn: excelLikeSortingFn,
        sortUndefined: 'last'
      }
    ],
    []
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel()
  });

  return (
    <table>
      <thead>
        {table.getHeaderGroups().map(headerGroup => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map(header => (
              <th
                key={header.id}
                onClick={header.column.getToggleSortingHandler()}
                style={{ cursor: 'pointer' }}
              >
                {flexRender(
                  header.column.columnDef.header,
                  header.getContext()
                )}
                {{
                  asc: ' 🔼',
                  desc: ' 🔽',
                }[header.column.getIsSorted()] ?? null}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map(row => (
          <tr key={row.id}>
            {row.getVisibleCells().map(cell => (
              <td key={cell.id}>
                {flexRender(
                  cell.column.columnDef.cell,
                  cell.getContext()
                )}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default ExcelSortingTable;
```

## Key Points

- `sortUndefined: 'last'` only handles undefined values, not null
- Custom `sortingFn` is required for consistent null/undefined handling
- `accessorFn` with `?? null` normalizes undefined to null
- `cell` function controls display of empty values

## Credits

This solution was contributed by the community in Issue #6061.
