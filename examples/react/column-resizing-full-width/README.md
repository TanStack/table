# Full-Width Column Resizing Example

This example demonstrates how to make a TanStack Table fill its container width, with the last column automatically stretching to fill remaining space. Columns can still be individually resized while maintaining the full-width behavior.

This pattern is useful when you want the table to always fill its container (like a spreadsheet) rather than having a fixed width based on column sizes.

## Key Features

- Table always fills container width
- Last column stretches to fill remaining space
- Individual columns remain resizable
- Responsive to container size changes via ResizeObserver
- Double-click a column border to reset that column's size
