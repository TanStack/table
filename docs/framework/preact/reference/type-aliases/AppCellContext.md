---
id: AppCellContext
title: AppCellContext
---

# Type Alias: AppCellContext\<TFeatures, TData, TValue, TCellComponents\>

```ts
type AppCellContext<TFeatures, TData, TValue, TCellComponents> = object;
```

Defined in: [createTableHook.tsx:45](https://github.com/TanStack/table/blob/main/packages/preact-table/src/createTableHook.tsx#L45)

Enhanced CellContext with pre-bound cell components.
The `cell` property includes the registered cellComponents.

## Type Parameters

### TFeatures

`TFeatures` *extends* `TableFeatures`

### TData

`TData` *extends* `RowData`

### TValue

`TValue` *extends* `CellData`

### TCellComponents

`TCellComponents` *extends* `Record`\<`string`, `ComponentType`\<`any`\>\>

## Properties

### cell

```ts
cell: Cell<TFeatures, TData, TValue> & TCellComponents & object;
```

Defined in: [createTableHook.tsx:51](https://github.com/TanStack/table/blob/main/packages/preact-table/src/createTableHook.tsx#L51)

#### Type Declaration

##### FlexRender()

```ts
FlexRender: () => ComponentChildren;
```

###### Returns

`ComponentChildren`

***

### column

```ts
column: Column<TFeatures, TData, TValue>;
```

Defined in: [createTableHook.tsx:53](https://github.com/TanStack/table/blob/main/packages/preact-table/src/createTableHook.tsx#L53)

***

### getValue

```ts
getValue: CellContext<TFeatures, TData, TValue>["getValue"];
```

Defined in: [createTableHook.tsx:54](https://github.com/TanStack/table/blob/main/packages/preact-table/src/createTableHook.tsx#L54)

***

### renderValue

```ts
renderValue: CellContext<TFeatures, TData, TValue>["renderValue"];
```

Defined in: [createTableHook.tsx:55](https://github.com/TanStack/table/blob/main/packages/preact-table/src/createTableHook.tsx#L55)

***

### row

```ts
row: Row<TFeatures, TData>;
```

Defined in: [createTableHook.tsx:56](https://github.com/TanStack/table/blob/main/packages/preact-table/src/createTableHook.tsx#L56)

***

### table

```ts
table: Table<TFeatures, TData>;
```

Defined in: [createTableHook.tsx:57](https://github.com/TanStack/table/blob/main/packages/preact-table/src/createTableHook.tsx#L57)
