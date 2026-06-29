---
id: PreactTable
title: PreactTable
---

# Type Alias: PreactTable\<TFeatures, TData, TSelected\>

```ts
type PreactTable<TFeatures, TData, TSelected> = Omit<Table<TFeatures, TData>, "store"> & object;
```

Defined in: [useTable.ts:19](https://github.com/TanStack/table/blob/main/packages/preact-table/src/useTable.ts#L19)

## Type Declaration

### FlexRender()

```ts
FlexRender: <TValue>(props) => ComponentChildren;
```

A Preact component that renders headers, cells, or footers with custom markup.
Use this utility component instead of manually calling flexRender.

#### Type Parameters

##### TValue

`TValue` *extends* `CellData` = `CellData`

#### Parameters

##### props

[`FlexRenderProps`](FlexRenderProps.md)\<`TFeatures`, `TData`, `TValue`\>

#### Returns

`ComponentChildren`

### state

```ts
readonly state: Readonly<TSelected>;
```

The selected state of the table. This state may not match the structure of
the full table state because it is selected by the selector function that
you pass as the 2nd argument to `useTable`.

### ~~store~~

```ts
readonly store: Table<TFeatures, TData>["store"];
```

#### Deprecated

Prefer `table.state` for render reads,
`table.atoms.<slice>.get()` for slice snapshots, or
`table.Subscribe` / `useSelector(table.store, selector)` for explicit
subscriptions. `table.store.state` is a current-value snapshot and is easy
to misuse in render code.

### Subscribe()

```ts
Subscribe: {
<TSourceValue>  (props): ComponentChildren;
<TSourceValue, TSubSelected>  (props): ComponentChildren;
<TSubSelected>  (props): ComponentChildren;
};
```

Overloads (source first, then store) so JSX contextual typing works for both modes.
Source without `selector` is separate so children infer `TSourceValue` (identity projection).

#### Call Signature

```ts
<TSourceValue>(props): ComponentChildren;
```

##### Type Parameters

###### TSourceValue

`TSourceValue`

##### Parameters

###### props

###### children

(`state`) => `ComponentChildren` \| `ComponentChildren`

###### selector?

`undefined`

###### source

[`SubscribeSource`](SubscribeSource.md)\<`TSourceValue`\>

##### Returns

`ComponentChildren`

#### Call Signature

```ts
<TSourceValue, TSubSelected>(props): ComponentChildren;
```

##### Type Parameters

###### TSourceValue

`TSourceValue`

###### TSubSelected

`TSubSelected`

##### Parameters

###### props

###### children

(`state`) => `ComponentChildren` \| `ComponentChildren`

###### selector

(`state`) => `TSubSelected`

###### source

[`SubscribeSource`](SubscribeSource.md)\<`TSourceValue`\>

##### Returns

`ComponentChildren`

#### Call Signature

```ts
<TSubSelected>(props): ComponentChildren;
```

##### Type Parameters

###### TSubSelected

`TSubSelected`

##### Parameters

###### props

`Omit`\<[`SubscribePropsWithStore`](SubscribePropsWithStore.md)\<`TFeatures`, `TSubSelected`\>, `"source"`\>

##### Returns

`ComponentChildren`

## Type Parameters

### TFeatures

`TFeatures` *extends* `TableFeatures`

### TData

`TData` *extends* `RowData`

### TSelected

`TSelected` = `TableState`\<`TFeatures`\>
