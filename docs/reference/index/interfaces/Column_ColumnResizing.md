---
id: Column_ColumnResizing
title: Column_ColumnResizing
---

# Interface: Column\_ColumnResizing

Defined in: [features/column-resizing/columnResizingFeature.types.ts:68](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-resizing/columnResizingFeature.types.ts#L68)

## Properties

### getCanResize()

```ts
getCanResize: () => boolean;
```

Defined in: [features/column-resizing/columnResizingFeature.types.ts:72](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-resizing/columnResizingFeature.types.ts#L72)

Checks whether this column can start a resize interaction.

#### Returns

`boolean`

***

### getIsResizing()

```ts
getIsResizing: () => boolean;
```

Defined in: [features/column-resizing/columnResizingFeature.types.ts:76](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-resizing/columnResizingFeature.types.ts#L76)

Checks whether this column is the active resize target.

#### Returns

`boolean`
