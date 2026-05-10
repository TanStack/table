---
id: Column_ColumnVisibility
title: Column_ColumnVisibility
---

# Interface: Column\_ColumnVisibility

Defined in: [features/column-visibility/columnVisibilityFeature.types.ts:89](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-visibility/columnVisibilityFeature.types.ts#L89)

## Properties

### getCanHide()

```ts
getCanHide: () => boolean;
```

Defined in: [features/column-visibility/columnVisibilityFeature.types.ts:93](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-visibility/columnVisibilityFeature.types.ts#L93)

Returns whether the column can be hidden

#### Returns

`boolean`

***

### getIsVisible()

```ts
getIsVisible: () => boolean;
```

Defined in: [features/column-visibility/columnVisibilityFeature.types.ts:97](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-visibility/columnVisibilityFeature.types.ts#L97)

Returns whether the column is visible

#### Returns

`boolean`

***

### getToggleVisibilityHandler()

```ts
getToggleVisibilityHandler: () => (event) => void;
```

Defined in: [features/column-visibility/columnVisibilityFeature.types.ts:101](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-visibility/columnVisibilityFeature.types.ts#L101)

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

Defined in: [features/column-visibility/columnVisibilityFeature.types.ts:105](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-visibility/columnVisibilityFeature.types.ts#L105)

Toggles the visibility of the column.

#### Parameters

##### value?

`boolean`

#### Returns

`void`
