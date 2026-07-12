---
id: Row_RowSelection
title: Row_RowSelection
---

# Interface: Row\_RowSelection

Defined in: [features/row-selection/rowSelectionFeature.types.ts:77](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-selection/rowSelectionFeature.types.ts#L77)

## Properties

### getCanMultiSelect()

```ts
getCanMultiSelect: () => boolean;
```

Defined in: [features/row-selection/rowSelectionFeature.types.ts:81](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-selection/rowSelectionFeature.types.ts#L81)

Checks whether this row can be selected alongside other rows.

#### Returns

`boolean`

***

### getCanSelect()

```ts
getCanSelect: () => boolean;
```

Defined in: [features/row-selection/rowSelectionFeature.types.ts:85](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-selection/rowSelectionFeature.types.ts#L85)

Checks whether this row can currently be selected.

#### Returns

`boolean`

***

### getCanSelectSubRows()

```ts
getCanSelectSubRows: () => boolean;
```

Defined in: [features/row-selection/rowSelectionFeature.types.ts:89](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-selection/rowSelectionFeature.types.ts#L89)

Checks whether selecting this row should also select its subRows.

#### Returns

`boolean`

***

### getIsAllSubRowsSelected()

```ts
getIsAllSubRowsSelected: () => boolean;
```

Defined in: [features/row-selection/rowSelectionFeature.types.ts:93](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-selection/rowSelectionFeature.types.ts#L93)

Checks whether all selectable descendants are selected.

#### Returns

`boolean`

***

### getIsSelected()

```ts
getIsSelected: () => boolean;
```

Defined in: [features/row-selection/rowSelectionFeature.types.ts:97](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-selection/rowSelectionFeature.types.ts#L97)

Checks whether this row id is selected.

#### Returns

`boolean`

***

### getIsSomeSelected()

```ts
getIsSomeSelected: () => boolean;
```

Defined in: [features/row-selection/rowSelectionFeature.types.ts:101](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-selection/rowSelectionFeature.types.ts#L101)

Checks whether some selectable descendants are selected.

#### Returns

`boolean`

***

### getToggleSelectedHandler()

```ts
getToggleSelectedHandler: (opts?) => (event) => void;
```

Defined in: [features/row-selection/rowSelectionFeature.types.ts:105](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-selection/rowSelectionFeature.types.ts#L105)

Creates a checkbox-style handler that toggles this row's selected state.

#### Parameters

##### opts?

[`ToggleSelectedOptions`](ToggleSelectedOptions.md)

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

Defined in: [features/row-selection/rowSelectionFeature.types.ts:111](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-selection/rowSelectionFeature.types.ts#L111)

Selects/deselects the row.

#### Parameters

##### value?

`boolean`

##### opts?

[`ToggleSelectedOptions`](ToggleSelectedOptions.md)

#### Returns

`void`
