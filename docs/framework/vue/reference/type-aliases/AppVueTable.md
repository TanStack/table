---
id: AppVueTable
title: AppVueTable
---

# Type Alias: AppVueTable\<TFeatures, TData, TSelected, TTableComponents, TCellComponents, THeaderComponents\>

```ts
type AppVueTable<TFeatures, TData, TSelected, TTableComponents, TCellComponents, THeaderComponents> = VueTable<TFeatures, TData> & NoInfer<TTableComponents> & object;
```

Defined in: [packages/vue-table/src/createTableHook.ts:213](https://github.com/TanStack/table/blob/main/packages/vue-table/src/createTableHook.ts#L213)

## Type Declaration

### AppCell

```ts
AppCell: Component<AppCellProps<TFeatures, TData>>;
```

### AppFooter

```ts
AppFooter: Component<AppHeaderProps<TFeatures, TData>>;
```

### AppHeader

```ts
AppHeader: Component<AppHeaderProps<TFeatures, TData>>;
```

### AppTable

```ts
AppTable: Component<AppTableProps>;
```

### FlexRender

```ts
FlexRender: typeof AppFlexRender;
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
