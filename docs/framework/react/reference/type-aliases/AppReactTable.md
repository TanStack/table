---
id: AppReactTable
title: AppReactTable
---

# Type Alias: AppReactTable\<TFeatures, TData, TSelected, TTableComponents, TCellComponents, THeaderComponents\>

```ts
type AppReactTable<TFeatures, TData, TSelected, TTableComponents, TCellComponents, THeaderComponents> = ReactTable<TFeatures, TData, TSelected> & NoInfer<TTableComponents> & object;
```

Defined in: [createTableHook.tsx:430](https://github.com/TanStack/table/blob/main/packages/react-table/src/createTableHook.tsx#L430)

Extended table API returned by useAppTable with all App wrapper components

## Type Declaration

### AppCell

```ts
AppCell: AppCellComponent<TFeatures, TData, NoInfer<TCellComponents>>;
```

Wraps a cell and provides cell context with pre-bound cellComponents.
Optionally accepts a selector for Subscribe functionality.

#### Example

```tsx
// Without selector
<table.AppCell cell={cell}>
  {(c) => <td><c.TextCell /></td>}
</table.AppCell>

// With selector - children receives cell and selected state
<table.AppCell cell={cell} selector={(s) => s.columnFilters}>
  {(c, filters) => <td>{filters.length}</td>}
</table.AppCell>
```

### AppFooter

```ts
AppFooter: AppHeaderComponent<TFeatures, TData, NoInfer<THeaderComponents>>;
```

Wraps a footer and provides header context with pre-bound headerComponents.
Optionally accepts a selector for Subscribe functionality.

#### Example

```tsx
<table.AppFooter header={footer}>
  {(f) => <td><table.FlexRender footer={footer} /></td>}
</table.AppFooter>
```

### AppHeader

```ts
AppHeader: AppHeaderComponent<TFeatures, TData, NoInfer<THeaderComponents>>;
```

Wraps a header and provides header context with pre-bound headerComponents.
Optionally accepts a selector for Subscribe functionality.

#### Example

```tsx
// Without selector
<table.AppHeader header={header}>
  {(h) => <th><h.SortIndicator /></th>}
</table.AppHeader>

// With selector
<table.AppHeader header={header} selector={(s) => s.sorting}>
  {(h, sorting) => <th>{sorting.length} sorted</th>}
</table.AppHeader>
```

### AppTable

```ts
AppTable: AppTableComponent<TFeatures>;
```

Root wrapper component that provides table context with optional Subscribe.

#### Example

```tsx
// Without selector - children is ReactNode
<table.AppTable>
  <table>...</table>
</table.AppTable>

// With selector - children receives selected state
<table.AppTable selector={(s) => s.pagination}>
  {(pagination) => <div>Page {pagination.pageIndex}</div>}
</table.AppTable>
```

## Type Parameters

### TFeatures

`TFeatures` *extends* `TableFeatures`

### TData

`TData` *extends* `RowData`

### TSelected

`TSelected`

### TTableComponents

`TTableComponents` *extends* `Record`\<`string`, `ComponentType`\<`any`\>\>

### TCellComponents

`TCellComponents` *extends* `Record`\<`string`, `ComponentType`\<`any`\>\>

### THeaderComponents

`THeaderComponents` *extends* `Record`\<`string`, `ComponentType`\<`any`\>\>
