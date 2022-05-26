---
title: FAQ
---

## How do I stop my table state from automatically resetting when my data changes?

Most plugins use state that _should_ normally reset when the data sources changes, but sometimes you need to suppress that from happening if you are filtering your data externally, or immutably editing your data while looking at it, or simply doing anything external with your data that you don't want to trigger a piece of table state to reset automatically.

For those situations, each plugin provides a way to disable the state from automatically resetting internally when data or other dependencies for a piece of state change. By setting any of them to `false`, you can stop the automatic resets from being triggered.

Here is a React-based example of stopping basically every piece of state from changing as they normally do while we edit the `data` source for a table:

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

useTableInstance({
  ...
  autoResetPageIndex: !skipPageResetRef.current,
  autoResetExpanded: !skipPageResetRef.current,
})
```

Now, when we update our data, the above table states will not automatically reset!
