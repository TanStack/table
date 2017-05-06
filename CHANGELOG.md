## 6.0.0

* Pivot Columns can now be sorted and filtered individually.
* More control over Pivot Column rendering.
* Prevent transitions while column resizing for a smoother resize effect.
* Disable text selection while resizing columns.

##### Breaking API Changes
* Removed `pivotRender` column option. You can now control how the value is displayed by overriding the `PivotValueComponent`.
* Changed how special `expander: true` column renders pivot columns.
See [Pivoting Options Story](https://react-table.js.org/?selectedKind=2.%20Demos&selectedStory=Pivoting%20Options&full=0&down=1&left=1&panelRight=0&downPanel=kadirahq%2Fstorybook-addon-actions%2Factions-panel) for a reference on how to customize pivot column rendering.