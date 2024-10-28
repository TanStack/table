---
id: Column_ColumnVisibility
title: Column_ColumnVisibility
---

# Interface: Column\_ColumnVisibility

## Properties

### getCanHide()

```ts
getCanHide: () => boolean;
```

Returns whether the column can be hidden

#### Returns

`boolean`

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/column-visibility#getcanhide)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/column-visibility)

#### Defined in

[features/column-visibility/ColumnVisibility.types.ts:114](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-visibility/ColumnVisibility.types.ts#L114)

***

### getIsVisible()

```ts
getIsVisible: () => boolean;
```

Returns whether the column is visible

#### Returns

`boolean`

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/column-visibility#getisvisible)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/column-visibility)

#### Defined in

[features/column-visibility/ColumnVisibility.types.ts:120](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-visibility/ColumnVisibility.types.ts#L120)

***

### getToggleVisibilityHandler()

```ts
getToggleVisibilityHandler: () => (event) => void;
```

Returns a function that can be used to toggle the column visibility. This function can be used to bind to an event handler to a checkbox.

#### Returns

`Function`

##### Parameters

• **event**: `unknown`

##### Returns

`void`

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/column-visibility#gettogglevisibilityhandler)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/column-visibility)

#### Defined in

[features/column-visibility/ColumnVisibility.types.ts:126](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-visibility/ColumnVisibility.types.ts#L126)

***

### toggleVisibility()

```ts
toggleVisibility: (value?) => void;
```

Toggles the visibility of the column.

#### Parameters

• **value?**: `boolean`

#### Returns

`void`

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/column-visibility#togglevisibility)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/column-visibility)

#### Defined in

[features/column-visibility/ColumnVisibility.types.ts:132](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-visibility/ColumnVisibility.types.ts#L132)
