---
id: AppTablePropsWithSelector
title: AppTablePropsWithSelector
---

# Interface: AppTablePropsWithSelector\<TFeatures, TSelected\>

Defined in: [createTableHook.tsx:285](https://github.com/TanStack/table/blob/main/packages/react-table/src/createTableHook.tsx#L285)

Props for AppTable component - with selector

## Type Parameters

### TFeatures

`TFeatures` *extends* `TableFeatures`

### TSelected

`TSelected`

## Properties

### children()

```ts
children: (state) => ReactNode;
```

Defined in: [createTableHook.tsx:289](https://github.com/TanStack/table/blob/main/packages/react-table/src/createTableHook.tsx#L289)

#### Parameters

##### state

`TSelected`

#### Returns

`ReactNode`

***

### selector()

```ts
selector: (state) => TSelected;
```

Defined in: [createTableHook.tsx:290](https://github.com/TanStack/table/blob/main/packages/react-table/src/createTableHook.tsx#L290)

#### Parameters

##### state

`TableState`\<`TFeatures`\>

#### Returns

`TSelected`
