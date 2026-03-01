---
id: ReactTable
title: ReactTable
---

# Type Alias: ReactTable\<TFeatures, TData, TSelected\>

```ts
type ReactTable<TFeatures, TData, TSelected> = Table<TFeatures, TData> & object;
```

Defined in: [useTable.ts:23](https://github.com/TanStack/table/blob/main/packages/react-table/src/useTable.ts#L23)

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
readonly state: Readonly<TSelected>;
```

The selected state of the table. This state may not match the structure of `table.store.state` because it is selected by the `selector` function that you pass as the 2nd argument to `useTable`.

#### Example

```ts
const table = useTable(options, (state) => ({ globalFilter: state.globalFilter })) // only globalFilter is part of the selected state

console.log(table.state.globalFilter)
```

### Subscribe()

```ts
Subscribe: <TSelected>(props) => ReturnType<FunctionComponent>;
```

A React HOC (Higher Order Component) that allows you to subscribe to the table state.

This is useful for opting into state re-renders for specific parts of the table state.

#### Type Parameters

##### TSelected

`TSelected`

#### Parameters

##### props

###### children

(`state`) => `ReactNode` \| `ReactNode`

###### selector

(`state`) => `TSelected`

#### Returns

`ReturnType`\<`FunctionComponent`\>

#### Example

```ts
<table.Subscribe selector={(state) => ({ rowSelection: state.rowSelection })}>
  {({ rowSelection }) => ( // important to include `{() => {()}}` syntax
    <tr key={row.id}>
         // render the row
    </tr>
  ))}
</table.Subscribe>
```

## Type Parameters

### TFeatures

`TFeatures` *extends* `TableFeatures`

### TData

`TData` *extends* `RowData`

### TSelected

`TSelected` = \{
\}
