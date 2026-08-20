---
id: AppOctaneTable
title: AppOctaneTable
---

# Type Alias: AppOctaneTable\<TFeatures, TData, TSelected, TTableComponents, TCellComponents, THeaderComponents\>

```ts
type AppOctaneTable<TFeatures, TData, TSelected, TTableComponents, TCellComponents, THeaderComponents> = OctaneTable<TFeatures, TData, TSelected> & CoreNoInfer<TTableComponents> & object;
```

Defined in: [types.ts:733](https://github.com/TanStack/table/blob/main/packages/octane-table/src/types.ts#L733)

Extended table API returned by `useAppTable` with all App wrapper components.

## Type Declaration

### AppCell

```ts
AppCell: AppCellComponent<TFeatures, TData, CoreNoInfer<TCellComponents>>;
```

Wraps a cell and provides cell context with pre-bound cellComponents.
Optionally accepts a selector for Subscribe functionality.

#### Example

```tsx
<table.AppCell cell={cell}>
  {(c) => <td><c.TextCell /></td>}
</table.AppCell>
```

### AppFooter

```ts
AppFooter: AppHeaderComponent<TFeatures, TData, CoreNoInfer<THeaderComponents>>;
```

Wraps a footer and provides header context with pre-bound
headerComponents.

#### Example

```tsx
<table.AppFooter header={footer}>
  {(f) => <td><f.FlexRender /></td>}
</table.AppFooter>
```

### AppHeader

```ts
AppHeader: AppHeaderComponent<TFeatures, TData, CoreNoInfer<THeaderComponents>>;
```

Wraps a header and provides header context with pre-bound
headerComponents. Optionally accepts a selector for Subscribe
functionality.

#### Example

```tsx
<table.AppHeader header={header}>
  {(h) => <th><h.SortIndicator /></th>}
</table.AppHeader>
```

### AppTable

```ts
AppTable: AppTableComponent<TFeatures>;
```

Root wrapper component that provides table context with optional
Subscribe.

#### Example

```tsx
// Without selector — children is a renderable
<table.AppTable>
  <table>…</table>
</table.AppTable>

// With selector — children receives selected state
<table.AppTable selector={(s) => s.pagination}>
  {(pagination) => <div>{pagination.pageIndex as unknown as string}</div>}
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

`TTableComponents` *extends* `Record`\<`string`, [`TableComponentType`](TableComponentType.md)\>

### TCellComponents

`TCellComponents` *extends* `Record`\<`string`, [`TableComponentType`](TableComponentType.md)\>

### THeaderComponents

`THeaderComponents` *extends* `Record`\<`string`, [`TableComponentType`](TableComponentType.md)\>
