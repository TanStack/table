---
id: AppGroupColumnDef
title: AppGroupColumnDef
---

# Type Alias: AppGroupColumnDef\<TFeatures, TData, TCellComponents, THeaderComponents\>

```ts
type AppGroupColumnDef<TFeatures, TData, TCellComponents, THeaderComponents> = Omit<GroupColumnDef<TFeatures, TData, unknown>, "cell" | "header" | "footer" | "columns"> & object;
```

Defined in: [createTableHook.tsx:133](https://github.com/TanStack/table/blob/main/packages/react-table/src/createTableHook.tsx#L133)

Enhanced group column definition with pre-bound components.

## Type Declaration

### cell?

```ts
optional cell: AppColumnDefTemplate<AppCellContext<TFeatures, TData, unknown, TCellComponents>>;
```

### columns?

```ts
optional columns: ColumnDef<TFeatures, TData, unknown>[];
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
