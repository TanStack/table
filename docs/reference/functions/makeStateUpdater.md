---
id: makeStateUpdater
title: makeStateUpdater
---

# Function: makeStateUpdater()

```ts
function makeStateUpdater<TFeatures, K>(key, instance): (updater) => void;
```

Defined in: [utils.ts:38](https://github.com/TanStack/table/blob/main/packages/table-core/src/utils.ts#L38)

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../interfaces/TableFeatures.md)

### K

`K` *extends* `string` \| `number` \| `symbol` \| `string` & `object`

## Parameters

### key

`K`

### instance

[`Table`](../type-aliases/Table.md)\<`TFeatures`, `any`\>

## Returns

```ts
(updater): void;
```

### Parameters

#### updater

`any`

### Returns

`void`
