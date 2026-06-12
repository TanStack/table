---
id: TableController
title: TableController
---

# Class: TableController\<TFeatures, TData\>

Defined in: [TableController.ts:138](https://github.com/TanStack/table/blob/main/packages/lit-table/src/TableController.ts#L138)

A Lit ReactiveController for TanStack Table integration.

Uses `constructReactivityFeature` from table-core to properly integrate
with the TanStack Store reactivity system, matching the pattern used by
all other framework adapters (React, Vue, Solid, Svelte, Angular).

## Example

```ts
@customElement('my-table')
class MyTable extends LitElement {
  private tableController = new TableController<typeof features, Person>(this)

  protected render() {
    const table = this.tableController.table(
      {
        features,
        columns,
        data,
      },
      (state) => ({ sorting: state.sorting }),
    )
    // use table in your template...
  }
}
```

## Type Parameters

### TFeatures

`TFeatures` *extends* `TableFeatures`

### TData

`TData` *extends* `RowData`

## Implements

- `ReactiveController`

## Constructors

### Constructor

```ts
new TableController<TFeatures, TData>(host): TableController<TFeatures, TData>;
```

Defined in: [TableController.ts:149](https://github.com/TanStack/table/blob/main/packages/lit-table/src/TableController.ts#L149)

#### Parameters

##### host

`ReactiveControllerHost`

#### Returns

`TableController`\<`TFeatures`, `TData`\>

## Properties

### host

```ts
host: ReactiveControllerHost;
```

Defined in: [TableController.ts:142](https://github.com/TanStack/table/blob/main/packages/lit-table/src/TableController.ts#L142)

## Methods

### hostConnected()

```ts
hostConnected(): void;
```

Defined in: [TableController.ts:250](https://github.com/TanStack/table/blob/main/packages/lit-table/src/TableController.ts#L250)

Called when the host is connected to the component tree. For custom
element hosts, this corresponds to the `connectedCallback()` lifecycle,
which is only called when the component is connected to the document.

#### Returns

`void`

#### Implementation of

```ts
ReactiveController.hostConnected
```

***

### hostDisconnected()

```ts
hostDisconnected(): void;
```

Defined in: [TableController.ts:254](https://github.com/TanStack/table/blob/main/packages/lit-table/src/TableController.ts#L254)

Called when the host is disconnected from the component tree. For custom
element hosts, this corresponds to the `disconnectedCallback()` lifecycle,
which is called the host or an ancestor component is disconnected from the
document.

#### Returns

`void`

#### Implementation of

```ts
ReactiveController.hostDisconnected
```

***

### table()

```ts
table<TSelected>(tableOptions, selector?): LitTable<TFeatures, TData, TSelected>;
```

Defined in: [TableController.ts:169](https://github.com/TanStack/table/blob/main/packages/lit-table/src/TableController.ts#L169)

Returns the Lit-backed table instance for the current render pass.

The first call constructs the table with Lit reactivity bindings and
subscribes the host to table state/options changes. Later calls merge new
options into the same table instance and expose selected state through
`table.state`.

#### Type Parameters

##### TSelected

`TSelected` = `TableState`\<`TFeatures`\>

#### Parameters

##### tableOptions

`TableOptions`\<`TFeatures`, `TData`\>

##### selector?

(`state`) => `TSelected`

#### Returns

[`LitTable`](../type-aliases/LitTable.md)\<`TFeatures`, `TData`, `TSelected`\>

#### Example

```ts
const table = this.tableController.table(
  { features, columns, data },
  (state) => ({ sorting: state.sorting }),
)
```
