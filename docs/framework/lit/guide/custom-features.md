---
title: Custom Features (Lit) Guide
---

## Custom Features (Lit) Guide

In this guide, we'll cover how to extend TanStack Table with custom features, and along the way, we'll learn more about how the TanStack Table v9 codebase is structured and how it works.

### TanStack Table Strives to be Lean

TanStack Table has a core set of features that are built into the library such as sorting, filtering, pagination, etc. We've received a lot of requests and sometimes even some well thought out PRs to add even more features to the library. While we are always open to improving the library, we also want to make sure that TanStack Table remains a lean library that does not include too much bloat and code that is unlikely to be used in most use cases. Not every PR can, or should, be accepted into the core library, even if it does solve a real problem. This can be frustrating to developers where TanStack Table solves 90% of their use case, but they need a little bit more control. 

TanStack Table has always been built in a way that allows it to be highly extensible (at least since v7). The `table` instance that is returned from whichever framework adapter that you are using (the Lit `TableController`'s `table()` method, React's `useTable`, etc.) is a plain JavaScript object that can have extra properties or APIs added to it. It has always been possible to use composition to add custom logic, state, and APIs to the table instance. Libraries like [Material React Table](https://github.com/KevinVandy/material-react-table/blob/v2/packages/material-react-table/src/hooks/useMRT_TableInstance.ts) have simply created custom wrappers around their adapter's table constructor to extend the table instance with custom functionality, and you can do the same around `TableController` in Lit.

In v9, TanStack Table uses the `features` option (via `tableFeatures()`) to declare which features your table uses. This enables tree-shaking: you only bundle the code for the features you need. You can add custom features to the table instance in exactly the same way as the built-in features.

> In v9, features are opt-in. Use `tableFeatures({ ... })` to declare which features your table uses, including custom features.

### How TanStack Table Features Work

TanStack Table's source code is arguably somewhat simple (at least we think so). All code for each feature is split up into its own object/file with instantiation methods to create initial state, default table and column options, and API methods that can be added to the `table`, `header`, `column`, `row`, and `cell` instances.

All of the functionality of a feature object can be described with the `TableFeature` type that is exported from TanStack Table. This type is a TypeScript interface that describes the shape of a feature object needed to create a feature.

```ts
export interface TableFeature {
  assignCellPrototype?: <
    TFeatures extends TableFeatures,
    TData extends RowData,
  >(
    prototype: Record<string, any>,
    table: Table_Internal<TFeatures, TData>,
  ) => void
  assignColumnPrototype?: <
    TFeatures extends TableFeatures,
    TData extends RowData,
  >(
    prototype: Record<string, any>,
    table: Table_Internal<TFeatures, TData>,
  ) => void
  assignHeaderPrototype?: <
    TFeatures extends TableFeatures,
    TData extends RowData,
  >(
    prototype: Record<string, any>,
    table: Table_Internal<TFeatures, TData>,
  ) => void
  assignRowPrototype?: <TFeatures extends TableFeatures, TData extends RowData>(
    prototype: Record<string, any>,
    table: Table_Internal<TFeatures, TData>,
  ) => void
  constructTableAPIs?: <TFeatures extends TableFeatures, TData extends RowData>(
    table: Table_Internal<TFeatures, TData>,
  ) => void
  getDefaultColumnDef?: <
    TFeatures extends TableFeatures,
    TData extends RowData,
    TValue extends CellData = CellData,
  >() => ColumnDefBase_All<TFeatures, TData, TValue>
  getDefaultTableOptions?: <
    TFeatures extends TableFeatures,
    TData extends RowData,
  >(
    table: Table_Internal<TFeatures, TData>,
  ) => Partial<TableOptions_All<TFeatures, TData>>
  getInitialState?: (initialState: Partial<TableState_All>) => TableState_All
  initRowInstanceData?: <
    TFeatures extends TableFeatures,
    TData extends RowData,
  >(
    row: Row<TFeatures, TData>,
  ) => void
}
```

This might be a bit confusing, so let's break down what each of these methods do:

#### Default Options and Initial State

<br />

##### getDefaultTableOptions

The `getDefaultTableOptions` method in a table feature is responsible for setting the default table options for that feature. For example, in the [Column Resizing](https://github.com/TanStack/table/blob/beta/packages/table-core/src/features/column-resizing/columnResizingFeature.ts) feature, the `getDefaultTableOptions` method sets the default `columnResizeMode` option with a default value of `"onEnd"`.

<br />

##### getDefaultColumnDef

The `getDefaultColumnDef` method in a table feature is responsible for setting the default column options for that feature. For example, in the [Sorting](https://github.com/TanStack/table/blob/beta/packages/table-core/src/features/row-sorting/rowSortingFeature.ts) feature, the `getDefaultColumnDef` method sets the default `sortUndefined` column option with a default value of `1`.

<br />

##### getInitialState

The `getInitialState` method in a table feature is responsible for setting the default state for that feature. For example, in the [Pagination](https://github.com/TanStack/table/blob/beta/packages/table-core/src/features/row-pagination/rowPaginationFeature.ts) feature, the `getInitialState` method sets the default `pageSize` state with a value of `10` and the default `pageIndex` state with a value of `0`.

#### API Creators

<br />

##### constructTableAPIs

The `constructTableAPIs` method in a table feature is responsible for adding methods to the `table` instance. For example, in the [Row Selection](https://github.com/TanStack/table/blob/beta/packages/table-core/src/features/row-selection/rowSelectionFeature.ts) feature, the `constructTableAPIs` method adds many table instance API methods such as `toggleAllRowsSelected`, `getIsAllRowsSelected`, `getIsSomeRowsSelected`, etc. So then, when you call `table.toggleAllRowsSelected()`, you are calling a method that was added to the table instance by the `rowSelectionFeature` feature.

<br />

##### assignHeaderPrototype

The `assignHeaderPrototype` method in a table feature is responsible for adding methods to the shared `header` prototype. For example, the [Column Sizing](https://github.com/TanStack/table/blob/beta/packages/table-core/src/features/column-sizing/columnSizingFeature.ts) feature adds header instance API methods such as `getStart`. So then, when you call `header.getStart()`, you are calling a method that was added by the column sizing feature.

<br />

##### assignColumnPrototype

The `assignColumnPrototype` method in a table feature is responsible for adding methods to the shared `column` prototype. For example, the [Sorting](https://github.com/TanStack/table/blob/beta/packages/table-core/src/features/row-sorting/rowSortingFeature.ts) feature adds column instance API methods such as `getNextSortingOrder`, `toggleSorting`, etc. So then, when you call `column.toggleSorting()`, you are calling a method that was added by the row sorting feature.

<br />

##### assignRowPrototype and initRowInstanceData

The `assignRowPrototype` method in a table feature is responsible for adding methods to the shared `row` prototype. The `initRowInstanceData` method is available for per-row instance data or caches that cannot live on the shared prototype. For example, the [Row Selection](https://github.com/TanStack/table/blob/beta/packages/table-core/src/features/row-selection/rowSelectionFeature.ts) feature adds row instance API methods such as `toggleSelected` and `getIsSelected`.

<br />

##### assignCellPrototype

The `assignCellPrototype` method in a table feature is responsible for adding methods to the shared `cell` prototype. For example, the [Column Grouping](https://github.com/TanStack/table/blob/beta/packages/table-core/src/features/column-grouping/columnGroupingFeature.ts) feature adds cell instance API methods such as `getIsGrouped` and `getIsAggregated`.

### Adding a Custom Feature

Let's walk through making a custom table feature for a hypothetical use case. Let's say we want to add a feature to the table instance that allows the user to change the "density" (padding of cells) of the table. 

Here's an in-depth look at the steps to create a custom feature.

#### Step 1: Set up TypeScript Types

Assuming you want the same full type-safety that the built-in features in TanStack Table have, let's set up all of the TypeScript types for our new feature. We'll create types for new table options, state, and table instance API methods.

These types are following the naming convention used internally within TanStack Table, but you can name them whatever you want. We are not adding these types to TanStack Table yet, but we'll do that in the next step.

```ts
// define types for our new feature's custom state
export type DensityState = 'sm' | 'md' | 'lg'
export interface TableState_Density {
  density: DensityState
}

// define types for our new feature's table options
export interface TableOptions_Density {
  enableDensity?: boolean
  onDensityChange?: OnChangeFn<DensityState>
}

// Define types for our new feature's table APIs
export interface Table_Density {
  setDensity: (updater: Updater<DensityState>) => void
  toggleDensity: (value?: DensityState) => void
}
```

#### Step 2: Add the Feature to TanStack Table's Feature Maps

TanStack Table uses the keys passed to `tableFeatures({ ... })` to infer which feature state, options, and APIs exist on a table. To make a custom feature key type-safe, add it to the exported `Plugins`, `TableState_FeatureMap`, `TableOptions_FeatureMap`, and `Table_FeatureMap` interfaces with declaration merging.

```ts
declare module '@tanstack/lit-table' {
  interface Plugins {
    densityPlugin: TableFeature
  }

  interface TableState_FeatureMap {
    densityPlugin: TableState_Density
  }

  interface TableOptions_FeatureMap<
    TFeatures extends TableFeatures,
    TData extends RowData,
  > {
    densityPlugin: TableOptions_Density
  }

  interface Table_FeatureMap<
    TFeatures extends TableFeatures,
    TData extends RowData,
  > {
    densityPlugin: Table_Density
  }
}
```

Once the feature is registered this way, TypeScript can infer the feature's state, options, and APIs only on tables whose `features` include `densityPlugin`.

#### Step 3: Create the Feature Object

With all of that TypeScript setup out of the way, we can now create the feature object for our new feature. This is where we define all of the methods that will be added to the table instance.

Use the `TableFeature` type to ensure that you are creating the feature object correctly. If the TypeScript types are set up correctly, you should have no TypeScript errors when you create the feature object with the new state, options, and instance APIs.

```ts
export const densityPlugin: TableFeature = {
  // define the new feature's initial state
  getInitialState: (initialState) => {
    return {
      density: 'md',
      ...initialState, // must come last
    }
  },

  // define the new feature's default options
  getDefaultTableOptions: (table) => {
    return {
      enableDensity: true,
      onDensityChange: makeStateUpdater('density', table),
    }
  },
  // if you need to add a default column definition...
  // getDefaultColumnDef: () => {},

  // define the new feature's table instance methods
  constructTableAPIs: (table) => {
    assignTableAPIs('densityPlugin', table, {
      table_setDensity: {
        fn: (updater: Updater<DensityState>) => {
          const safeUpdater: Updater<DensityState> = (old) => {
            const newState = functionalUpdate(updater, old)
            return newState
          }
          return table.options.onDensityChange?.(safeUpdater)
        },
      },
      table_toggleDensity: {
        fn: (value?: DensityState) => {
          const safeUpdater: Updater<DensityState> = (old) => {
            if (value) return value
            return old === 'lg' ? 'md' : old === 'md' ? 'sm' : 'lg'
          }
          return table.options.onDensityChange?.(safeUpdater)
        },
      },
    })
  },

  // if you need to add row instance APIs...
  // assignRowPrototype: (prototype, table) => {},
  // initRowInstanceData: (row) => {},
  // if you need to add cell instance APIs...
  // assignCellPrototype: (prototype, table) => {},
  // if you need to add column instance APIs...
  // assignColumnPrototype: (prototype, table) => {},
  // if you need to add header instance APIs...
  // assignHeaderPrototype: (prototype, table) => {},
}
```

#### Step 4: Add the Feature to the Table

Now that we have our feature object, we can add it to the table instance by including it in the `tableFeatures()` call and passing the result to the `features` option when we create the table instance.

```ts
const features = tableFeatures({ densityPlugin })

const table = this.tableController.table({
  features,
  columns,
  data: this.data,
  //..
})
```

#### Step 5: Use the Feature in Your Application

Now that the feature is added to the table instance, you can use the new instance APIs, options, and state in your application. Here, `table.state.density` is a reactive read in `render` (the `TableController` keeps the host updated):

```ts
const density = table.state.density

return html`
  <td
    style="padding: ${density === 'sm' ? '4px' : density === 'md' ? '8px' : '16px'}; transition: padding 0.2s"
  >
    ${FlexRender({ cell })}
  </td>
`
```

#### Do We Have to Do It This Way?

This is just a new way to integrate custom code along-side the built-in features in TanStack Table. In our example up above, we could have just as easily stored the `density` state in a `@state`, defined our own `toggleDensity` handler wherever, and just used it in our code separately from the table instance. Building table features along-side TanStack Table instead of deeply integrating them into the table instance is still a perfectly valid way to build custom features. Depending on your use case, this may or may not be the cleanest way to extend TanStack Table with custom features.
