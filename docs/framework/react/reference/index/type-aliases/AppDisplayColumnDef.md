---
id: AppDisplayColumnDef
title: AppDisplayColumnDef
---

# Type Alias: AppDisplayColumnDef\<TFeatures, TData, TCellComponents, THeaderComponents\>

```ts
type AppDisplayColumnDef<TFeatures, TData, TCellComponents, THeaderComponents> = Omit<DisplayColumnDef<TFeatures, TData, unknown>, "cell" | "header" | "footer"> & object;
```

Defined in: [createTableHook.tsx:110](https://github.com/TanStack/table/blob/main/packages/react-table/src/createTableHook.tsx#L110)

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

`TCellComponents` *extends* `Record`\<`string`, `ComponentType`\<`any`\>\>

### THeaderComponents

`THeaderComponents` *extends* `Record`\<`string`, `ComponentType`\<`any`\>\>
