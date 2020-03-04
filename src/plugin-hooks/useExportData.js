import React from 'react'
import Papa from 'papaparse'

import { getFirstDefined } from '../utils'

// Get exported file name(do not specify extension here)
const defaultGetExportFileName = ({ fileType, all }) => {
  return `${all ? 'all-' : ''}data`
}

// To get column name while exporting
const defaultGetExportHeaderValue = col => {
  let name = col.Header
  if (typeof name === 'object' || typeof name === 'function') {
    name = col.id
  }
  return name
}

// To get cell value while exporting
const defaultGetExportCellValue = (row, col) => {
  return row.values[col.id]
}

export const useExportData = hooks => {
  hooks.useInstance.push(useInstance)
}

useExportData.pluginName = 'useExportData'

function useInstance(instance) {
  const {
    rows,
    initialRows,
    allColumns,
    disableExport,
    getExportFileName = defaultGetExportFileName,
  } = instance

  // Adding `canExport` meta data
  allColumns.forEach(column => {
    const { accessor } = column

    const canExport = accessor
      ? getFirstDefined(
          column.disableExport === true ? false : undefined,
          disableExport === true ? false : undefined,
          true
        )
      : false

    column.canExport = canExport
  })

  // This method will enable export of data on `instance` object
  const exportData = React.useCallback(
    ({ all = false, type: fileType = 'csv' } = {}) => {
      const colHeader = allColumns
        .filter(col => col.canExport && (all || col.isVisible))
        .map(col => {
          const { getExportHeaderValue = defaultGetExportHeaderValue } = col

          return { id: col.id, name: getExportHeaderValue(col), columnObj: col }
        })

      if (colHeader.length === 0) {
        console.warn('No exportable columns are available')
      }

      let exportableRows = rows
      if (all) {
        exportableRows = initialRows
      }

      const data = exportableRows.map(row => {
        return colHeader.map(col => {
          const { getExportCellValue = defaultGetExportCellValue } = col.columnObj

          return getExportCellValue(row, col)
        })
      })

      const headerNames = colHeader.map(col => col.name)

      const exportData = { fields: headerNames, data }

      const fileName = getExportFileName({ fileType, all })

      exportFile({ data: exportData, fileName, type: fileType })
    },
    [getExportFileName, initialRows, rows, allColumns]
  )

  Object.assign(instance, {
    exportData,
  })
}

function exportFile({ data = [], fileName, type }) {
  let fileBlob = null

  if (type === 'csv') {
    fileBlob = getCsvBlob(data)
  } else if (type === 'xlsx') {
    // Todo
  }
  // keep on adding support for different file types here
  else {
    console.warn('Not Supported File Type')
  }

  downloadFileViaBlob(fileBlob, fileName, type)
}

function downloadFileViaBlob(fileBlob, fileName, type) {
  if (fileBlob) {
    const dataUrl = URL.createObjectURL(fileBlob)
    const link = document.createElement('a')
    link.download = `${fileName}.${type}`
    link.href = dataUrl
    link.click()
  }
}

function getCsvBlob(data) {
  const csvString = Papa.unparse(data)
  return new Blob([csvString], { type: 'text/csv' })
}
