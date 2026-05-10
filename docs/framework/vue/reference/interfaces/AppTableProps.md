---
id: AppTableProps
title: AppTableProps
---

# Interface: AppTableProps\<TFeatures, TSelected\>

Defined in: [packages/vue-table/src/createTableHook.ts:195](https://github.com/TanStack/table/blob/main/packages/vue-table/src/createTableHook.ts#L195)

## Type Parameters

### TFeatures

`TFeatures` *extends* `TableFeatures`

### TSelected

`TSelected` = `unknown`

## Properties

### selector()?

```ts
optional selector: (state) => TSelected;
```

Defined in: [packages/vue-table/src/createTableHook.ts:199](https://github.com/TanStack/table/blob/main/packages/vue-table/src/createTableHook.ts#L199)

#### Parameters

##### state

`TableState`\<`TFeatures`\>

#### Returns

`TSelected`
