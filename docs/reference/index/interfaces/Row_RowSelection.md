---
id: Row_RowSelection
title: Row_RowSelection
---

# Interface: Row\_RowSelection

Defined in: [features/row-selection/rowSelectionFeature.types.ts:54](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-selection/rowSelectionFeature.types.ts#L54)

## Properties

### getCanMultiSelect()

```ts
getCanMultiSelect: () => boolean;
```

Defined in: [features/row-selection/rowSelectionFeature.types.ts:58](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-selection/rowSelectionFeature.types.ts#L58)

Checks whether this row can be selected alongside other rows.

#### Returns

`boolean`

***

### getCanSelect()

```ts
getCanSelect: () => boolean;
```

Defined in: [features/row-selection/rowSelectionFeature.types.ts:62](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-selection/rowSelectionFeature.types.ts#L62)

Checks whether this row can currently be selected.

#### Returns

`boolean`

***

### getCanSelectSubRows()

```ts
getCanSelectSubRows: () => boolean;
```

Defined in: [features/row-selection/rowSelectionFeature.types.ts:66](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-selection/rowSelectionFeature.types.ts#L66)

Checks whether selecting this row should also select its subRows.

#### Returns

`boolean`

***

### getIsAllSubRowsSelected()

```ts
getIsAllSubRowsSelected: () => boolean;
```

Defined in: [features/row-selection/rowSelectionFeature.types.ts:70](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-selection/rowSelectionFeature.types.ts#L70)

Checks whether all selectable descendants are selected.

#### Returns

`boolean`

***

### getIsSelected()

```ts
getIsSelected: () => boolean;
```

Defined in: [features/row-selection/rowSelectionFeature.types.ts:74](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-selection/rowSelectionFeature.types.ts#L74)

Checks whether this row id is selected.

#### Returns

`boolean`

***

### getIsSomeSelected()

```ts
getIsSomeSelected: () => boolean;
```

Defined in: [features/row-selection/rowSelectionFeature.types.ts:78](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-selection/rowSelectionFeature.types.ts#L78)

Checks whether some selectable descendants are selected.

#### Returns

`boolean`

***

### getToggleSelectedHandler()

```ts
getToggleSelectedHandler: () => (event) => void;
```

Defined in: [features/row-selection/rowSelectionFeature.types.ts:82](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-selection/rowSelectionFeature.types.ts#L82)

Creates a checkbox-style handler that toggles this row's selected state.

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

Defined in: [features/row-selection/rowSelectionFeature.types.ts:86](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-selection/rowSelectionFeature.types.ts#L86)

Selects/deselects the row.

#### Parameters

##### value?

`boolean`

##### opts?

###### selectChildren?

`boolean`

#### Returns

`void`
