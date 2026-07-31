---
id: TableOptionAtoms
title: TableOptionAtoms
---

# Type Alias: TableOptionAtoms\<TFeatures, TData\>

```ts
type TableOptionAtoms<TFeatures, TData> = object & { readonly [K in keyof TableOptions<TFeatures, TData> as K extends "snapshotVersion" ? never : K]: K extends ConstructStaticOptionKey ? ReadonlyAtom<TableOptions<TFeatures, TData>[K]> : Atom<TableOptions<TFeatures, TData>[K]> };
```

Defined in: [core/table/coreTablesFeature.types.ts:77](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/table/coreTablesFeature.types.ts#L77)

One atom per currently resolved table option.

The atom properties themselves are readonly so their identities stay
stable. Ordinary option atoms are writable; construction-static options
remain readonly.

## Type Declaration

### snapshotVersion

```ts
readonly snapshotVersion: ReadonlyAtom<number>;
```

Increments once after each atomic update of the resolved options.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](RowData.md)
