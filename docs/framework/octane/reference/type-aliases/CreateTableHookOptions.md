---
id: CreateTableHookOptions
title: CreateTableHookOptions
---

# Type Alias: CreateTableHookOptions\<TFeatures, TTableComponents, TCellComponents, THeaderComponents\>

```ts
type CreateTableHookOptions<TFeatures, TTableComponents, TCellComponents, THeaderComponents> = Omit<TableOptions<TFeatures, any>, "columns" | "data" | "store" | "state" | "initialState"> & object;
```

Defined in: [types.ts:535](https://github.com/TanStack/table/blob/main/packages/octane-table/src/types.ts#L535)

Options for creating a table hook with pre-bound components and default table
options. Extends all TableOptions except
`columns` | `data` | `store` | `state` | `initialState`.

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

### cellContext?

```ts
optional cellContext: Context<Cell<any, any, any>>;
```

A custom octane context for the cell instance, used inside your
`cellComponents`.

#### See

CreateTableHookOptions.tableContext

### headerComponents?

```ts
optional headerComponents: THeaderComponents;
```

Header-level components that need access to the header instance.
These are available on the header object passed to AppHeader/AppFooter's
children. Use `useHeaderContext()` inside these components.

#### Example

```ts
{ SortIndicator, ColumnFilter, ResizeHandle }
```

### headerContext?

```ts
optional headerContext: Context<Header<any, any, any>>;
```

A custom octane context for the header instance, used inside your
`headerComponents` (and footer components).

#### See

CreateTableHookOptions.tableContext

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

### tableContext?

```ts
optional tableContext: Context<OctaneTable<any, any>>;
```

A custom octane context for the table instance (read with `useContext`
inside your `tableComponents`). Optional: defaults to a shared
module-scoped context. Only pass your own (created via `createContext`)
when you need to isolate this table's context from other tables, e.g. when
nesting one table inside another.

## Type Parameters

### TFeatures

`TFeatures` *extends* `TableFeatures`

### TTableComponents

`TTableComponents` *extends* `Record`\<`string`, [`TableComponentType`](TableComponentType.md)\>

### TCellComponents

`TCellComponents` *extends* `Record`\<`string`, [`TableComponentType`](TableComponentType.md)\>

### THeaderComponents

`THeaderComponents` *extends* `Record`\<`string`, [`TableComponentType`](TableComponentType.md)\>
