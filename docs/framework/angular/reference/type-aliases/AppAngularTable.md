---
id: AppAngularTable
title: AppAngularTable
---

# Type Alias: AppAngularTable\<TFeatures, TData, TSelected, TTableComponents, TCellComponents, THeaderComponents\>

```ts
type AppAngularTable<TFeatures, TData, TSelected, TTableComponents, TCellComponents, THeaderComponents> = AngularTable<TFeatures, TData, TSelected> & NoInfer<TTableComponents> & object;
```

Defined in: [helpers/createTableHook.ts:243](https://github.com/TanStack/table/blob/main/packages/angular-table/src/helpers/createTableHook.ts#L243)

Extended table API returned by useAppTable with all App wrapper components

## Type Declaration

### appCell()

```ts
appCell: <TValue>(cell) => Cell<TFeatures, TData, TValue> & NoInfer<TCellComponents>;
```

#### Type Parameters

##### TValue

`TValue`

#### Parameters

##### cell

`Cell`\<`TFeatures`, `TData`, `TValue`\>

#### Returns

`Cell`\<`TFeatures`, `TData`, `TValue`\> & `NoInfer`\<`TCellComponents`\>

### appFooter()

```ts
appFooter: <TValue>(footer) => Header<TFeatures, TData, TValue> & NoInfer<THeaderComponents>;
```

#### Type Parameters

##### TValue

`TValue`

#### Parameters

##### footer

`Header`\<`TFeatures`, `TData`, `TValue`\>

#### Returns

`Header`\<`TFeatures`, `TData`, `TValue`\> & `NoInfer`\<`THeaderComponents`\>

### appHeader()

```ts
appHeader: <TValue>(header) => Header<TFeatures, TData, TValue> & NoInfer<THeaderComponents>;
```

#### Type Parameters

##### TValue

`TValue`

#### Parameters

##### header

`Header`\<`TFeatures`, `TData`, `TValue`\>

#### Returns

`Header`\<`TFeatures`, `TData`, `TValue`\> & `NoInfer`\<`THeaderComponents`\>

## Type Parameters

### TFeatures

`TFeatures` *extends* `TableFeatures`

### TData

`TData` *extends* `RowData`

### TSelected

`TSelected`

### TTableComponents

`TTableComponents` *extends* `Record`\<`string`, [`RenderableComponent`](RenderableComponent.md)\>

### TCellComponents

`TCellComponents` *extends* `Record`\<`string`, [`RenderableComponent`](RenderableComponent.md)\>

### THeaderComponents

`THeaderComponents` *extends* `Record`\<`string`, [`RenderableComponent`](RenderableComponent.md)\>
