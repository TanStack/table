---
id: makeStateUpdater
title: makeStateUpdater
---

```ts
function makeStateUpdater<TFeatures, K>(key, instance): (updater) => void;
```

Defined in: [utils.ts:97](https://github.com/TanStack/table/blob/main/packages/table-core/src/utils.ts#L97)

Creates a table state updater for a single state slice.

The updater writes through the table base atom for the slice and supports both value and functional updater forms.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../interfaces/TableFeatures.md)

### K

`K` *extends* `string` \| `number` \| `symbol` \| `string` & `object`

## Parameters

### key

`K`

### instance

#### baseAtoms

`object`

#### options

\{
  `atoms?`: `object`;
\}

#### options.atoms?

`object`

## Returns

(`updater`) => `void`
