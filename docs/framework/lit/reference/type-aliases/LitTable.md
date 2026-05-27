---
id: LitTable
title: LitTable
---

# Type Alias: LitTable\<TFeatures, TData, TSelected\>

```ts
type LitTable<TFeatures, TData, TSelected> = Omit<Table<TFeatures, TData>, "store"> & object;
```

Defined in: [TableController.ts:30](https://github.com/TanStack/table/blob/main/packages/lit-table/src/TableController.ts#L30)

The extended table type returned by the Lit adapter.
Includes a `Subscribe` method for fine-grained state subscriptions
and a `state` property with the selected state.

## Type Declaration

### FlexRender

```ts
FlexRender: typeof FlexRender;
```

Convenience FlexRender function attached to the table instance.
Renders cell, header, or footer content from column definitions.

#### Example

```ts
${table.FlexRender({ header })}
${table.FlexRender({ cell })}
${table.FlexRender({ footer: header })}
```

### state

```ts
readonly state: Readonly<TSelected>;
```

The selected state of the table. This state may not match the structure of
the full table state because it is selected by the selector function that
you pass as the 2nd argument to `controller.table()`.

#### Example

```ts
const table = this.tableController.table(options, (state) => ({
  globalFilter: state.globalFilter,
}))

console.log(table.state.globalFilter)
```

### ~~store~~

```ts
readonly store: Table<TFeatures, TData>["store"];
```

#### Deprecated

Prefer `table.state` for render reads,
`table.atoms.<slice>.get()` for slice snapshots, or `table.Subscribe` for
explicit subscriptions. `table.store.state` is a current-value snapshot and
is easy to misuse in render code.

### Subscribe()

```ts
Subscribe: {
<TSourceValue>  (props): string | TemplateResult;
<TSourceValue, TSubscribeSelected>  (props): string | TemplateResult;
<TSubscribeSelected>  (props): string | TemplateResult;
};
```

Subscribe to a selected slice of table state, or to a single source (atom or store).

**Lit note:** `TableController` still wires host updates via the full `table.store`
subscription — source mode matches the React API and reads `source.get()` at render
time. True source-only invalidation can be added later via `source.subscribe`.

#### Call Signature

```ts
<TSourceValue>(props): string | TemplateResult;
```

##### Type Parameters

###### TSourceValue

`TSourceValue`

##### Parameters

###### props

###### children

(`state`) => `TemplateResult` \| `string` \| `TemplateResult` \| `string`

###### selector?

`undefined`

###### source

[`SubscribeSource`](SubscribeSource.md)\<`TSourceValue`\>

##### Returns

`string` \| `TemplateResult`

#### Call Signature

```ts
<TSourceValue, TSubscribeSelected>(props): string | TemplateResult;
```

##### Type Parameters

###### TSourceValue

`TSourceValue`

###### TSubscribeSelected

`TSubscribeSelected`

##### Parameters

###### props

###### children

(`state`) => `TemplateResult` \| `string` \| `TemplateResult` \| `string`

###### selector

(`state`) => `TSubscribeSelected`

###### source

[`SubscribeSource`](SubscribeSource.md)\<`TSourceValue`\>

##### Returns

`string` \| `TemplateResult`

#### Call Signature

```ts
<TSubscribeSelected>(props): string | TemplateResult;
```

##### Type Parameters

###### TSubscribeSelected

`TSubscribeSelected`

##### Parameters

###### props

###### children

(`state`) => `TemplateResult` \| `string` \| `TemplateResult` \| `string`

###### selector

(`state`) => `TSubscribeSelected`

##### Returns

`string` \| `TemplateResult`

#### Example

```ts
table.Subscribe({
  selector: (state) => ({ rowSelection: state.rowSelection }),
  children: (state) => html`<div>${JSON.stringify(state)}</div>`,
})
```

## Type Parameters

### TFeatures

`TFeatures` *extends* `TableFeatures`

### TData

`TData` *extends* `RowData`

### TSelected

`TSelected` = `TableState`\<`TFeatures`\>
