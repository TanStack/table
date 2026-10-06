---
id: SolidTable
title: SolidTable
---

# Type Alias: SolidTable\<TFeatures, TData\>

```ts
type SolidTable<TFeatures, TData> = Table<TFeatures, TData> & object;
```

Defined in: [createTable.ts:19](https://github.com/TanStack/table/blob/main/packages/solid-table/src/createTable.ts#L19)

## Type Declaration

### FlexRender

```ts
FlexRender: typeof FlexRender;
```

Convenience FlexRender component attached to the table instance for
rendering headers, cells, or footers with custom markup. Mirrors the
`table.FlexRender` API exposed by `createTableHook`'s `createAppTable`.

#### Example

```ts
<table.FlexRender header={header} />
<table.FlexRender cell={cell} />
<table.FlexRender footer={footer} />
```

### ~~Subscribe~~

```ts
Subscribe: (props) => JSX.Element;
```

#### Parameters

##### props

###### children

(`atoms`) => `JSX.Element`

#### Returns

`JSX.Element`

#### Deprecated

Read table APIs or `table.atoms` directly inside JSX,
`createMemo`, or `createEffect`. Solid tracks those reads natively.
This compatibility wrapper only passes atoms to its child function;
it does not create a subscription or tracking scope.

## Type Parameters

### TFeatures

`TFeatures` *extends* `TableFeatures`

### TData

`TData` *extends* `RowData`
