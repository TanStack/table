---
id: Table_RowExpanding
title: Table_RowExpanding
---

# Interface: Table\_RowExpanding\<TFeatures, TData\>

Defined in: [packages/table-core/src/features/row-expanding/rowExpandingFeature.types.ts:71](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-expanding/rowExpandingFeature.types.ts#L71)

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

Defined in: [packages/table-core/src/features/row-expanding/rowExpandingFeature.types.ts:75](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-expanding/rowExpandingFeature.types.ts#L75)

#### Returns

`void`

***

### getCanSomeRowsExpand()

```ts
getCanSomeRowsExpand: () => boolean;
```

Defined in: [packages/table-core/src/features/row-expanding/rowExpandingFeature.types.ts:79](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-expanding/rowExpandingFeature.types.ts#L79)

Returns whether there are any rows that can be expanded.

#### Returns

`boolean`

***

### getExpandedDepth()

```ts
getExpandedDepth: () => number;
```

Defined in: [packages/table-core/src/features/row-expanding/rowExpandingFeature.types.ts:83](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-expanding/rowExpandingFeature.types.ts#L83)

Returns the maximum depth of the expanded rows.

#### Returns

`number`

***

### getIsAllRowsExpanded()

```ts
getIsAllRowsExpanded: () => boolean;
```

Defined in: [packages/table-core/src/features/row-expanding/rowExpandingFeature.types.ts:87](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-expanding/rowExpandingFeature.types.ts#L87)

Returns whether all rows are currently expanded.

#### Returns

`boolean`

***

### getIsSomeRowsExpanded()

```ts
getIsSomeRowsExpanded: () => boolean;
```

Defined in: [packages/table-core/src/features/row-expanding/rowExpandingFeature.types.ts:91](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-expanding/rowExpandingFeature.types.ts#L91)

Returns whether there are any rows that are currently expanded.

#### Returns

`boolean`

***

### getToggleAllRowsExpandedHandler()

```ts
getToggleAllRowsExpandedHandler: () => (event) => void;
```

Defined in: [packages/table-core/src/features/row-expanding/rowExpandingFeature.types.ts:95](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-expanding/rowExpandingFeature.types.ts#L95)

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

Defined in: [packages/table-core/src/features/row-expanding/rowExpandingFeature.types.ts:99](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-expanding/rowExpandingFeature.types.ts#L99)

Resets the expanded state of the table to the initial state.

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

Defined in: [packages/table-core/src/features/row-expanding/rowExpandingFeature.types.ts:103](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-expanding/rowExpandingFeature.types.ts#L103)

Updates the expanded state of the table via an update function or value.

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

Defined in: [packages/table-core/src/features/row-expanding/rowExpandingFeature.types.ts:107](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-expanding/rowExpandingFeature.types.ts#L107)

Toggles the expanded state for all rows.

#### Parameters

##### expanded?

`boolean`

#### Returns

`void`
