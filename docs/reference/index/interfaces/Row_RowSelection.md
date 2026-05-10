---
id: Row_RowSelection
title: Row_RowSelection
---

# Interface: Row\_RowSelection

Defined in: [features/row-selection/rowSelectionFeature.types.ts:50](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-selection/rowSelectionFeature.types.ts#L50)

## Properties

### getCanMultiSelect()

```ts
getCanMultiSelect: () => boolean;
```

Defined in: [features/row-selection/rowSelectionFeature.types.ts:54](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-selection/rowSelectionFeature.types.ts#L54)

Returns whether or not the row can multi-select.

#### Returns

`boolean`

***

### getCanSelect()

```ts
getCanSelect: () => boolean;
```

Defined in: [features/row-selection/rowSelectionFeature.types.ts:58](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-selection/rowSelectionFeature.types.ts#L58)

Returns whether or not the row can be selected.

#### Returns

`boolean`

***

### getCanSelectSubRows()

```ts
getCanSelectSubRows: () => boolean;
```

Defined in: [features/row-selection/rowSelectionFeature.types.ts:62](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-selection/rowSelectionFeature.types.ts#L62)

Returns whether or not the row can select sub rows automatically when the parent row is selected.

#### Returns

`boolean`

***

### getIsAllSubRowsSelected()

```ts
getIsAllSubRowsSelected: () => boolean;
```

Defined in: [features/row-selection/rowSelectionFeature.types.ts:66](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-selection/rowSelectionFeature.types.ts#L66)

Returns whether or not all of the row's sub rows are selected.

#### Returns

`boolean`

***

### getIsSelected()

```ts
getIsSelected: () => boolean;
```

Defined in: [features/row-selection/rowSelectionFeature.types.ts:70](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-selection/rowSelectionFeature.types.ts#L70)

Returns whether or not the row is selected.

#### Returns

`boolean`

***

### getIsSomeSelected()

```ts
getIsSomeSelected: () => boolean;
```

Defined in: [features/row-selection/rowSelectionFeature.types.ts:74](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-selection/rowSelectionFeature.types.ts#L74)

Returns whether or not some of the row's sub rows are selected.

#### Returns

`boolean`

***

### getToggleSelectedHandler()

```ts
getToggleSelectedHandler: () => (event) => void;
```

Defined in: [features/row-selection/rowSelectionFeature.types.ts:78](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-selection/rowSelectionFeature.types.ts#L78)

Returns a handler that can be used to toggle the row.

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

### toggleSelected()

```ts
toggleSelected: (value?, opts?) => void;
```

Defined in: [features/row-selection/rowSelectionFeature.types.ts:82](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-selection/rowSelectionFeature.types.ts#L82)

Selects/deselects the row.

#### Parameters

##### value?

`boolean`

##### opts?

###### selectChildren?

`boolean`

#### Returns

`void`
