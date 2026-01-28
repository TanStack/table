---
id: Column_ColumnResizing
title: Column_ColumnResizing
---

# Interface: Column\_ColumnResizing

Defined in: [packages/table-core/src/features/column-resizing/columnResizingFeature.types.ts:62](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-resizing/columnResizingFeature.types.ts#L62)

## Properties

### getCanResize()

```ts
getCanResize: () => boolean;
```

Defined in: [packages/table-core/src/features/column-resizing/columnResizingFeature.types.ts:66](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-resizing/columnResizingFeature.types.ts#L66)

Returns `true` if the column can be resized.

#### Returns

`boolean`

***

### getIsResizing()

```ts
getIsResizing: () => boolean;
```

Defined in: [packages/table-core/src/features/column-resizing/columnResizingFeature.types.ts:70](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-resizing/columnResizingFeature.types.ts#L70)

Returns `true` if the column is currently being resized.

#### Returns

`boolean`
