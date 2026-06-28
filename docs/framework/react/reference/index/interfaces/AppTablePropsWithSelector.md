---
id: AppTablePropsWithSelector
title: AppTablePropsWithSelector
---

# Interface: AppTablePropsWithSelector\<TFeatures, TSelected\>

Defined in: [createTableHook.tsx:388](https://github.com/TanStack/table/blob/main/packages/react-table/src/createTableHook.tsx#L388)

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

Defined in: [createTableHook.tsx:392](https://github.com/TanStack/table/blob/main/packages/react-table/src/createTableHook.tsx#L392)

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

Defined in: [createTableHook.tsx:393](https://github.com/TanStack/table/blob/main/packages/react-table/src/createTableHook.tsx#L393)

#### Parameters

##### state

`TableState`\<`TFeatures`\>

#### Returns

`TSelected`
