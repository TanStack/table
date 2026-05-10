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

Returns whether there are any rows that can be expanded.

#### Returns

`boolean`

***

### getExpandedDepth()

```ts
getExpandedDepth: () => number;
```

Defined in: [features/row-expanding/rowExpandingFeature.types.ts:85](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-expanding/rowExpandingFeature.types.ts#L85)

Returns the maximum depth of the expanded rows.

#### Returns

`number`

***

### getIsAllRowsExpanded()

```ts
getIsAllRowsExpanded: () => boolean;
```

Defined in: [features/row-expanding/rowExpandingFeature.types.ts:89](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-expanding/rowExpandingFeature.types.ts#L89)

Returns whether all rows are currently expanded.

#### Returns

`boolean`

***

### getIsSomeRowsExpanded()

```ts
getIsSomeRowsExpanded: () => boolean;
```

Defined in: [features/row-expanding/rowExpandingFeature.types.ts:93](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-expanding/rowExpandingFeature.types.ts#L93)

Returns whether there are any rows that are currently expanded.

#### Returns

`boolean`

***

### getToggleAllRowsExpandedHandler()

```ts
getToggleAllRowsExpandedHandler: () => (event) => void;
```

Defined in: [features/row-expanding/rowExpandingFeature.types.ts:97](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-expanding/rowExpandingFeature.types.ts#L97)

Returns a handler that can be used to toggle the expanded state of all rows. This handler is meant to be used with an `input[type=checkbox]` element.

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

Resets expanded state to `initialState.expanded`. Pass `true` to reset to
the feature default of `{}`.

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

Sets expanded state using a value or updater.

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
