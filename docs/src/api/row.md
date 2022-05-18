---
name: row
id: row
---

These are **core** options and API properties for all rows. More options and API properties are available for other [table features](../guide/09-features.md).

## Row API

All row objects have the following properties:

#### `id`

```tsx
id: string
```

The resolved unique identifier for the row resolved via the `instanceOptions.getRowId` option. Defaults to the row's index (or relative index if it is a subRow)

#### `depth`

```tsx
id: number
```

The depth of the row (if nested or grouped) relative to the root row array.

TODO
