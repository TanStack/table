---
id: AppHeaderContext
title: AppHeaderContext
---

# Type Alias: AppHeaderContext\<TFeatures, TData, TValue, THeaderComponents\>

```ts
type AppHeaderContext<TFeatures, TData, TValue, THeaderComponents> = object;
```

Defined in: [createTableHook.tsx:60](https://github.com/TanStack/table/blob/main/packages/react-table/src/createTableHook.tsx#L60)

Enhanced HeaderContext with pre-bound header components.
The `header` property includes the registered headerComponents.

## Type Parameters

### TFeatures

`TFeatures` *extends* `TableFeatures`

### TData

`TData` *extends* `RowData`

### TValue

`TValue` *extends* `CellData`

### THeaderComponents

`THeaderComponents` *extends* `Record`\<`string`, `ComponentType`\<`any`\>\>

## Properties

### column

```ts
column: Column<TFeatures, TData, TValue>;
```

Defined in: [createTableHook.tsx:66](https://github.com/TanStack/table/blob/main/packages/react-table/src/createTableHook.tsx#L66)

***

### header

```ts
header: Header<TFeatures, TData, TValue> & THeaderComponents & object;
```

Defined in: [createTableHook.tsx:67](https://github.com/TanStack/table/blob/main/packages/react-table/src/createTableHook.tsx#L67)

#### Type Declaration

##### FlexRender()

```ts
FlexRender: () => ReactNode;
```

###### Returns

`ReactNode`

***

### table

```ts
table: Table<TFeatures, TData>;
```

Defined in: [createTableHook.tsx:69](https://github.com/TanStack/table/blob/main/packages/react-table/src/createTableHook.tsx#L69)
