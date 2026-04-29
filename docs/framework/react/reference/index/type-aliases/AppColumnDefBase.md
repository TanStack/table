---
id: AppColumnDefBase
title: AppColumnDefBase
---

# Type Alias: AppColumnDefBase\<TFeatures, TData, TValue, TCellComponents, THeaderComponents\>

```ts
type AppColumnDefBase<TFeatures, TData, TValue, TCellComponents, THeaderComponents> = Omit<IdentifiedColumnDef<TFeatures, TData, TValue>, "cell" | "header" | "footer"> & object;
```

Defined in: [createTableHook.tsx:86](https://github.com/TanStack/table/blob/main/packages/react-table/src/createTableHook.tsx#L86)

Enhanced column definition base with pre-bound components in cell/header/footer contexts.

## Type Declaration

### cell?

```ts
optional cell: AppColumnDefTemplate<AppCellContext<TFeatures, TData, TValue, TCellComponents>>;
```

### footer?

```ts
optional footer: AppColumnDefTemplate<AppHeaderContext<TFeatures, TData, TValue, THeaderComponents>>;
```

### header?

```ts
optional header: AppColumnDefTemplate<AppHeaderContext<TFeatures, TData, TValue, THeaderComponents>>;
```

## Type Parameters

### TFeatures

`TFeatures` *extends* `TableFeatures`

### TData

`TData` *extends* `RowData`

### TValue

`TValue` *extends* `CellData`

### TCellComponents

`TCellComponents` *extends* `Record`\<`string`, `ComponentType`\<`any`\>\>

### THeaderComponents

`THeaderComponents` *extends* `Record`\<`string`, `ComponentType`\<`any`\>\>
