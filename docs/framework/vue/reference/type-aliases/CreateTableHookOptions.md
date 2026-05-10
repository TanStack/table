---
id: CreateTableHookOptions
title: CreateTableHookOptions
---

# Type Alias: CreateTableHookOptions\<TFeatures, TTableComponents, TCellComponents, THeaderComponents\>

```ts
type CreateTableHookOptions<TFeatures, TTableComponents, TCellComponents, THeaderComponents> = Omit<TableOptionsWithReactiveData<TFeatures, any>, "columns" | "data" | "store" | "state" | "initialState"> & object;
```

Defined in: [packages/vue-table/src/createTableHook.ts:181](https://github.com/TanStack/table/blob/main/packages/vue-table/src/createTableHook.ts#L181)

## Type Declaration

### cellComponents?

```ts
optional cellComponents: TCellComponents;
```

### headerComponents?

```ts
optional headerComponents: THeaderComponents;
```

### tableComponents?

```ts
optional tableComponents: TTableComponents;
```

## Type Parameters

### TFeatures

`TFeatures` *extends* `TableFeatures`

### TTableComponents

`TTableComponents` *extends* `Record`\<`string`, [`ComponentType`](ComponentType.md)\<`any`\>\>

### TCellComponents

`TCellComponents` *extends* `Record`\<`string`, [`ComponentType`](ComponentType.md)\<`any`\>\>

### THeaderComponents

`THeaderComponents` *extends* `Record`\<`string`, [`ComponentType`](ComponentType.md)\<`any`\>\>
