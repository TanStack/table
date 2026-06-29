---
id: TableHookContexts
title: TableHookContexts
---

# Interface: TableHookContexts\<TFeatures, TData\>

Defined in: [createTableHookContexts.tsx:18](https://github.com/TanStack/table/blob/main/packages/preact-table/src/createTableHookContexts.tsx#L18)

The object returned by [createTableHookContexts](../functions/createTableHookContexts.md): three scoped Preact
contexts plus matching context hooks.

## Type Parameters

### TFeatures

`TFeatures` *extends* `TableFeatures`

### TData

`TData` *extends* `RowData`

## Properties

### cellContext

```ts
cellContext: Context<Cell<any, any, any>>;
```

Defined in: [createTableHookContexts.tsx:23](https://github.com/TanStack/table/blob/main/packages/preact-table/src/createTableHookContexts.tsx#L23)

***

### headerContext

```ts
headerContext: Context<Header<any, any, any>>;
```

Defined in: [createTableHookContexts.tsx:24](https://github.com/TanStack/table/blob/main/packages/preact-table/src/createTableHookContexts.tsx#L24)

***

### tableContext

```ts
tableContext: Context<PreactTable<any, any>>;
```

Defined in: [createTableHookContexts.tsx:22](https://github.com/TanStack/table/blob/main/packages/preact-table/src/createTableHookContexts.tsx#L22)

***

### useCellContext()

```ts
useCellContext: <TValue>() => Cell<TFeatures, any, TValue>;
```

Defined in: [createTableHookContexts.tsx:29](https://github.com/TanStack/table/blob/main/packages/preact-table/src/createTableHookContexts.tsx#L29)

#### Type Parameters

##### TValue

`TValue` *extends* `unknown` = `unknown`

#### Returns

`Cell`\<`TFeatures`, `any`, `TValue`\>

***

### useHeaderContext()

```ts
useHeaderContext: <TValue>() => Header<TFeatures, any, TValue>;
```

Defined in: [createTableHookContexts.tsx:34](https://github.com/TanStack/table/blob/main/packages/preact-table/src/createTableHookContexts.tsx#L34)

#### Type Parameters

##### TValue

`TValue` *extends* `unknown` = `unknown`

#### Returns

`Header`\<`TFeatures`, `any`, `TValue`\>

***

### useTableContext()

```ts
useTableContext: <TTableData>() => PreactTable<TFeatures, TTableData>;
```

Defined in: [createTableHookContexts.tsx:25](https://github.com/TanStack/table/blob/main/packages/preact-table/src/createTableHookContexts.tsx#L25)

#### Type Parameters

##### TTableData

`TTableData` *extends* `RowData` = `TData`

#### Returns

[`PreactTable`](../type-aliases/PreactTable.md)\<`TFeatures`, `TTableData`\>
