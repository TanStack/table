---
id: Table_RowExpanding
title: Table_RowExpanding
---

# Interface: Table\_RowExpanding\<TFeatures, TData\>

## Type Parameters

• **TFeatures** *extends* [`TableFeatures`](tablefeatures.md)

• **TData** *extends* [`RowData`](../type-aliases/rowdata.md)

## Properties

### \_autoResetExpanded()

```ts
_autoResetExpanded: () => void;
```

#### Returns

`void`

#### Defined in

[features/row-expanding/RowExpanding.types.ts:98](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/row-expanding/RowExpanding.types.ts#L98)

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

[features/row-expanding/RowExpanding.types.ts:104](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/row-expanding/RowExpanding.types.ts#L104)

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

[features/row-expanding/RowExpanding.types.ts:110](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/row-expanding/RowExpanding.types.ts#L110)

***

### getExpandedRowModel()

```ts
getExpandedRowModel: () => RowModel<TFeatures, TData>;
```

Returns the row model after expansion has been applied.

#### Returns

`RowModel`\<`TFeatures`, `TData`\>

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/expanding#getexpandedrowmodel)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/expanding)

#### Defined in

[features/row-expanding/RowExpanding.types.ts:116](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/row-expanding/RowExpanding.types.ts#L116)

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

[features/row-expanding/RowExpanding.types.ts:122](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/row-expanding/RowExpanding.types.ts#L122)

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

[features/row-expanding/RowExpanding.types.ts:128](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/row-expanding/RowExpanding.types.ts#L128)

***

### getPreExpandedRowModel()

```ts
getPreExpandedRowModel: () => RowModel<TFeatures, TData>;
```

Returns the row model before expansion has been applied.

#### Returns

`RowModel`\<`TFeatures`, `TData`\>

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/expanding#getpreexpandedrowmodel)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/expanding)

#### Defined in

[features/row-expanding/RowExpanding.types.ts:134](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/row-expanding/RowExpanding.types.ts#L134)

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

[features/row-expanding/RowExpanding.types.ts:140](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/row-expanding/RowExpanding.types.ts#L140)

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

[features/row-expanding/RowExpanding.types.ts:146](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/row-expanding/RowExpanding.types.ts#L146)

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

[features/row-expanding/RowExpanding.types.ts:152](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/row-expanding/RowExpanding.types.ts#L152)

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

[features/row-expanding/RowExpanding.types.ts:158](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/row-expanding/RowExpanding.types.ts#L158)
