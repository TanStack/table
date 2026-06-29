---
id: Table_RowExpanding
title: Table_RowExpanding
---

# Interface: Table\_RowExpanding\<TFeatures, TData\>

Defined in: [features/row-expanding/rowExpandingFeature.types.ts:73](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-expanding/rowExpandingFeature.types.ts#L73)

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md)

## Properties

### autoResetExpanded()

```ts
autoResetExpanded: () => void;
```

Defined in: [features/row-expanding/rowExpandingFeature.types.ts:77](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-expanding/rowExpandingFeature.types.ts#L77)

#### Returns

`void`

***

### getCanSomeRowsExpand()

```ts
getCanSomeRowsExpand: () => boolean;
```

Defined in: [features/row-expanding/rowExpandingFeature.types.ts:81](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-expanding/rowExpandingFeature.types.ts#L81)

Checks whether at least one row can be expanded.

#### Returns

`boolean`

***

### getExpandedDepth()

```ts
getExpandedDepth: () => number;
```

Defined in: [features/row-expanding/rowExpandingFeature.types.ts:85](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-expanding/rowExpandingFeature.types.ts#L85)

Computes the deepest expanded row id depth.

#### Returns

`number`

***

### getIsAllRowsExpanded()

```ts
getIsAllRowsExpanded: () => boolean;
```

Defined in: [features/row-expanding/rowExpandingFeature.types.ts:89](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-expanding/rowExpandingFeature.types.ts#L89)

Checks whether all rows in the current row model are expanded.

#### Returns

`boolean`

***

### getIsSomeRowsExpanded()

```ts
getIsSomeRowsExpanded: () => boolean;
```

Defined in: [features/row-expanding/rowExpandingFeature.types.ts:93](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-expanding/rowExpandingFeature.types.ts#L93)

Checks whether any row is currently expanded.

#### Returns

`boolean`

***

### getToggleAllRowsExpandedHandler()

```ts
getToggleAllRowsExpandedHandler: () => (event) => void;
```

Defined in: [features/row-expanding/rowExpandingFeature.types.ts:97](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-expanding/rowExpandingFeature.types.ts#L97)

Creates a handler that toggles all rows expanded.

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

### resetExpanded()

```ts
resetExpanded: (defaultState?) => void;
```

Defined in: [features/row-expanding/rowExpandingFeature.types.ts:103](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-expanding/rowExpandingFeature.types.ts#L103)

Resets `expanded` to `initialState.expanded`.

Pass `true` to ignore initial state and reset to `{}`.

#### Parameters

##### defaultState?

`boolean`

#### Returns

`void`

***

### setExpanded()

```ts
setExpanded: (updater) => void;
```

Defined in: [features/row-expanding/rowExpandingFeature.types.ts:107](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-expanding/rowExpandingFeature.types.ts#L107)

Updates expanded state with `true`, a row-id map, or an updater function.

#### Parameters

##### updater

[`Updater`](../type-aliases/Updater.md)\<[`ExpandedState`](../type-aliases/ExpandedState.md)\>

#### Returns

`void`

***

### toggleAllRowsExpanded()

```ts
toggleAllRowsExpanded: (expanded?) => void;
```

Defined in: [features/row-expanding/rowExpandingFeature.types.ts:111](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-expanding/rowExpandingFeature.types.ts#L111)

Toggles the expanded state for all rows.

#### Parameters

##### expanded?

`boolean`

#### Returns

`void`
