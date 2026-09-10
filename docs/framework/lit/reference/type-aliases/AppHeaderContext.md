---
id: AppHeaderContext
title: AppHeaderContext
---

# Type Alias: AppHeaderContext\<TFeatures, TData, TValue, THeaderComponents\>

```ts
type AppHeaderContext<TFeatures, TData, TValue, THeaderComponents> = object;
```

Defined in: [packages/lit-table/src/createTableHook.ts:70](https://github.com/TanStack/table/blob/main/packages/lit-table/src/createTableHook.ts#L70)

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

`THeaderComponents` *extends* `Record`\<`string`, [`ComponentType`](ComponentType.md)\<`any`\>\>

## Properties

### column

```ts
column: Column<TFeatures, TData, TValue>;
```

Defined in: [packages/lit-table/src/createTableHook.ts:76](https://github.com/TanStack/table/blob/main/packages/lit-table/src/createTableHook.ts#L76)

***

### header

```ts
header: Header<TFeatures, TData, TValue> & BoundComponents<THeaderComponents> & object;
```

Defined in: [packages/lit-table/src/createTableHook.ts:77](https://github.com/TanStack/table/blob/main/packages/lit-table/src/createTableHook.ts#L77)

#### Type Declaration

##### FlexRender()

```ts
FlexRender: () => LitRenderable;
```

###### Returns

[`LitRenderable`](LitRenderable.md)

***

### table

```ts
table: Table<TFeatures, TData>;
```

Defined in: [packages/lit-table/src/createTableHook.ts:81](https://github.com/TanStack/table/blob/main/packages/lit-table/src/createTableHook.ts#L81)
