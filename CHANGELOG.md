## 7.0.0-rc.8

- Fix an issue where `useResizeColumns` would crash when using the resizer prop getter
- Fix an issue where `useBlockLayout` was clobbering props sent to headers

## 7.0.0-rc.7

Removed:

- `applyHooks` (exported but undocumented) function has been deprecated. Please use either `reduceHooks` or `loopHooks` utilities in your custom plugins now.
- `applyPropHooks` (exported but undocumented) function has been deprecated. Please use the `makePropGetter` utility in your custom plugins now.

Added:

- `reduceHooks` exported utility which is used to reduce a value through a collection of hooks. Each hook must return a value (mutation is discouraged)
- `loopHooks` exported utility which is used to loop over a collection of hooks. Hooks are not allowed to return a value (mutation is encouraged)
- `makePropGetter` exported utility which is used to create prop getters from a prop getter hook.
- `useOptions` plugin hook, which allows a plugin to reduce/modify the initial options being passed to the table
- `useFinalInstance` plugin hook, which allows a plugin access to the final table instance before it is returned to the user.

Modified:

- Prop-getter hook functions now support returning an array (in addition to the typical object of props). When an array is returned, each item in the array is smart-merged into a new props object (meaning it will intelligently compose and override styles and className)
- Prop-getter function supplied to the table have 2 new overloaded options (in addition to the typical object of props):
  - `Function(props, instance, ...row/col/context) => Array<props> | props` - If a function is passed to a prop getter function, it will receive the previous props, the table instance, and potentially more context arguments. It is then be expected to return either an array of new props (to be smart-merged with styles and classes, the latest values taking priority over the previous values) or a props object (which will replace all previous props)
  - `Array<props>` - If an array is passed to a prop getter function, each prop object in the array will be smart-merged with styles and classes into the props from previous hooks (with the latest values taking priority over the previous values).
- Extracted default hooks into separate file.
- Converted almost all usages of `instanceRef.current` to use `useGetLatest(instanceRef.current)` to help with avoiding memory leaks and to be more terse.
- Converted all previous prop-getter definitions to use the new `makePropGetter`
- Reorganized plugin hooks to declare as many hooks in the main plugin function as opposed to in the `useInstance` hook.
- Changed the `useInstanceBeforeDimensions` hook to be a `loopHooks` call instead of a reducer. An error will be thrown now if any of these hook functions returns a value (to encourage mutation of the instance)
- Changed the `useInstance` hook to be a `loopHooks` call instead of a reducer. An error will be thrown now if any of these hook functions returns a value (to encourage mutation of the instance)
- Change the `prepareRow` hook to be a `loopHooks` call instead of a reducer. An error will be thrown now if any of these hook functions returns a value (to encourage mutation of the row)

## 7.0.0-rc.6

- The `columnsBeforeHeaderGroups` and `columnsBeforeHeaderGroupsDeps` hooks have been renamed to `flatColumns` and `flatColumnsDeps` respectively, which better reflects what they are used for, rather than their order, which can remain implicit.
- Added `headerGroups` and `headerGroupDeps` hooks, which, similar to `flatColumns`, allow you to decorate (and trigger) the memoized header group generation.
- Added `columns` and `columnsDeps` hooks, which, similar to `flatColumns` and `headerGroups`, allow you to decorate (and trigger) the memoized column generation/decoration.
- The new hook order is as follows: `columns/columnsDeps` => `flatColumns/flatColumnsDeps` => `headerGroups/headerGroupsDeps`
- `useColumnVisibility` now uses the new `headerGroupsDeps` hook to trigger header group regeneration when visibility changes

## 7.0.0-rc.5

- Fixed an issue where the exported `useAsyncDebounce` method would crash if its promise throw an error.

## 7.0.0-rc.4

- A maintenance release, purely intended to update the @latest tag (which was overwritten by a v6 publish)

## 7.0.0-rc.3

- Fixed an issue where `column.clearSortBy` would crash

## 7.0.0-rc.2

- `reducerHandlers` has been deprecated in favor of the new `stateReducers` hook.
  - The `previousState` and `instanceRef` are now both generally available in state reducers for convenience.
  - The global action property `action.instanceRef` has been deprecated.
- The `reducer` option has been renamed to `stateReducer` and in addition to passing a single reducer function now also supports passing an array of reducers
- Renamed `manualSorting` to be `manualSortBy` to be consistent with other naming conventions
- Removed the `getResetPageDeps` option in favor of the new `autoResetPage` option.
- Removed the `getResetFilterDeps` option in favor of the new `autoResetFilters` option.
- Removed the `getResetSortByDeps` option in favor of the new `autoResetSortBy` option.
- Removed the `getResetGroupByDeps` option in favor of the new `autoResetGroupBy` option.
- Removed the `getResetExpandedDeps` option in favor of the new `autoResetExpanded` option.
- Added a new exported utility called `useAsyncDebounce` to aid with external async side-effects.
- A new `useGetLatest` hook is used internally to track latest instances in a less ref-driven and verbose way.
- A new `useMountedLayoutEffect` hooks is now used internally to handle post-mount side-effects, mostly dealing with autoReset functionality
- Plugin hooks are now "consumed" using an internal `useConsumeHookGetter` hook. When they are consumed, they can no longer be manipulated past that point in the table lifecycle. This should help ensure people are using them in a relatively safe order with consistent expectations.
- Drastically "reduced" the reducer logic itself to be easier to understand and to be a stable reference for the life of the table. This change also means that the reducer must no longer be double-run/back-compared by React for changes in closure, thus actions and stateReducers (including user state reducers) will only fire once per action.
- Removed `debug` and related logging. It has been somewhat useful during development, but is now very noisy in the code. We can debug lifecycle and performance as needed from here on out.
- Removed unnecessary exports from `./utils.js` and moved all intentionally exported utilities to a new `./publicUtils.js` file.

## 7.0.0-rc.1

- Minor regex optimizations during row path creation

## 7.0.0-rc.0

- Added the support for the `Footer` renderer, `column.getFooterProps`, `footerGroups` and `footerGroup.getFooterProps`

## 7.0.0-beta.28

- Added the `useColumnVisibility` plugin as a core plugin along with several new instance and column-level methods to control column visibility
- Added the "column-hiding" example

## 7.0.0-beta.27

- Added the `useControlledState` option, which allows for hook-context control of the resolved internal table state

## 7.0.0-beta.26

- Fixed an issue where the table would crash if useSortBy was reset via the resetSortBy action
- Updated all of the examples to use the "react-table@latest" tag.
- `utils` is no longer an exported variable and instead, all of the individual util methods are exported at the root level of the library.

## 7.0.0-beta.25

- Fixed an issue where `useRowState` would crash due to invalid initial state of previous cell state on `columnId` lookup

## 7.0.0-beta.24

- Changed `selectedRowPaths` to use a `Set()` instead of an array for performance.
- Removed types and related files from the repo. The community will now maintain types externally on Definitely Typed

## 7.0.0-beta.23

- The internal `useMain` hook has been renamed to `useInstance`
- The internal `useBeforeDimensions` hook has been renamed to `useInstanceBeforeDimensions`
- Fixed an issue where `useResizeColumns` wasn't working properly

## 7.0.0-beta.22

- Fixed an issue where `useRowState` would crash due to invalid initial state attempting to spread into the new state

## 7.0.0-beta.21

- Removed deprecated `defaultState` export

## 7.0.0-beta.20

- Internals have been reworked to use `useReducer` instead of `useState` for stability and architecture
- The `state` option has been removed in favor of using a custom reducer
- The `reducer` option has been changed to a new function signature: `function (newState, action, oldState) => newState`
- The `setState` table instance method is no longer supported
- The `dispatch` table instanced method was added
- The `ReactTable.actions` export is now a plain object of action types mapped to identically named action strings
- The `ReactTable.reducerHandlers` export was added, which is a plain object of plugin hook names mapped to their respective reducer functions

## 7.0.0-beta.19

- Added an `isAggregated` boolean parameter to the `aggregate` function signature

## 7.0.0-beta.16

- Removed service workers from examples
- Fixed a memory leak when `instance` was referenced in function closures
- Fixed an issue where the table would infinitely rerender due to incorrect effect dependencies
- Fixed an issue where row grouping and row selection would not work properly together.

## 7.0.0-beta.15

- Fixed an issue where `defaultGetResetPageDeps` was using `data` instead of `rows`

## 7.0.0-beta.14

- Removed
  - `disablePageResetOnDataChange` option. use the `getResetPageDeps` option now.
- Added
  - `getResetPageDeps` option
  - `getResetFilterDeps` option
  - `getResetSortByDeps` option
  - `getResetGroupByDeps` option
  - `getResetExpandedDeps` option

## 7.0.0-beta.13

- Added options
  - `defaultCanSort`
  - `defaultCanFilter`
  - `defaultCanGroupBy`
  - `column.defaultCanSort`
  - `column.defaultCanFilter`
  - `column.defaultCanGroupBy`
- Renamed
  - `disableGrouping` to `disableGroupBy`
  - `disableSorting` to `disableSortBy`
  - `disableGroupBy` to `disableGroupBy`
  - `column.disableGrouping` to `column.disableGroupBy`
  - `column.disableSorting` to `column.disableSortBy`
  - `column.disableGroupBy` to `column.disableGroupBy`
- Removed propType definitions. Since types are now being maintained, it makes little sense to also maintain these. Cooincidentally, this also saves some bundle size in some scenarios where they may not be removed properly by a developer's bundler.

## 7.0.0-beta.0

- Massive changes to the entire project and library. Please consult the README and documentation for more information regarding these changes.

## 6.8.6

#### Fixes & Optimizations

- Since `resolveData` is now capable of materializing data on it's own, the `data` prop is no longer required as a prop-type.

## 6.8.4

#### Fixes & Optimizations

- Only run `resolveData` prop when `data` prop has changed, not any others.

## 6.8.3

#### Fixes & Optimizations

- Allow the `resolveData` prop to alter or materialize new data when the `data` prop changes.

## 6.8.1

#### Fixes & Optimizations

- Updated eslint and code formatting

## 6.7.5

#### Fixes & Optimizations

- Now passes `column` to `getResizerProps` (#667)
- NOTE: `getResizerProps` is now only called if the column is resizable
- Fixes the `className` ordering in defaultProps for ThComponent (#673)
- NOTE: user supplied classNames now come at the end so they can extend the defaults

## 6.7.4

#### Fixes & Optimizations

- Fix Prop types for columns

## 6.7.3

#### Fixes & Optimizations

- Fix the rest of the proptypes

## 6.7.2

#### Fixes & Optimizations

- `getPropTypes` proptype check

## 6.7.1

#### Fixes & Optimizations

- `eslint-config` moved to dev deps

## 6.7.0

## 6.7.0-alpha-0

#### New Features

- Expose page/pageSize to rows/cells
- Supply sort direction to custom sort methods

#### Fixes & Optimizations

- README updates
- Linter cleanup
- Added PropTypes node module
- Deps, linting and style upgrades

## 6.6.0

#### Fixes & Optimizations

- moved repo to react-tools
- Doc examples moved to codesandbox.io
- README updates
- CSS refacting for rt-tfoot to match rt-thead
- CSS more specific for input and select

## 6.5.3

#### Fixes & Optimizations

- `onClick` proxying and eslint

## 6.5.2

#### New Features

- Provide onClick handleOriginal function - #406

#### Fixes & Optimizations

- README updates
- `makePathArray` in utils - #326
- Various fixes: #294, #376, #398, #415,

## 6.5.1

#### Fixes & Optimizations

- `defaultExpanded` now works correctly - #372
- `column.getProps().rest` props are now applied correctly
- `makeTemplateComponent` now supports `displayName` - #289

## 6.5.0

##### New Features

- `column.filterAll` - defaults to `false`, but when set to `true` will provide the entire array of rows to `filterMethod` as opposed to one row at a time. This allows for more fine-grained filtering using any method you can dream up. See the [Custom Filtering example](https://react-table.js.org/#/story/custom-filtering) for more info.

## 6.4.0

##### New Features

- `PadRowComponent` - the content rendered inside of a padding row. Defaults to a react component that renders `&nbsp;`

## 6.3.0

##### New Features

- `defaultSortDesc` - allows you to set the default sorting direction for all columns to descending.
- `column.defaultSortDesc` - allows you to set the default sorting direction for a specific column. Falls back to the global `defaultSortDesc` when not set at all.

## 6.0.0

##### New Features

- New Renderers:
  - `Aggregated` - Custom renderer for aggregated cells
  - `Pivot` - Custom renderer for Pivoted Cells (utilizes `Expander` and `PivotValue`)
  - `PivotValue` - Custom renderer for Pivot cell values (deprecates the undocumented `pivotRender` option)
  - `Expander` - Custom renderer for Pivot cell Expander
- Added custom sorting methods per table via `defaultSortMethod` and per column via `column.sortMethod`
- Pivot columns are now visibly separate and sorted/filtered independently.
- Added `column.resizable` to override global table `resizable` option for specific columns.
- Added `column.sortable` to override global table `sortable` option for specific columns.
- Added `column.filterable` to override global table `filterable` option for specific columns.
- Added `defaultExpanded` table option.
- All callbacks can now be utilized without needing to hoist and manage the piece of state they export. That is what their prop counterparts are for, so now the corresponding prop is used instead of the callback to detect a "fully controlled" state.
- Prevent transitions while column resizing for a smoother resize effect.
- Disable text selection while resizing columns.

##### Breaking API Changes

- New Renderers:
  - `Cell` - deprecates and replaces `render`
  - `Header` - deprecates and replaces `header`
  - `Footer` - deprecates and replaces `footer`
  - `Filter`- deprecates and replaces `filterRender`
- Callbacks now provide the destination state as the primary parameter(s). This makes hoisting and controlling the state in redux or component state much easier. eg.
  - `onSorting` no longer requires you to build your own toggle logic
  - `onResize` no longer requires you to build your own resize logic
- Renamed `onChange` callback -> `onFetchData` which will always fire when a new data model needs to be fetched (or if not using `manual`, when new data is materialized internally).
- Renamed `filtering` -> `filtered`
- Renamed `sorting` -> `sorted`
- Renamed `expandedRows` -> `expanded`
- Renamed `resizing` -> `resized`
- Renamed `defaultResizing` -> `defaultResized`
- Renamed `defaultFiltering` -> `defaultFiltered`
- Renamed `defaultSorting` -> `defaultSorted`
- Renamed `onSortingChange` -> `onSortedChange`
- Renamed `onFilteringChange` -> `onFilteredChange`
- Renamed `onResize` -> `onResizedChange`
- Renamed `onExpandRow` -> `onExpandedChange`
- Renamed `showFilters` -> `filterable`
- Renamed `hideFilter` -> `filterable` (Column option. Note the true/false value is now flipped.)
- `cellInfo.row` and `rowInfo.row` now reference the materialize data for the table. To reference the original row, use `cellInfo.original` and `rowInfo.original`
- Removed `pivotRender` column option. You can now control how the value is displayed by overriding the `PivotValueComponent` or the individual column's `PivotValue` renderer. See [Pivoting Options Story](https://react-table.js.org/?selectedKind=2.%20Demos&selectedStory=Pivoting%20Options&full=0&down=1&left=1&panelRight=0&downPanel=kadirahq%2Fstorybook-addon-actions%2Factions-panel) for a reference on how to customize pivot column rendering.
