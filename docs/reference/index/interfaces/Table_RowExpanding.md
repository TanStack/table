---
id: Table_RowExpanding
title: Table_RowExpanding
---

# Interface: Table\_RowExpanding\<_TFeatures, _TData\>

Defined in: [features/row-expanding/rowExpandingFeature.types.ts:72](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-expanding/rowExpandingFeature.types.ts#L72)

## Type Parameters

### _TFeatures

`_TFeatures` *extends* [`TableFeatures`](TableFeatures.md)

### _TData

`_TData` *extends* [`RowData`](../type-aliases/RowData.md)

## Properties

### autoResetExpanded()

```ts
autoResetExpanded: () => void;
```

Defined in: [features/row-expanding/rowExpandingFeature.types.ts:76](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-expanding/rowExpandingFeature.types.ts#L76)

#### Returns

`void`

***

### getCanSomeRowsExpand()

```ts
getCanSomeRowsExpand: () => boolean;
```

Defined in: [features/row-expanding/rowExpandingFeature.types.ts:80](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-expanding/rowExpandingFeature.types.ts#L80)

Checks whether at least one row can be expanded.

#### Returns

`boolean`

***

### getExpandedDepth()

```ts
getExpandedDepth: () => number;
```

Defined in: [features/row-expanding/rowExpandingFeature.types.ts:84](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-expanding/rowExpandingFeature.types.ts#L84)

Computes the deepest expanded row id depth.

#### Returns

`number`

***

### getIsAllRowsExpanded()

```ts
getIsAllRowsExpanded: () => boolean;
```

Defined in: [features/row-expanding/rowExpandingFeature.types.ts:88](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-expanding/rowExpandingFeature.types.ts#L88)

Checks whether all rows in the current row model are expanded.

#### Returns

`boolean`

***

### getIsSomeRowsExpanded()

```ts
getIsSomeRowsExpanded: () => boolean;
```

Defined in: [features/row-expanding/rowExpandingFeature.types.ts:92](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-expanding/rowExpandingFeature.types.ts#L92)

Checks whether any row is currently expanded.

#### Returns

`boolean`

***

### getToggleAllRowsExpandedHandler()

```ts
getToggleAllRowsExpandedHandler: () => (event) => void;
```

Defined in: [features/row-expanding/rowExpandingFeature.types.ts:96](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-expanding/rowExpandingFeature.types.ts#L96)

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

Defined in: [features/row-expanding/rowExpandingFeature.types.ts:102](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-expanding/rowExpandingFeature.types.ts#L102)

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

Defined in: [features/row-expanding/rowExpandingFeature.types.ts:106](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-expanding/rowExpandingFeature.types.ts#L106)

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

Defined in: [features/row-expanding/rowExpandingFeature.types.ts:110](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-expanding/rowExpandingFeature.types.ts#L110)

Toggles the expanded state for all rows.

#### Parameters

##### expanded?

`boolean`

#### Returns

`void`
