---
id: Column_ColumnVisibility
title: Column_ColumnVisibility
---

# Interface: Column\_ColumnVisibility

Defined in: [features/column-visibility/columnVisibilityFeature.types.ts:92](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-visibility/columnVisibilityFeature.types.ts#L92)

## Properties

### getCanHide()

```ts
getCanHide: () => boolean;
```

Defined in: [features/column-visibility/columnVisibilityFeature.types.ts:96](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-visibility/columnVisibilityFeature.types.ts#L96)

Returns whether the column can be hidden

#### Returns

`boolean`

***

### getIsVisible()

```ts
getIsVisible: () => boolean;
```

Defined in: [features/column-visibility/columnVisibilityFeature.types.ts:100](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-visibility/columnVisibilityFeature.types.ts#L100)

Returns whether the column is visible

#### Returns

`boolean`

***

### getToggleVisibilityHandler()

```ts
getToggleVisibilityHandler: () => (event) => void;
```

Defined in: [features/column-visibility/columnVisibilityFeature.types.ts:104](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-visibility/columnVisibilityFeature.types.ts#L104)

Returns a function that can be used to toggle the column visibility. This function can be used to bind to an event handler to a checkbox.

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

Defined in: [features/column-visibility/columnVisibilityFeature.types.ts:108](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-visibility/columnVisibilityFeature.types.ts#L108)

Toggles the visibility of the column.

#### Parameters

##### value?

`boolean`

#### Returns

`void`
