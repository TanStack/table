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
      [controlledPageIndex]
    )
  },
})
```

**It's important that the state override is done within a `useMemo` call to prevent the state variable from changing on every render.**
