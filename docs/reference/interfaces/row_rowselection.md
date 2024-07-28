---
id: Row_RowSelection
title: Row_RowSelection
---

# Interface: Row\_RowSelection

## Properties

### getCanMultiSelect()

```ts
getCanMultiSelect: () => boolean;
```

Returns whether or not the row can multi-select.

#### Returns

`boolean`

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/row-selection#getcanmultiselect)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/row-selection)

#### Defined in

[features/row-selection/RowSelection.types.ts:62](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/row-selection/RowSelection.types.ts#L62)

***

### getCanSelect()

```ts
getCanSelect: () => boolean;
```

Returns whether or not the row can be selected.

#### Returns

`boolean`

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/row-selection#getcanselect)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/row-selection)

#### Defined in

[features/row-selection/RowSelection.types.ts:68](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/row-selection/RowSelection.types.ts#L68)

***

### getCanSelectSubRows()

```ts
getCanSelectSubRows: () => boolean;
```

Returns whether or not the row can select sub rows automatically when the parent row is selected.

#### Returns

`boolean`

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/row-selection#getcanselectsubrows)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/row-selection)

#### Defined in

[features/row-selection/RowSelection.types.ts:74](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/row-selection/RowSelection.types.ts#L74)

***

### getIsAllSubRowsSelected()

```ts
getIsAllSubRowsSelected: () => boolean;
```

Returns whether or not all of the row's sub rows are selected.

#### Returns

`boolean`

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/row-selection#getisallsubrowsselected)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/row-selection)

#### Defined in

[features/row-selection/RowSelection.types.ts:80](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/row-selection/RowSelection.types.ts#L80)

***

### getIsSelected()

```ts
getIsSelected: () => boolean;
```

Returns whether or not the row is selected.

#### Returns

`boolean`

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/row-selection#getisselected)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/row-selection)

#### Defined in

[features/row-selection/RowSelection.types.ts:86](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/row-selection/RowSelection.types.ts#L86)

***

### getIsSomeSelected()

```ts
getIsSomeSelected: () => boolean;
```

Returns whether or not some of the row's sub rows are selected.

#### Returns

`boolean`

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/row-selection#getissomeselected)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/row-selection)

#### Defined in

[features/row-selection/RowSelection.types.ts:92](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/row-selection/RowSelection.types.ts#L92)

***

### getToggleSelectedHandler()

```ts
getToggleSelectedHandler: () => (event) => void;
```

Returns a handler that can be used to toggle the row.

#### Returns

`Function`

##### Parameters

• **event**: `unknown`

##### Returns

`void`

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/row-selection#gettoggleselectedhandler)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/row-selection)

#### Defined in

[features/row-selection/RowSelection.types.ts:98](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/row-selection/RowSelection.types.ts#L98)

***

### toggleSelected()

```ts
toggleSelected: (value?, opts?) => void;
```

Selects/deselects the row.

#### Parameters

• **value?**: `boolean`

• **opts?**

• **opts.selectChildren?**: `boolean`

#### Returns

`void`

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/row-selection#toggleselected)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/row-selection)

#### Defined in

[features/row-selection/RowSelection.types.ts:104](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/row-selection/RowSelection.types.ts#L104)
