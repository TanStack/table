---
id: CreateTableHookOptions
title: CreateTableHookOptions
---

# Type Alias: CreateTableHookOptions\<TFeatures, TTableComponents, TCellComponents, THeaderComponents\>

```ts
type CreateTableHookOptions<TFeatures, TTableComponents, TCellComponents, THeaderComponents> = Omit<TableOptions<TFeatures, any>, "columns" | "data" | "store" | "state" | "initialState"> & object;
```

Defined in: [createTableHook.tsx:242](https://github.com/TanStack/table/blob/main/packages/react-table/src/createTableHook.tsx#L242)

Options for creating a table hook with pre-bound components and default table options.
Extends all TableOptions except 'columns' | 'data' | 'store' | 'state' | 'initialState'.

## Type Declaration

### cellComponents?

```ts
optional cellComponents: TCellComponents;
```

Cell-level components that need access to the cell instance.
These are available on the cell object passed to AppCell's children.
Use `useCellContext()` inside these components.

#### Example

```ts
{ TextCell, NumberCell, DateCell, CurrencyCell }
```

### headerComponents?

```ts
optional headerComponents: THeaderComponents;
```

Header-level components that need access to the header instance.
These are available on the header object passed to AppHeader/AppFooter's children.
Use `useHeaderContext()` inside these components.

#### Example

```ts
{ SortIndicator, ColumnFilter, ResizeHandle }
```

### tableComponents?

```ts
optional tableComponents: TTableComponents;
```

Table-level components that need access to the table instance.
These are available directly on the table object returned by useAppTable.
Use `useTableContext()` inside these components.

#### Example

```ts
{ PaginationControls, GlobalFilter, RowCount }
```

## Type Parameters

### TFeatures

`TFeatures` *extends* `TableFeatures`

### TTableComponents

`TTableComponents` *extends* `Record`\<`string`, `ComponentType`\<`any`\>\>

### TCellComponents

`TCellComponents` *extends* `Record`\<`string`, `ComponentType`\<`any`\>\>

### THeaderComponents

`THeaderComponents` *extends* `Record`\<`string`, `ComponentType`\<`any`\>\>
