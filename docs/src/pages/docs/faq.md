# FAQ

Below are some of the most frequently asked questions on how to use the React Table API to solve various table challenges you may encounter

<hr/>

## How can I manually control the table state?

Occasionally, you may need to override some of the table state from a parent component or from somewhere above the usage of `useTable`. In this case, you can turn to `useTable`'s `useControlledState` option. This hook function is run on every render and allows you an opportunity to override or change the final table state in a safe way.

For example, to control a table's `pageIndex` from a parent component:

```js
const [controlledPageIndex, setControlledPage] = React.useState(0)

useTable({
  useControlledState: state => {
    return React.useMemo(
      () => ({
        ...state,
        pageIndex: controlledPageIndex,
      }),
      [state, controlledPageIndex]
    )
  },
})
```

> **It's important that the state override is done within a `useMemo` call to prevent the state variable from changing on every render. It's also extremely important that you always use the `state` in any dependencies to ensure that you do not block normal state updates.**

## How can I use the table state to fetch new data?

When managing your data externally or asynchronously (eg. server-side pagination/sorting/grouping/etc), you will need to fetch new data as the internal table state changes. With React Hooks, this is fantastically easier than it was before now that we have the `React.useEffect` hook. We can use this hook to "watch" the table state for specific changes and use those effects to trigger fetches for new data (or synchronize any other state you may be managing externally from your table component):

```js
function Table({ data, onFetchData }) {
  const {
    state: { pageIndex, pageSize, sortBy, filters },
  } = useTable({
    data,
  })

  // When these table states change, fetch new data!
  React.useEffect(() => {
    onFetchData({ pageIndex, pageSize, sortBy, filters })
  }, [onFetchData, pageIndex, pageSize, sortBy, filters])

  return </>
}
```

Using this approach, you can respond and trigger any type of side-effect using the table instance!

## How can I debounce rapid table state changes?

React Table has a few built-in side-effects of it's own (most of which are meant for resetting parts of the state when `data` changes). By default, these state side-effects are on and when their conditions are met, they immediately fire off actions that will manipulate the table state. Sometimes, this may result in multiple rapid rerenders (usually just 2, or one more than normal), and could cause any side-effects you have watching the table state to also fire multiple times in-a-row. To alleviate this edge-case, React Table exports a `useAsyncDebounce` function that will allow you to debounce rapid side-effects and only use the latest one.

A good example of this when doing server-side pagination and sorting, a user changes the `sortBy` for a table and the `pageIndex` is automatically reset to `0` via an internal side effect. This would normally cause our effect below to fire 2 times, but with `useAsyncDebounce` we can make sure our data fetch function only gets called once:

```js
import { useTable, useAsyncDebounce } from 'react-table'

function Table({ data, onFetchData }) {
  const {
    state: { pageIndex, pageSize, sortBy, filters },
  } = useTable({
    data,
  })

  // Debounce our onFetchData call for 100ms
  const onFetchDataDebounced = useAsyncDebounce(onFetchData, 100)

  // When the these table states changes, fetch new data!
  React.useEffect(() => {
    // Every change will call our debounced function
    onFetchDataDebounced({ pageIndex, pageSize, sortBy, filters })
    // Only the last call after the 100ms debounce is over will be fired!
  }, [onFetchDataDebounced, pageIndex, pageSize, sortBy, filters])

  return </>
}
```

## How do I stop my table state from automatically resetting when my data changes?

Most plugins use state that _should_ normally reset when the data sources changes, but sometimes you need to suppress that from happening if you are filtering your data externally, or immutably editing your data while looking at it, or simply doing anything external with your data that you don't want to trigger a piece of table state to reset automatically.

For those situations, each plugin provides a way to disable the state from automatically resetting internally when data or other dependencies for a piece of state change. By setting any of them to `false`, you can stop the automatic resets from being triggered.

Here is an example of stopping basically every piece of state from changing as they normally do while we edit the `data` source for a table:

```js
const [data, setData] = React.useState([])
const skipPageResetRef = React.useRef()

const updateData = newData => {
  // When data gets updated with this function, set a flag
  // to disable all of the auto resetting
  skipPageResetRef.current = true

  setData(newData)
}

React.useEffect(() => {
  // After the table has updated, always remove the flag
  skipPageResetRef.current = false
})

useTable({
  ...
  autoResetPage: !skipPageResetRef.current,
  autoResetExpanded: !skipPageResetRef.current,
  autoResetGroupBy: !skipPageResetRef.current,
  autoResetSelectedRows: !skipPageResetRef.current,
  autoResetSortBy: !skipPageResetRef.current,
  autoResetFilters: !skipPageResetRef.current,
  autoResetRowState: !skipPageResetRef.current,
})
```

Now, when we update our data, the above table states will not automatically reset!
