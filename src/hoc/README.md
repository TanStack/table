<div style="text-align:center;">
  <a href="https://github.com/react-tools/react-table" target="\_parent"><img src="https://github.com/react-tools/media/raw/master/logo-react-table.png" alt="React Table Logo" style="width:450px;"/></a>
</div>

# ReactTable - expanding with HOCs

This documentation is about expanding ReactTable using Higher Order Components/Functions.

## Covered in this README

* A Brief explanation of HOCs and why they are a good approach for ReactTable enhancements
* Documentation of the currently available HOCs
* TreeTable
* SelectTable
* Documentation of the standard for writing HOCs with ReactTable

## What are HOCs and why use them with ReactTable

HOCs (or Higher Order Components/Functions) are either a React Component (or a function that returns a React Component)
that are used to enhance the functionality of an existing component. How much you can enhance depends on the props that
the component exposes.

Fortunately, ReactTable exposes a LOT of functionality as props to the component. In some cases there are too many
props to keep track of and that is where HOCs come in.

You can write a HOC that just focusses on the additional functionality you want to enhance and keep those enhancements to
reuse over and over again when you need them. You don't have to edit the ReactSource code, just wrap ReactTable in one or
more HOCs (more on some issues related to chaining HOCs later) that provide the additional functionality you want to expose.

The most obvious HOC is one that can add `checkbox` or select functionality. The HOC included provides `select` functionality
that allows the developer to specify if they want a `checkbox` or `radio` style of select column. The implementation of the
selection is recorded (e.g. in component state, Redux, etc.) and how to manage multiple selections. The HOC really only handles
the rendering pieces.

But there is more documentation on the `select` HOC below.

## Currently Available HOCs

### TreeTable

TreeTable takes over the rendering of the generated pivot rows of ReactTable so that they appear more like an expandable Tree.

It accomplishes this by rendering a 100% wide div and then only rendering the cell that controls the pivot at that level.

Using it is as simple as doing the following:

```javascript
import ReactTable from "react-table";
import treeTableHOC from "react-table/lib/hoc/treeTable";

const TreeTable = treeTableHOC(ReactTable);
```

After you have done the above, you can then use `TreeTable` just as you would `ReactTable` but it will render pivots using
the Tree style described above.

### SelectTable

SelectTable is a little trickier. The HOCs attempt to avoid adding additional state and, as there is no internal ID for a row that
can be relied on to be static (ReactTable just reuses indexes when rendering) the developer has to maintain the state outside of even
the wrapped component. So it is largely based on callbacks.

You include the HOC in the same manner as you would for the treeTableHOC but then need to provide the following overrides:

* isSelected - returns `true` if the key passed is selected otherwise it should return `false`
* selectAll - a property that indicates if the selectAll is set (`true|false`)
* toggleAll - called when the user clicks the `selectAll` checkbox/radio
* toggleSelection - called when the use clicks a specific checkbox/radio in a row
* selectType - either `checkbox|radio` to indicate what type of selection is required

**Note:** The select field defaults to the accessor `_id` property in order to render the select field for that particular row. If your objects have different
unique ID fields, make sure to tell React Table that by passing it the `keyField` property.

```Javascript
<ReactTable keyField='id' />
```

In the case of `radio` there is no `selectAll` displayed but the developer is responsible for only making one selection in
the controlling component's state. You could select multiple but it wouldn't make sense and you should use `checkbox` instead.

You also have to decide what `selectAll` means. Given ReactTable is a paged solution there are other records off-page. When someone
selects the `selectAll` checkbox, should it mark every possible record, only what might be visible to due a Filter or only those items
on the current page?

The example opts for the middle approach so it gets a `ref` to the ReactTable instance and pulls the `sortedData` out of the resolved
state (then walks through those records and pulls their ID into the `selection` state of the controlling component).

You can also replace the input component that is used to render the select box and select all box:

* SelectAllInputComponent - the checkbox in the top left corner
* SelectInputComponent - the checkbox used on a row

### SelectTreeTable

SelectTreeTable is a combination of TreeTable and SelectTable.

To function correctly the chain has to be in the correct order as follows (see the comments in the guid on HOCs below).

```Javascript
const SelectTreeTable = selectTableHOC(treeTableHOC(ReactTable));
```

In this particular instance it is (probably) because the functions need access to the state on the wrapped component to manage
the selected items. Although that is not totally clearly the issue.

## HOC Guide for ReactTable

There are a few rules required when writing a HOC for ReactTable (other than meeting the normal lint standards - which are
still being developed).

Firstly, there are issues with `ref` when you write a HOC. Consider a deeply nested component wrapped in multiple HOCs...

A HOC in the middle of the chain requires access to the instance of the component it thinks it is wrapping but there is at
least one other wrapper in the way. The challenge is: How do I get to the actual wrapped component?

Each HOC is required to be a React Class so that a `ref` can be obtained against each component:

```Javascript
<Component ... ref={r => this.wrappedInstance = r} />
```

_NOTE:_ "Component" can also be the `<ReactTable />` instance.

Then the following method needs
to be placed on the class so that it exposes the correct instance of ReactTable:

```Javascript
getWrappedInstance() {
  if (!this.wrappedInstance) console.warn('<component name here> - No wrapped instance')
  if (this.wrappedInstance.getWrappedInstance) return this.wrappedInstance.getWrappedInstance()
  else return this.wrappedInstance
}
```

Essentially this will walk down the chain (if there are chained HOCs) and stop when it gets to the end and return the wrapped instance.

Finally, sometimes the chains need to be in a specific order to function correctly. It is not clear if this is just an architectural
issue or if it would be better solved using a library like `recompose`. Anyone who is able to contribute a reliable solution to this
is welcome to submit a PR.
