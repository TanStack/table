---
id: Column_ColumnResizing
title: Column_ColumnResizing
---

# Interface: Column\_ColumnResizing

Defined in: [features/column-resizing/columnResizingFeature.types.ts:71](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-resizing/columnResizingFeature.types.ts#L71)

## Properties

### getCanResize()

```ts
getCanResize: () => boolean;
```

Defined in: [features/column-resizing/columnResizingFeature.types.ts:75](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-resizing/columnResizingFeature.types.ts#L75)

Checks whether this column can start a resize interaction.

#### Returns

`boolean`

***

### getIsResizing()

```ts
getIsResizing: () => boolean;
```

Defined in: [features/column-resizing/columnResizingFeature.types.ts:79](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-resizing/columnResizingFeature.types.ts#L79)

Checks whether this column is the active resize target.

#### Returns

`boolean`
