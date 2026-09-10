---
id: Cell_CellSpanning
title: Cell_CellSpanning
---

# Interface: Cell\_CellSpanning

Defined in: [features/cell-spanning/cellSpanningFeature.types.ts:139](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/cell-spanning/cellSpanningFeature.types.ts#L139)

## Properties

### getColSpan()

```ts
getColSpan: () => number;
```

Defined in: [features/cell-spanning/cellSpanningFeature.types.ts:147](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/cell-spanning/cellSpanningFeature.types.ts#L147)

Number of columns this cell spans when rendered. `1` when it does not
span, and `0` when another cell's column span covers it.

Never render a `0` as a `colSpan` attribute; skip the cell instead. See
`getIsCovered`.

#### Returns

`number`

***

### getIsCovered()

```ts
getIsCovered: () => boolean;
```

Defined in: [features/cell-spanning/cellSpanningFeature.types.ts:153](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/cell-spanning/cellSpanningFeature.types.ts#L153)

Whether another cell's span covers this cell. Skip rendering covered
cells; the cell that covers them carries the content and the span
attributes.

#### Returns

`boolean`

***

### getRowSpan()

```ts
getRowSpan: () => number;
```

Defined in: [features/cell-spanning/cellSpanningFeature.types.ts:163](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/cell-spanning/cellSpanningFeature.types.ts#L163)

Number of rows this cell spans when rendered. `1` when it does not span,
and `0` when a spanning cell above it covers it, matching the
`header.rowSpan` convention.

Never render a `0` as a `rowSpan` attribute: in HTML, `rowspan="0"` means
"span to the end of the row group", which merges the cell down the entire
table section. Skip the cell instead. See `getIsCovered`.

#### Returns

`number`
