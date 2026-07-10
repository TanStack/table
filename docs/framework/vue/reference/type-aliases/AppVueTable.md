---
id: AppVueTable
title: AppVueTable
---

# Type Alias: AppVueTable\<TFeatures, TData, TTableComponents, _TCellComponents, _THeaderComponents\>

```ts
type AppVueTable<TFeatures, TData, TTableComponents, _TCellComponents, _THeaderComponents> = VueTable<TFeatures, TData> & NoInfer<TTableComponents> & object;
```

Defined in: [packages/vue-table/src/createTableHook.ts:212](https://github.com/TanStack/table/blob/main/packages/vue-table/src/createTableHook.ts#L212)

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

### TTableComponents

`TTableComponents` *extends* `Record`\<`string`, [`ComponentType`](ComponentType.md)\<`any`\>\>

### _TCellComponents

`_TCellComponents` *extends* `Record`\<`string`, [`ComponentType`](ComponentType.md)\<`any`\>\>

### _THeaderComponents

`_THeaderComponents` *extends* `Record`\<`string`, [`ComponentType`](ComponentType.md)\<`any`\>\>
