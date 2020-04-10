---
name: useExportData
route: /api/useExportData
menu: API
---

# `useExportData`

- Plugin Hook
- Optional

`useExportData` is the hook that helps in **downloading table data**.

- You need to provide `fileBlob` for download, so as to make it flexible to download data in any format.

### Table Options

The following options are supported via the main options object passed to `useTable(options)`

- `disableExport: Bool`
  - Disables exporting of data at table level.
- `getExportFileBlob: Function({ columns, data, fileType }) => FileBlob`
  - **Required**
  - This function is used to return data as `FileBlob` which will be downloaded
  - In Above definition `columns` is downloadable columns based on select configuration of `All` Data or `Current` view
- `getExportFileName: Function({ fileType, all }) => string`
  - **Optional**
  - This function is used to overwrite exported file name.
  - Default fileName is `all-data.<fileType>` and `data.<fileType>` for `All` Data and `Current` view repectively

### Column Options

The following options are supported on any `Column` object passed to the `columns` options in `useTable()`

- `disableExport: Bool`
  - Optional
  - Defaults to `false`
  - If set to `true`, this column will not be exported with data

-`getColumnExportValue: Function(column) => string`

- Optional
- This function is used to overwrite exported value of Header for this column

-`getCellExportValue: Function(row, column) => string`

- Optional
- This function is used to overwrite exported value for this cell

### Instance Properties

The following values are provided to the table `instance`:

- `exportData: Function(fileType: string, all: boolean)`
  - This function is used to initiate downloading of data
  - Parameter `all` defined whether you want to download full data or current view only.
    - `Current view` considers sorted, filtered data that is currenlty visible to user.

### Column Properties

The following properties are available on every `Column` object returned by the table instance.

- `canExport: Bool`

  - Denotes whether a column is exportable or not depending on if it has a valid accessor/data model or is manually disabled via an option.

### Example

- [Source](https://github.com/tannerlinsley/react-table/tree/master/examples/export-data)
- [Open in CodeSandbox](https://codesandbox.io/s/github/tannerlinsley/react-table/tree/master/examples/export-data)
