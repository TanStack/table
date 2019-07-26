export const text = (rows, id, filterValue) => {
  return rows.filter(row => {
    const rowValue = row.values[id]
    return rowValue !== undefined
      ? String(rowValue)
          .toLowerCase()
          .includes(String(filterValue).toLowerCase())
      : true
  })
}

export const exactText = (rows, id, filterValue) => {
  return rows.filter(row => {
    const rowValue = row.values[id]
    return rowValue !== undefined
      ? String(rowValue).toLowerCase() === String(filterValue).toLowerCase()
      : true
  })
}

export const exactTextCase = (rows, id, filterValue) => {
  return rows.filter(row => {
    const rowValue = row.values[id]
    return rowValue !== undefined
      ? String(rowValue) === String(filterValue)
      : true
  })
}

export const includes = (rows, id, filterValue) => {
  return rows.filter(row => {
    const rowValue = row.values[id]
    return filterValue.includes(rowValue)
  })
}

export const includesAll = (rows, id, filterValue) => {
  return rows.filter(row => {
    const rowValue = row.values[id]
    return filterValue.every(val => rowValue.includes(val))
  })
}

export const exact = (rows, id, filterValue) => {
  return rows.filter(row => {
    const rowValue = row.values[id]
    return rowValue === filterValue
  })
}

export const between = (rows, id, filterValue) => {
  return rows.filter(row => {
    const rowValue = row.values[id]
    return rowValue >= filterValue[0] && rowValue <= filterValue[1]
  })
}
