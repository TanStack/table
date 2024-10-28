---
id: Table_ColumnSizing
title: Table_ColumnSizing
---

# Interface: Table\_ColumnSizing

## Properties

### getCenterTotalSize()

```ts
getCenterTotalSize: () => number;
```

If pinning, returns the total size of the center portion of the table by calculating the sum of the sizes of all unpinned/center leaf-columns.

#### Returns

`number`

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/column-sizing#getcentertotalsize)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/column-sizing)

#### Defined in

[features/column-sizing/ColumnSizing.types.ts:30](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-sizing/ColumnSizing.types.ts#L30)

***

### getLeftTotalSize()

```ts
getLeftTotalSize: () => number;
```

Returns the total size of the left portion of the table by calculating the sum of the sizes of all left leaf-columns.

#### Returns

`number`

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/column-sizing#getlefttotalsize)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/column-sizing)

#### Defined in

[features/column-sizing/ColumnSizing.types.ts:36](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-sizing/ColumnSizing.types.ts#L36)

***

### getRightTotalSize()

```ts
getRightTotalSize: () => number;
```

Returns the total size of the right portion of the table by calculating the sum of the sizes of all right leaf-columns.

#### Returns

`number`

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/column-sizing#getrighttotalsize)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/column-sizing)

#### Defined in

[features/column-sizing/ColumnSizing.types.ts:42](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-sizing/ColumnSizing.types.ts#L42)

***

### getTotalSize()

```ts
getTotalSize: () => number;
```

Returns the total size of the table by calculating the sum of the sizes of all leaf-columns.

#### Returns

`number`

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/column-sizing#gettotalsize)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/column-sizing)

#### Defined in

[features/column-sizing/ColumnSizing.types.ts:48](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-sizing/ColumnSizing.types.ts#L48)

***

### resetColumnSizing()

```ts
resetColumnSizing: (defaultState?) => void;
```

Resets column sizing to its initial state. If `defaultState` is `true`, the default state for the table will be used instead of the initialValue provided to the table.

#### Parameters

• **defaultState?**: `boolean`

#### Returns

`void`

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/column-sizing#resetcolumnsizing)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/column-sizing)

#### Defined in

[features/column-sizing/ColumnSizing.types.ts:54](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-sizing/ColumnSizing.types.ts#L54)

***

### setColumnSizing()

```ts
setColumnSizing: (updater) => void;
```

Sets the column sizing state using an updater function or a value. This will trigger the underlying `onColumnSizingChange` function if one is passed to the table options, otherwise the state will be managed automatically by the table.

#### Parameters

• **updater**: [`Updater`](../type-aliases/updater.md)\<[`ColumnSizingState`](../type-aliases/columnsizingstate.md)\>

#### Returns

`void`

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/column-sizing#setcolumnsizing)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/column-sizing)

#### Defined in

[features/column-sizing/ColumnSizing.types.ts:60](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-sizing/ColumnSizing.types.ts#L60)
