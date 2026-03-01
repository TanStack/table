---
id: AppCellContext
title: AppCellContext
---

# Type Alias: AppCellContext\<TFeatures, TData, TValue, TCellComponents\>

```ts
type AppCellContext<TFeatures, TData, TValue, TCellComponents> = object;
```

Defined in: [createTableHook.tsx:41](https://github.com/TanStack/table/blob/main/packages/react-table/src/createTableHook.tsx#L41)

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

Defined in: [createTableHook.tsx:47](https://github.com/TanStack/table/blob/main/packages/react-table/src/createTableHook.tsx#L47)

#### Type Declaration

##### FlexRender()

```ts
FlexRender: () => ReactNode;
```

###### Returns

`ReactNode`

***

### column

```ts
column: Column<TFeatures, TData, TValue>;
```

Defined in: [createTableHook.tsx:49](https://github.com/TanStack/table/blob/main/packages/react-table/src/createTableHook.tsx#L49)

***

### getValue

```ts
getValue: CellContext<TFeatures, TData, TValue>["getValue"];
```

Defined in: [createTableHook.tsx:50](https://github.com/TanStack/table/blob/main/packages/react-table/src/createTableHook.tsx#L50)

***

### renderValue

```ts
renderValue: CellContext<TFeatures, TData, TValue>["renderValue"];
```

Defined in: [createTableHook.tsx:51](https://github.com/TanStack/table/blob/main/packages/react-table/src/createTableHook.tsx#L51)

***

### row

```ts
row: Row<TFeatures, TData>;
```

Defined in: [createTableHook.tsx:52](https://github.com/TanStack/table/blob/main/packages/react-table/src/createTableHook.tsx#L52)

***

### table

```ts
table: Table<TFeatures, TData>;
```

Defined in: [createTableHook.tsx:53](https://github.com/TanStack/table/blob/main/packages/react-table/src/createTableHook.tsx#L53)
