---
id: AppSolidTable
title: AppSolidTable
---

# Type Alias: AppSolidTable\<TFeatures, TData, TSelected, TTableComponents, TCellComponents, THeaderComponents\>

```ts
type AppSolidTable<TFeatures, TData, TSelected, TTableComponents, TCellComponents, THeaderComponents> = SolidTable<TFeatures, TData> & NoInfer<TTableComponents> & object;
```

Defined in: [createTableHook.tsx:346](https://github.com/TanStack/table/blob/main/packages/solid-table/src/createTableHook.tsx#L346)

Extended table API returned by createAppTable with all App wrapper components

## Type Declaration

### AppCell

```ts
AppCell: AppCellComponent<TFeatures, TData, NoInfer<TCellComponents>>;
```

Wraps a cell and provides cell context with pre-bound cellComponents.

#### Example

```tsx
<table.AppCell cell={cell}>
  {(c) => <td><c.TextCell /></td>}
</table.AppCell>
```

### AppFooter

```ts
AppFooter: AppHeaderComponent<TFeatures, TData, NoInfer<THeaderComponents>>;
```

Wraps a footer and provides header context with pre-bound headerComponents.

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

Root wrapper component that provides table context.

#### Example

```tsx
<table.AppTable>
  <table>...</table>
</table.AppTable>
```

### FlexRender

```ts
FlexRender: typeof FlexRender;
```

Convenience FlexRender component attached to the table instance.
Renders cell, header, or footer content from column definitions.

#### Example

```tsx
<table.FlexRender header={header} />
<table.FlexRender cell={cell} />
<table.FlexRender footer={footer} />
```

## Type Parameters

### TFeatures

`TFeatures` *extends* `TableFeatures`

### TData

`TData` *extends* `RowData`

### TSelected

`TSelected`

### TTableComponents

`TTableComponents` *extends* `Record`\<`string`, [`ComponentType`](ComponentType.md)\<`any`\>\>

### TCellComponents

`TCellComponents` *extends* `Record`\<`string`, [`ComponentType`](ComponentType.md)\<`any`\>\>

### THeaderComponents

`THeaderComponents` *extends* `Record`\<`string`, [`ComponentType`](ComponentType.md)\<`any`\>\>
