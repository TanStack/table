---
id: AppCellContext
title: AppCellContext
---

# Type Alias: AppCellContext\<TFeatures, TData, TValue, TCellComponents\>

```ts
type AppCellContext<TFeatures, TData, TValue, TCellComponents> = object;
```

Defined in: [react-table/src/createTableHook.tsx:48](https://github.com/TanStack/table/blob/main/packages/react-table/src/createTableHook.tsx#L48)

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

Defined in: [react-table/src/createTableHook.tsx:54](https://github.com/TanStack/table/blob/main/packages/react-table/src/createTableHook.tsx#L54)

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

Defined in: [react-table/src/createTableHook.tsx:56](https://github.com/TanStack/table/blob/main/packages/react-table/src/createTableHook.tsx#L56)

***

### getValue

```ts
getValue: CellContext<TFeatures, TData, TValue>["getValue"];
```

Defined in: [react-table/src/createTableHook.tsx:57](https://github.com/TanStack/table/blob/main/packages/react-table/src/createTableHook.tsx#L57)

***

### renderValue

```ts
renderValue: CellContext<TFeatures, TData, TValue>["renderValue"];
```

Defined in: [react-table/src/createTableHook.tsx:58](https://github.com/TanStack/table/blob/main/packages/react-table/src/createTableHook.tsx#L58)

***

### row

```ts
row: Row<TFeatures, TData>;
```

Defined in: [react-table/src/createTableHook.tsx:59](https://github.com/TanStack/table/blob/main/packages/react-table/src/createTableHook.tsx#L59)

***

### table

```ts
table: Table<TFeatures, TData>;
```

Defined in: [react-table/src/createTableHook.tsx:60](https://github.com/TanStack/table/blob/main/packages/react-table/src/createTableHook.tsx#L60)
