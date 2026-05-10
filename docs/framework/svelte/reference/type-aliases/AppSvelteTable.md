---
id: AppSvelteTable
title: AppSvelteTable
---

# Type Alias: AppSvelteTable\<TFeatures, TData, TSelected, TTableComponents, TCellComponents, THeaderComponents\>

```ts
type AppSvelteTable<TFeatures, TData, TSelected, TTableComponents, TCellComponents, THeaderComponents> = SvelteTable<TFeatures, TData, TSelected> & NoInfer<TTableComponents> & object;
```

Defined in: [packages/svelte-table/src/createTableHook.svelte.ts:290](https://github.com/TanStack/table/blob/main/packages/svelte-table/src/createTableHook.svelte.ts#L290)

Extended table API returned by createAppTable with all App wrapper components.

## Type Declaration

### AppCell

```ts
AppCell: Component<{
  cell: Cell<TFeatures, TData, any>;
  children: Snippet<[Cell<TFeatures, TData, any> & NoInfer<TCellComponents> & object]>;
}>;
```

Wraps a cell and provides cell context with pre-bound cellComponents.

#### Example

```svelte
<table.AppCell cell={cell}>
  {#snippet children(c)}
    <td><c.TextCell /></td>
  {/snippet}
</table.AppCell>
```

### AppFooter

```ts
AppFooter: Component<{
  children: Snippet<[Header<TFeatures, TData, any> & NoInfer<THeaderComponents> & object]>;
  header: Header<TFeatures, TData, any>;
}>;
```

Wraps a footer and provides header context with pre-bound headerComponents.

#### Example

```svelte
<table.AppFooter header={footer}>
  {#snippet children(f)}
    <td><f.FlexRender /></td>
  {/snippet}
</table.AppFooter>
```

### AppHeader

```ts
AppHeader: Component<{
  children: Snippet<[Header<TFeatures, TData, any> & NoInfer<THeaderComponents> & object]>;
  header: Header<TFeatures, TData, any>;
}>;
```

Wraps a header and provides header context with pre-bound headerComponents.

#### Example

```svelte
<table.AppHeader header={header}>
  {#snippet children(h)}
    <th><h.SortIndicator /></th>
  {/snippet}
</table.AppHeader>
```

### AppTable

```ts
AppTable: Component<{
  children: Snippet;
}>;
```

Root wrapper component that provides table context.

#### Example

```svelte
<table.AppTable>
  <table>...</table>
</table.AppTable>
```

### FlexRender

```ts
FlexRender: typeof FlexRender;
```

Convenience FlexRender component attached to the table instance.

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
