// Authored in .tsrx because it is a COMPONENT that calls a slot-keyed hook
// (`useSelector`); the compiler assigns its call-site slot. The types live in
// `./types` so the `.tsrx.d.ts` sidecar only restates the signature.
import { shallow, useSelector } from '@tanstack/octane-store';
import type { SubscribeComponent, SubscribeProps } from './types';

// A `@{ … }` body cannot carry preceding overload signatures (TS2384), so the
// implementation takes the union and the exported binding is re-typed with the
// overloaded callable `SubscribeComponent`. Call sites still get per-overload
// inference; only this one function body sees the union.
function SubscribeImpl(props: SubscribeProps<any, any, any>) @{
	// Atom and store share the same selection protocol; the union needs a widen
	// for TS. `shallow` matches upstream so object-literal selectors don't
	// re-render on every notification.
	const selected = useSelector(
		props.source as Parameters<typeof useSelector>[0],
		props.selector as Parameters<typeof useSelector>[1],
		{ compare: shallow },
	);

	<>
		{typeof props.children === 'function'
			? (props.children as (state: unknown) => unknown)(selected)
			: props.children}
	</>
}

/**
 * An octane component that subscribes to table state.
 *
 * This is useful for opting into state re-renders for specific parts of the
 * table state.
 *
 * For `table.Subscribe` from `useTable`, prefer that API — it is pre-bound to
 * `table.store`, so you can omit `source`.
 *
 * @example
 * ```tsx
 * // Full store
 * <Subscribe source={table.store} selector={(state) => state.rowSelection}>
 *   {(rowSelection) => <div>{Object.keys(rowSelection).length as unknown as string}</div>}
 * </Subscribe>
 * ```
 *
 * @example
 * ```tsx
 * // Entire source (atom or store) — no selector
 * <Subscribe source={table.atoms.rowSelection}>
 *   {(rowSelection) => <div>…</div>}
 * </Subscribe>
 * ```
 *
 * @example
 * ```tsx
 * // Project source value (e.g. one row's selection)
 * <Subscribe source={table.atoms.rowSelection} selector={(s) => s?.[row.id]}>
 *   {(selected) => <tr data-selected={!!selected}>…</tr>}
 * </Subscribe>
 * ```
 */
export const Subscribe = SubscribeImpl as SubscribeComponent;
