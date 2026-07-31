// Hook-slot mechanics shared by the binding's exported hooks (the same helper
// as @tanstack/octane-store and the other Octane adapters).
//
// The octane compiler appends a per-call-site `Symbol` slot as the LAST
// argument of every `use*` call. A hook whose own signature ends in an OPTIONAL
// parameter must therefore split that slot off before reading its arguments, or
// the slot lands in the optional parameter — e.g. `useTable(options)` compiles
// to `useTable(options, slot)`, and the slot would be read as the `selector`.
//
// The compiled hook body still gets its internal slots from the compiler's
// ambient `withSlot` scope, so the split only has to DISCARD the trailing
// symbol; it never needs to be threaded onward.

/**
 * Splits the compiler-injected trailing slot off a hook's runtime args,
 * returning the user args (everything before it) and the slot.
 */
export function splitSlot(args: Array<any>): [Array<any>, symbol | undefined] {
  const tail = args[args.length - 1]
  const slot = typeof tail === 'symbol' ? tail : undefined
  return [slot !== undefined ? args.slice(0, -1) : args, slot]
}
