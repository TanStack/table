---
id: Table_RowExpanding
title: Table_RowExpanding
---

# Interface: Table\_RowExpanding\<TFeatures, TData\>

## Type Parameters

• **TFeatures** *extends* [`TableFeatures`](../type-aliases/tablefeatures.md)

• **TData** *extends* [`RowData`](../type-aliases/rowdata.md)

## Properties

### autoResetExpanded()

```ts
autoResetExpanded: () => void;
```

#### Returns

`void`

#### Defined in

[features/row-expanding/RowExpanding.types.ts:99](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-expanding/RowExpanding.types.ts#L99)

***

### getCanSomeRowsExpand()

```ts
getCanSomeRowsExpand: () => boolean;
```

Returns whether there are any rows that can be expanded.

#### Returns

`boolean`

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/expanding#getcansomerowsexpand)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/expanding)

#### Defined in

[features/row-expanding/RowExpanding.types.ts:105](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-expanding/RowExpanding.types.ts#L105)

***

### getExpandedDepth()

```ts
getExpandedDepth: () => number;
```

Returns the maximum depth of the expanded rows.

#### Returns

`number`

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/expanding#getexpandeddepth)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/expanding)

#### Defined in

[features/row-expanding/RowExpanding.types.ts:111](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-expanding/RowExpanding.types.ts#L111)

***

### getIsAllRowsExpanded()

```ts
getIsAllRowsExpanded: () => boolean;
```

Returns whether all rows are currently expanded.

#### Returns

`boolean`

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/expanding#getisallrowsexpanded)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/expanding)

#### Defined in

[features/row-expanding/RowExpanding.types.ts:117](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-expanding/RowExpanding.types.ts#L117)

***

### getIsSomeRowsExpanded()

```ts
getIsSomeRowsExpanded: () => boolean;
```

Returns whether there are any rows that are currently expanded.

#### Returns

`boolean`

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/expanding#getissomerowsexpanded)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/expanding)

#### Defined in

[features/row-expanding/RowExpanding.types.ts:123](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-expanding/RowExpanding.types.ts#L123)

***

### getToggleAllRowsExpandedHandler()

```ts
getToggleAllRowsExpandedHandler: () => (event) => void;
```

Returns a handler that can be used to toggle the expanded state of all rows. This handler is meant to be used with an `input[type=checkbox]` element.

#### Returns

`Function`

##### Parameters

• **event**: `unknown`

##### Returns

`void`

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/expanding#gettoggleallrowsexpandedhandler)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/expanding)

#### Defined in

[features/row-expanding/RowExpanding.types.ts:129](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-expanding/RowExpanding.types.ts#L129)

***

### resetExpanded()

```ts
resetExpanded: (defaultState?) => void;
```

Resets the expanded state of the table to the initial state.

#### Parameters

• **defaultState?**: `boolean`

#### Returns

`void`

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/expanding#resetexpanded)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/expanding)

#### Defined in

[features/row-expanding/RowExpanding.types.ts:135](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-expanding/RowExpanding.types.ts#L135)

***

### setExpanded()

```ts
setExpanded: (updater) => void;
```

Updates the expanded state of the table via an update function or value.

#### Parameters

• **updater**: [`Updater`](../type-aliases/updater.md)\<[`ExpandedState`](../type-aliases/expandedstate.md)\>

#### Returns

`void`

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/expanding#setexpanded)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/expanding)

#### Defined in

[features/row-expanding/RowExpanding.types.ts:141](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-expanding/RowExpanding.types.ts#L141)

***

### toggleAllRowsExpanded()

```ts
toggleAllRowsExpanded: (expanded?) => void;
```

Toggles the expanded state for all rows.

#### Parameters

• **expanded?**: `boolean`

#### Returns

`void`

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/expanding#toggleallrowsexpanded)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/expanding)

#### Defined in

[features/row-expanding/RowExpanding.types.ts:147](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-expanding/RowExpanding.types.ts#L147)
