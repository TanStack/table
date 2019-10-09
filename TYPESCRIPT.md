# Using TypeScript with React-Table

React-table is a very flexible library, because of this, the shape of data at almost every contact point is defined by the specific set of plugins that you choose to pass to `useTable`.

Tto get started, copy the file `react-table-config.d.ts` into your source tree (e.g. into a types folder). This expands the default types with all of the plugin extensions currently in the type definitions.

You can stop here if you like, but while this is simple, it's a bit misleading. Out of the box, these types will suggest that you have access to values that come from plugins that you aren't using, i.e. the error checking is weakened.

To bring the resulting types into better alignment with your plugins, you should edit your local copy of `react-table-config.d.ts` and comment out all of the interfaces that don't apply to your chosen set of plugins.

e.g.

if you are only using `useSortBy` and `usePagination` then you would take this:

```tsx
extends UseExpandedOptions<D>,
  UseFiltersOptions<D>,
  UseGroupByOptions<D>,
  UsePaginationOptions<D>,
  UseRowSelectOptions<D>,
  UseSortByOptions<D>,
  UseFiltersOptions<D>,
  UseResizeColumnsOptions<D>,
  Record<string, any> {}
```

and convert it to this:

```tsx
export interface TableOptions<D extends object>
  extends UsePaginationOptions<D>,
    UseSortByOptions<D> {}
```

Then follow the same pattern for all of the other interfaces in the file. You'll notice that many plugins don't extends all of the top level interfaces.

## Caveat

The interfaces are all global. If you have several different configurations for the table, you should create interfaces using the union of all of the plugins that you are using.
