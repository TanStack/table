---
id: Column_ColumnVisibility
title: Column_ColumnVisibility
---

# Interface: Column\_ColumnVisibility

Defined in: [features/column-visibility/columnVisibilityFeature.types.ts:95](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-visibility/columnVisibilityFeature.types.ts#L95)

## Properties

### getCanHide()

```ts
getCanHide: () => boolean;
```

Defined in: [features/column-visibility/columnVisibilityFeature.types.ts:99](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-visibility/columnVisibilityFeature.types.ts#L99)

Checks whether this column is allowed to be hidden.

#### Returns

`boolean`

***

### getIsVisible()

```ts
getIsVisible: () => boolean;
```

Defined in: [features/column-visibility/columnVisibilityFeature.types.ts:103](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-visibility/columnVisibilityFeature.types.ts#L103)

Checks whether this column is currently visible.

#### Returns

`boolean`

***

### getToggleVisibilityHandler()

```ts
getToggleVisibilityHandler: () => (event) => void;
```

Defined in: [features/column-visibility/columnVisibilityFeature.types.ts:107](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-visibility/columnVisibilityFeature.types.ts#L107)

Creates a checkbox-style handler that toggles this column's visibility.

#### Returns

```ts
(event): void;
```

##### Parameters

###### event

`unknown`

##### Returns

`void`

***

### toggleVisibility()

```ts
toggleVisibility: (value?) => void;
```

Defined in: [features/column-visibility/columnVisibilityFeature.types.ts:111](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-visibility/columnVisibilityFeature.types.ts#L111)

Toggles the visibility of the column.

#### Parameters

##### value?

`boolean`

#### Returns

`void`
