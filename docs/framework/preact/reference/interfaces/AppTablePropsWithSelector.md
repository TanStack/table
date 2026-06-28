---
id: AppTablePropsWithSelector
title: AppTablePropsWithSelector
---

# Interface: AppTablePropsWithSelector\<TFeatures, TSelected\>

Defined in: [createTableHook.tsx:385](https://github.com/TanStack/table/blob/main/packages/preact-table/src/createTableHook.tsx#L385)

Props for AppTable component - with selector

## Type Parameters

### TFeatures

`TFeatures` *extends* `TableFeatures`

### TSelected

`TSelected`

## Properties

### children()

```ts
children: (state) => ComponentChildren;
```

Defined in: [createTableHook.tsx:389](https://github.com/TanStack/table/blob/main/packages/preact-table/src/createTableHook.tsx#L389)

#### Parameters

##### state

`TSelected`

#### Returns

`ComponentChildren`

***

### selector()

```ts
selector: (state) => TSelected;
```

Defined in: [createTableHook.tsx:390](https://github.com/TanStack/table/blob/main/packages/preact-table/src/createTableHook.tsx#L390)

#### Parameters

##### state

`TableState`\<`TFeatures`\>

#### Returns

`TSelected`
