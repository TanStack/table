---
id: Row_RowSelection
title: Row_RowSelection
---

# Interface: Row\_RowSelection

Defined in: [features/row-selection/rowSelectionFeature.types.ts:48](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-selection/rowSelectionFeature.types.ts#L48)

## Properties

### getCanMultiSelect()

```ts
getCanMultiSelect: () => boolean;
```

Defined in: [features/row-selection/rowSelectionFeature.types.ts:52](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-selection/rowSelectionFeature.types.ts#L52)

Returns whether or not the row can multi-select.

#### Returns

`boolean`

***

### getCanSelect()

```ts
getCanSelect: () => boolean;
```

Defined in: [features/row-selection/rowSelectionFeature.types.ts:56](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-selection/rowSelectionFeature.types.ts#L56)

Returns whether or not the row can be selected.

#### Returns

`boolean`

***

### getCanSelectSubRows()

```ts
getCanSelectSubRows: () => boolean;
```

Defined in: [features/row-selection/rowSelectionFeature.types.ts:60](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-selection/rowSelectionFeature.types.ts#L60)

Returns whether or not the row can select sub rows automatically when the parent row is selected.

#### Returns

`boolean`

***

### getIsAllSubRowsSelected()

```ts
getIsAllSubRowsSelected: () => boolean;
```

Defined in: [features/row-selection/rowSelectionFeature.types.ts:64](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-selection/rowSelectionFeature.types.ts#L64)

Returns whether or not all of the row's sub rows are selected.

#### Returns

`boolean`

***

### getIsSelected()

```ts
getIsSelected: () => boolean;
```

Defined in: [features/row-selection/rowSelectionFeature.types.ts:68](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-selection/rowSelectionFeature.types.ts#L68)

Returns whether or not the row is selected.

#### Returns

`boolean`

***

### getIsSomeSelected()

```ts
getIsSomeSelected: () => boolean;
```

Defined in: [features/row-selection/rowSelectionFeature.types.ts:72](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-selection/rowSelectionFeature.types.ts#L72)

Returns whether or not some of the row's sub rows are selected.

#### Returns

`boolean`

***

### getToggleSelectedHandler()

```ts
getToggleSelectedHandler: () => (event) => void;
```

Defined in: [features/row-selection/rowSelectionFeature.types.ts:76](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-selection/rowSelectionFeature.types.ts#L76)

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

Defined in: [features/row-selection/rowSelectionFeature.types.ts:80](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-selection/rowSelectionFeature.types.ts#L80)

Selects/deselects the row.

#### Parameters

##### value?

`boolean`

##### opts?

###### selectChildren?

`boolean`

#### Returns

`void`
