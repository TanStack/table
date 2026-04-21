---
id: AngularTableComputed
title: AngularTableComputed
---

# Interface: AngularTableComputed()\<TFeatures\>

Defined in: [injectTable.ts:30](https://github.com/TanStack/table/blob/main/packages/angular-table/src/injectTable.ts#L30)

Store mode: pass `selector` (required) to project from full table state.
Atom mode: pass `atom` and optionally `selector`; omit `selector` to track the whole atom.

## Type Parameters

### TFeatures

`TFeatures` *extends* `TableFeatures`

## Call Signature

```ts
AngularTableComputed<TSubSelected, TAtomValue>(props): Signal<Readonly<TSubSelected>>;
```

Defined in: [injectTable.ts:31](https://github.com/TanStack/table/blob/main/packages/angular-table/src/injectTable.ts#L31)

Store mode: pass `selector` (required) to project from full table state.
Atom mode: pass `atom` and optionally `selector`; omit `selector` to track the whole atom.

### Type Parameters

#### TSubSelected

`TSubSelected`

#### TAtomValue

`TAtomValue`

### Parameters

#### props

##### atom

`Atom`\<`TAtomValue`\> \| `ReadonlyAtom`\<`TAtomValue`\>

##### equal?

`ValueEqualityFn`\<`TSubSelected`\>

##### selector?

(`state`) => `TSubSelected`

### Returns

`Signal`\<`Readonly`\<`TSubSelected`\>\>

## Call Signature

```ts
AngularTableComputed<TSubSelected>(props): Signal<Readonly<TSubSelected>>;
```

Defined in: [injectTable.ts:36](https://github.com/TanStack/table/blob/main/packages/angular-table/src/injectTable.ts#L36)

Store mode: pass `selector` (required) to project from full table state.
Atom mode: pass `atom` and optionally `selector`; omit `selector` to track the whole atom.

### Type Parameters

#### TSubSelected

`TSubSelected`

### Parameters

#### props

##### equal?

`ValueEqualityFn`\<`TSubSelected`\>

##### selector

(`state`) => `TSubSelected`

### Returns

`Signal`\<`Readonly`\<`TSubSelected`\>\>
