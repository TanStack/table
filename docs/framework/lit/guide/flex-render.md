---
title: FlexRender (Lit) Guide
---

Column definitions can contain Lit template results, directives, nodes, primitive values, iterables, or renderer functions for `header`, `cell`, `footer`, and `aggregatedCell`. Use the adapter's rendering utilities inside Lit templates so those values receive their table context.

## `FlexRender` vs `flexRender`

In Lit, `FlexRender` is a convenience function rather than a custom element. Pass exactly one `cell`, `header`, or `footer` object and interpolate the result:

```ts
html`
  <thead>
    ${table.getHeaderGroups().map(
      (headerGroup) => html`
        <tr>
          ${headerGroup.headers.map(
            (header) => html`
              <th>${header.isPlaceholder ? null : FlexRender({ header })}</th>
            `,
          )}
        </tr>
      `,
    )}
  </thead>
  <tbody>
    ${table.getRowModel().rows.map(
      (row) => html`
        <tr>
          ${row
            .getVisibleCells()
            .map((cell) => html`<td>${FlexRender({ cell })}</td>`)}
        </tr>
      `,
    )}
  </tbody>
`
```

Import it from `@tanstack/lit-table`. Tables returned by `TableController` also expose it as `table.FlexRender`.

For cells, `FlexRender` selects `aggregatedCell` for aggregated rows, falls back to `cell`, and returns `null` for grouping placeholders. Pass footer-group `Header` objects as `FlexRender({ footer: header })`.

`flexRender` is the lower-level function for a renderable value and context:

```ts
flexRender(cell.column.columnDef.cell, cell.getContext())
```

It calls function renderers and passes every other `LitRenderable` through unchanged. It does not choose the appropriate grouped-cell renderer or suppress placeholders, so prefer `FlexRender` for ordinary table markup.

Placeholder headers remain the template's layout decision. Check `header.isPlaceholder` unless the placeholder intentionally provides content for a spanning header.
