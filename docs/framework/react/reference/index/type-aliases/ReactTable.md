---
id: ReactTable
title: ReactTable
---

# Type Alias: ReactTable\<TFeatures, TData, TSelected\>

```ts
type ReactTable<TFeatures, TData, TSelected> = Table<TFeatures, TData> & object;
```

Defined in: [useTable.ts:21](https://github.com/TanStack/table/blob/main/packages/react-table/src/useTable.ts#L21)

## Type Declaration

### FlexRender()

```ts
FlexRender: <TValue>(props) => ReactNode;
```

A React component that renders headers, cells, or footers with custom markup.
Use this utility component instead of manually calling flexRender.

#### Type Parameters

##### TValue

`TValue` *extends* `CellData` = `CellData`

#### Parameters

##### props

[`FlexRenderProps`](FlexRenderProps.md)\<`TFeatures`, `TData`, `TValue`\>

#### Returns

`ReactNode`

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
readonly state: Readonly<TSelected> & object;
```

The selected state of the table. This state may not match the structure of `table.store.state` because it is selected by the `selector` function that you pass as the 2nd argument to `useTable`.

#### Type Declaration

##### columns

```ts
columns: TableOptions<TFeatures, TData>["columns"];
```

##### data

```ts
data: TableOptions<TFeatures, TData>["data"];
```

#### Example

```ts
const table = useTable(options, (state) => ({ globalFilter: state.globalFilter })) // only globalFilter is part of the selected state

console.log(table.state.globalFilter)
```

### Subscribe()

```ts
Subscribe: {
<TSourceValue>  (props): ReactNode | Promise<ReactNode>;
<TSourceValue, TSubSelected>  (props): ReactNode | Promise<ReactNode>;
<TSubSelected>  (props): ReactNode | Promise<ReactNode>;
};
```

Overloads (not a single union) so `selector` callbacks get correct contextual
types in JSX; a union of two `selector` signatures degrades to implicit `any`.

Source **without** `selector` is a separate overload so children receive `TSourceValue`
(identity projection). If `selector` were optional on one overload, `TSubSelected`
would default to `unknown` instead of inferring from the source.

The **source** overloads are listed first so `TSourceValue` is inferred from `source`.

#### Call Signature

```ts
<TSourceValue>(props): ReactNode | Promise<ReactNode>;
```

##### Type Parameters

###### TSourceValue

`TSourceValue`

##### Parameters

###### props

###### children

(`state`) => `ReactNode` \| `ReactNode`

###### selector?

`undefined`

###### source

`Atom`\<`TSourceValue`\> \| `ReadonlyAtom`\<`TSourceValue`\>

##### Returns

`ReactNode` \| `Promise`\<`ReactNode`\>

#### Call Signature

```ts
<TSourceValue, TSubSelected>(props): ReactNode | Promise<ReactNode>;
```

##### Type Parameters

###### TSourceValue

`TSourceValue`

###### TSubSelected

`TSubSelected`

##### Parameters

###### props

###### children

(`state`) => `ReactNode` \| `ReactNode`

###### selector

(`state`) => `TSubSelected`

###### source

`Atom`\<`TSourceValue`\> \| `ReadonlyAtom`\<`TSourceValue`\>

##### Returns

`ReactNode` \| `Promise`\<`ReactNode`\>

#### Call Signature

```ts
<TSubSelected>(props): ReactNode | Promise<ReactNode>;
```

##### Type Parameters

###### TSubSelected

`TSubSelected`

##### Parameters

###### props

`Omit`\<[`SubscribePropsWithStore`](SubscribePropsWithStore.md)\<`TFeatures`, `TData`, `TSubSelected`\>, `"table"`\>

##### Returns

`ReactNode` \| `Promise`\<`ReactNode`\>

## Type Parameters

### TFeatures

`TFeatures` *extends* `TableFeatures`

### TData

`TData` *extends* `RowData`

### TSelected

`TSelected` = \{
\}
