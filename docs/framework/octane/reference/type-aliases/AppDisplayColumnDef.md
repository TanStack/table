---
id: AppDisplayColumnDef
title: AppDisplayColumnDef
---

# Type Alias: AppDisplayColumnDef\<TFeatures, TData, TCellComponents, THeaderComponents\>

```ts
type AppDisplayColumnDef<TFeatures, TData, TCellComponents, THeaderComponents> = Omit<DisplayColumnDef<TFeatures, TData, unknown>, "cell" | "header" | "footer"> & object;
```

Defined in: [types.ts:406](https://github.com/TanStack/table/blob/main/packages/octane-table/src/types.ts#L406)

Enhanced display column definition with pre-bound components.

## Type Declaration

### cell?

```ts
optional cell: AppColumnDefTemplate<AppCellContext<TFeatures, TData, unknown, TCellComponents>>;
```

### footer?

```ts
optional footer: AppColumnDefTemplate<AppHeaderContext<TFeatures, TData, unknown, THeaderComponents>>;
```

### header?

```ts
optional header: AppColumnDefTemplate<AppHeaderContext<TFeatures, TData, unknown, THeaderComponents>>;
```

## Type Parameters

### TFeatures

`TFeatures` *extends* `TableFeatures`

### TData

`TData` *extends* `RowData`

### TCellComponents

`TCellComponents` *extends* `Record`\<`string`, [`TableComponentType`](TableComponentType.md)\>

### THeaderComponents

`THeaderComponents` *extends* `Record`\<`string`, [`TableComponentType`](TableComponentType.md)\>
