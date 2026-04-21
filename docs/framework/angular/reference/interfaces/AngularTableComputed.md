---
id: AngularTableComputed
title: AngularTableComputed
---

# Interface: AngularTableComputed()\<TFeatures\>

Defined in: [injectTable.ts:31](https://github.com/TanStack/table/blob/main/packages/angular-table/src/injectTable.ts#L31)

Store mode: pass `selector` (required) to project from full table state.
Atom mode: pass `atom`; omit `selector` for the whole atom (identity), or pass
`selector` to project. Split overloads match React `Subscribe` inference.

## Type Parameters

### TFeatures

`TFeatures` *extends* `TableFeatures`

## Call Signature

```ts
AngularTableComputed<TAtomValue>(props): Signal<Readonly<TAtomValue>>;
```

Defined in: [injectTable.ts:32](https://github.com/TanStack/table/blob/main/packages/angular-table/src/injectTable.ts#L32)

Store mode: pass `selector` (required) to project from full table state.
Atom mode: pass `atom`; omit `selector` for the whole atom (identity), or pass
`selector` to project. Split overloads match React `Subscribe` inference.

### Type Parameters

#### TAtomValue

`TAtomValue`

### Parameters

#### props

##### atom

`Atom`\<`TAtomValue`\> \| `ReadonlyAtom`\<`TAtomValue`\>

##### equal?

`ValueEqualityFn`\<`TAtomValue`\>

##### selector?

`undefined`

### Returns

`Signal`\<`Readonly`\<`TAtomValue`\>\>

## Call Signature

```ts
AngularTableComputed<TAtomValue, TSubSelected>(props): Signal<Readonly<TSubSelected>>;
```

Defined in: [injectTable.ts:37](https://github.com/TanStack/table/blob/main/packages/angular-table/src/injectTable.ts#L37)

Store mode: pass `selector` (required) to project from full table state.
Atom mode: pass `atom`; omit `selector` for the whole atom (identity), or pass
`selector` to project. Split overloads match React `Subscribe` inference.

### Type Parameters

#### TAtomValue

`TAtomValue`

#### TSubSelected

`TSubSelected`

### Parameters

#### props

##### atom

`Atom`\<`TAtomValue`\> \| `ReadonlyAtom`\<`TAtomValue`\>

##### equal?

`ValueEqualityFn`\<`TSubSelected`\>

##### selector

(`state`) => `TSubSelected`

### Returns

`Signal`\<`Readonly`\<`TSubSelected`\>\>

## Call Signature

```ts
AngularTableComputed<TSubSelected>(props): Signal<Readonly<TSubSelected>>;
```

Defined in: [injectTable.ts:42](https://github.com/TanStack/table/blob/main/packages/angular-table/src/injectTable.ts#L42)

Store mode: pass `selector` (required) to project from full table state.
Atom mode: pass `atom`; omit `selector` for the whole atom (identity), or pass
`selector` to project. Split overloads match React `Subscribe` inference.

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
