---
id: TableHookContexts
title: TableHookContexts
---

# Interface: TableHookContexts\<TFeatures, TData\>

Defined in: [createTableHookContexts.tsx:17](https://github.com/TanStack/table/blob/main/packages/react-table/src/createTableHookContexts.tsx#L17)

The object returned by [createTableHookContexts](../functions/createTableHookContexts.md): three scoped React
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

Defined in: [createTableHookContexts.tsx:22](https://github.com/TanStack/table/blob/main/packages/react-table/src/createTableHookContexts.tsx#L22)

***

### headerContext

```ts
headerContext: Context<Header<any, any, any>>;
```

Defined in: [createTableHookContexts.tsx:23](https://github.com/TanStack/table/blob/main/packages/react-table/src/createTableHookContexts.tsx#L23)

***

### tableContext

```ts
tableContext: Context<ReactTable<any, any>>;
```

Defined in: [createTableHookContexts.tsx:21](https://github.com/TanStack/table/blob/main/packages/react-table/src/createTableHookContexts.tsx#L21)

***

### useCellContext()

```ts
useCellContext: <TValue>() => Cell<TFeatures, any, TValue>;
```

Defined in: [createTableHookContexts.tsx:28](https://github.com/TanStack/table/blob/main/packages/react-table/src/createTableHookContexts.tsx#L28)

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

Defined in: [createTableHookContexts.tsx:33](https://github.com/TanStack/table/blob/main/packages/react-table/src/createTableHookContexts.tsx#L33)

#### Type Parameters

##### TValue

`TValue` *extends* `unknown` = `unknown`

#### Returns

`Header`\<`TFeatures`, `any`, `TValue`\>

***

### useTableContext()

```ts
useTableContext: <TTableData>() => ReactTable<TFeatures, TTableData>;
```

Defined in: [createTableHookContexts.tsx:24](https://github.com/TanStack/table/blob/main/packages/react-table/src/createTableHookContexts.tsx#L24)

#### Type Parameters

##### TTableData

`TTableData` *extends* `RowData` = `TData`

#### Returns

[`ReactTable`](../type-aliases/ReactTable.md)\<`TFeatures`, `TTableData`\>
