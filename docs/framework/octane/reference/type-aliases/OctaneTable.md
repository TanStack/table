---
id: OctaneTable
title: OctaneTable
---

# Type Alias: OctaneTable\<TFeatures, TData, TSelected\>

```ts
type OctaneTable<TFeatures, TData, TSelected> = Omit<Table<TFeatures, TData>, "store"> & object;
```

Defined in: [types.ts:202](https://github.com/TanStack/table/blob/main/packages/octane-table/src/types.ts#L202)

The table instance returned by [useTable](../functions/useTable.md): the framework-agnostic
`Table` from table-core, plus octane's `Subscribe`/`FlexRender` components
and the selected `state`.

## Type Declaration

### FlexRender()

```ts
FlexRender: <TValue>(props) => OctaneNode;
```

An octane component that renders headers, cells, or footers with custom
markup. Use this utility component instead of manually calling
`flexRender`.

#### Type Parameters

##### TValue

`TValue` *extends* `CellData` = `CellData`

#### Parameters

##### props

[`FlexRenderProps`](FlexRenderProps.md)\<`TFeatures`, `TData`, `TValue`\>

#### Returns

`OctaneNode`

#### Example

```tsx
<table.FlexRender cell={cell} />
<table.FlexRender header={header} />
<table.FlexRender footer={footer} />
```

This replaces calling `flexRender` directly like this:
```tsx
flexRender(cell.column.columnDef.cell, cell.getContext())
flexRender(header.column.columnDef.header, header.getContext())
flexRender(footer.column.columnDef.footer, footer.getContext())
```

### state

```ts
readonly state: Readonly<TSelected>;
```

The selected state of the table. This state may not match the structure of
the full table state because it is selected by the selector function that
you pass as the 2nd argument to `useTable`.

#### Example

```ts
const table = useTable(options, (state) => ({ globalFilter: state.globalFilter }))

table.state.globalFilter
```

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
<TSourceValue>  (props): unknown;
<TSourceValue, TSubSelected>  (props): unknown;
<TSubSelected>  (props): unknown;
};
```

Overloads (not a single union) so `selector` callbacks get correct
contextual types in JSX; a union of two `selector` signatures degrades to
implicit `any`.

Source **without** `selector` is a separate overload so children receive
`TSourceValue` (identity projection). If `selector` were optional on one
overload, `TSubSelected` would default to `unknown` instead of inferring
from the source.

The **source** overloads are listed first so `TSourceValue` is inferred
from `source`.

#### Call Signature

```ts
<TSourceValue>(props): unknown;
```

##### Type Parameters

###### TSourceValue

`TSourceValue`

##### Parameters

###### props

###### children

  \| (`state`) => `OctaneNode`
  \| [`SubscribeStaticChild`](SubscribeStaticChild.md)

###### selector?

`undefined`

###### source

[`SubscribeSource`](SubscribeSource.md)\<`TSourceValue`\>

##### Returns

`unknown`

#### Call Signature

```ts
<TSourceValue, TSubSelected>(props): unknown;
```

##### Type Parameters

###### TSourceValue

`TSourceValue`

###### TSubSelected

`TSubSelected`

##### Parameters

###### props

###### children

  \| (`state`) => `OctaneNode`
  \| [`SubscribeStaticChild`](SubscribeStaticChild.md)

###### selector

(`state`) => `TSubSelected`

###### source

[`SubscribeSource`](SubscribeSource.md)\<`TSourceValue`\>

##### Returns

`unknown`

#### Call Signature

```ts
<TSubSelected>(props): unknown;
```

##### Type Parameters

###### TSubSelected

`TSubSelected`

##### Parameters

###### props

`Omit`\<[`SubscribePropsWithStore`](../interfaces/SubscribePropsWithStore.md)\<`TFeatures`, `TSubSelected`\>, `"source"`\>

##### Returns

`unknown`

## Type Parameters

### TFeatures

`TFeatures` *extends* `TableFeatures`

### TData

`TData` *extends* `RowData`

### TSelected

`TSelected` = `TableState`\<`TFeatures`\>
