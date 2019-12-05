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

**It's important that the state override is done within a `useMemo` call to prevent the state variable from changing on every render. It's also just as important that you always use the `state` in any memoization dependencies to ensure that you do not block normal state updates.**

## How do I stop my table state from automatically resetting when my data changes?

Most plugins use state that _should_ normally reset when the data sources changes, but sometimes you need to suppress that from happening if you are filtering your data externally, or immutably editing your data while looking at it, or simply doing anything external with your data that you don't want to trigger a piece of table state to reset automatically.

For those situations, each plugin provides options like `getResetPageDeps` or `getResetExpandedDeps`, so and an so forth. These functions are provided the table `instance` and allowed to return an array of variables that will be injected into the `React.useEffect`'s dependency array that is responsible for watching and resetting those states. By returning a new array in one of these arrays, you can either stop the automatic resets from being triggered, or even trigger them more based on what you are returning. You can also return `false` for any of these options to disable the automatic resets completely, or pass `undefined` to allow the default dependendies to be used.

Here is an example of completely disabling the page from resetting when data changes:

```js
const [data, setData] = React.useState([])
const skipPageResetRef = React.useRef()

const updateData = newData => {
  // When data gets updated with this function, disable the
  // page from resetting
  skipPageResetRef.current = true

  setData(newData)
}

React.useEffect(() => {
  skipPageResetRef.current = false
})

useTable({
  data,
  getResetPageDeps: skipPageReset ? false : undefined,
})
```

<!-- ## How can I hide/show columns? -->
