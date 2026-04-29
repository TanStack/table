---
id: AppDisplayColumnDef
title: AppDisplayColumnDef
---

# Type Alias: AppDisplayColumnDef\<TFeatures, TData, TCellComponents, THeaderComponents\>

```ts
type AppDisplayColumnDef<TFeatures, TData, TCellComponents, THeaderComponents> = Omit<DisplayColumnDef<TFeatures, TData, unknown>, "cell" | "header" | "footer"> & object;
```

Defined in: [helpers/createTableHook.ts:116](https://github.com/TanStack/table/blob/main/packages/angular-table/src/helpers/createTableHook.ts#L116)

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

`TCellComponents` *extends* `Record`\<`string`, [`RenderableComponent`](RenderableComponent.md)\>

### THeaderComponents

`THeaderComponents` *extends* `Record`\<`string`, [`RenderableComponent`](RenderableComponent.md)\>
