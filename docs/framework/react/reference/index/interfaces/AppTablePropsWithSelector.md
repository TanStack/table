---
id: AppTablePropsWithSelector
title: AppTablePropsWithSelector
---

# Interface: AppTablePropsWithSelector\<TFeatures, TSelected\>

Defined in: [react-table/src/createTableHook.tsx:387](https://github.com/TanStack/table/blob/main/packages/react-table/src/createTableHook.tsx#L387)

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

Defined in: [react-table/src/createTableHook.tsx:391](https://github.com/TanStack/table/blob/main/packages/react-table/src/createTableHook.tsx#L391)

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

Defined in: [react-table/src/createTableHook.tsx:392](https://github.com/TanStack/table/blob/main/packages/react-table/src/createTableHook.tsx#L392)

#### Parameters

##### state

`TableState`\<`TFeatures`\>

#### Returns

`TSelected`
