---
id: Atoms
title: Atoms
---

# Type Alias: Atoms\<TFeatures\>

```ts
type Atoms<TFeatures> = { [K in keyof TableState<TFeatures>]-?: ReadonlyAtom<TableState<TFeatures>[K]> };
```

Defined in: [core/table/coreTablesFeature.types.ts:31](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/table/coreTablesFeature.types.ts#L31)

A map of readonly derived atoms, one per `TableState` slice. Each derives
from its corresponding `baseAtom` plus, optionally, a per-slice external
atom or external state value.

Precedence: `options.atoms[key]` > `options.state[key]` > `baseAtoms[key]`.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../interfaces/TableFeatures.md)
