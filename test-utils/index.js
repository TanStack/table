export function getHeaderIds(state) {
  return state.headerGroups.map(headerGroup =>
    headerGroup.headers.map(header => header.id)
  )
}

export function getRowValues(state) {
  return state.rows.map(row => row.cells.map(cell => cell.value))
}
