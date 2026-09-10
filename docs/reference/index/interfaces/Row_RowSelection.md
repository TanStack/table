---
id: Row_RowSelection
title: Row_RowSelection
---

# Interface: Row\_RowSelection

Defined in: [features/row-selection/rowSelectionFeature.types.ts:89](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-selection/rowSelectionFeature.types.ts#L89)

## Properties

### getCanMultiSelect()

```ts
getCanMultiSelect: () => boolean;
```

Defined in: [features/row-selection/rowSelectionFeature.types.ts:93](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-selection/rowSelectionFeature.types.ts#L93)

Checks whether this row can be selected alongside other rows.

#### Returns

`boolean`

***

### getCanSelect()

```ts
getCanSelect: () => boolean;
```

Defined in: [features/row-selection/rowSelectionFeature.types.ts:97](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-selection/rowSelectionFeature.types.ts#L97)

Checks whether this row can currently be selected.

#### Returns

`boolean`

***

### getCanSelectSubRows()

```ts
getCanSelectSubRows: () => boolean;
```

Defined in: [features/row-selection/rowSelectionFeature.types.ts:101](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-selection/rowSelectionFeature.types.ts#L101)

Checks whether selecting this row should also select its subRows.

#### Returns

`boolean`

***

### getIsAllSubRowsSelected()

```ts
getIsAllSubRowsSelected: () => boolean;
```

Defined in: [features/row-selection/rowSelectionFeature.types.ts:105](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-selection/rowSelectionFeature.types.ts#L105)

Checks whether all selectable descendants are selected.

#### Returns

`boolean`

***

### getIsSelected()

```ts
getIsSelected: () => boolean;
```

Defined in: [features/row-selection/rowSelectionFeature.types.ts:109](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-selection/rowSelectionFeature.types.ts#L109)

Checks whether this row id is selected.

#### Returns

`boolean`

***

### getIsSomeSelected()

```ts
getIsSomeSelected: () => boolean;
```

Defined in: [features/row-selection/rowSelectionFeature.types.ts:113](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-selection/rowSelectionFeature.types.ts#L113)

Checks whether some selectable descendants are selected.

#### Returns

`boolean`

***

### getToggleSelectedHandler()

```ts
getToggleSelectedHandler: (opts?) => (event) => void;
```

Defined in: [features/row-selection/rowSelectionFeature.types.ts:120](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-selection/rowSelectionFeature.types.ts#L120)

Creates a checkbox-style handler that toggles this row's selected state.
Pass the original checkbox click event, or a framework event whose
`nativeEvent` is that click, so Shift range selection can detect the
modifier key.

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

Defined in: [features/row-selection/rowSelectionFeature.types.ts:126](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-selection/rowSelectionFeature.types.ts#L126)

Selects/deselects the row.

#### Parameters

##### value?

`boolean`

##### opts?

[`ToggleSelectedOptions`](ToggleSelectedOptions.md)

#### Returns

`void`
