import React from 'react'

// Define a default UI for filtering
export function DefaultColumnFilter({
  column: { getFilterValue, preFilteredRows, setFilterValue },
}) {
  const count = preFilteredRows.length

  return (
    <input
      value={getFilterValue() || ''}
      onChange={e => {
        setFilterValue(e.target.value || undefined) // Set undefined to remove the filter entirely
      }}
      placeholder={`Search ${count} records...`}
    />
  )
}

// Define a default UI for filtering
export function GlobalFilter({
  preGlobalFilteredRows,
  globalFilterValue,
  setGlobalFilterValue,
}) {
  const count = preGlobalFilteredRows.length

  return (
    <span
      css={`
        display: inline-block;
        width: auto;
        padding: 0.5rem;
        border: 1px solid rgba(0, 0, 0, 0.2);
        margin-bottom: 0.5rem;
      `}
    >
      Global Search:{' '}
      <input
        value={globalFilterValue || ''}
        onChange={e => {
          setGlobalFilterValue(e.target.value || undefined) // Set undefined to remove the filter entirely
        }}
        placeholder={`${count} records...`}
        style={{
          fontSize: '1.1rem',
          border: '0',
        }}
      />
    </span>
  )
}

// This is a custom filter UI for selecting
// a unique option from a list
export function SelectColumnFilter({
  column: { getFilterValue, setFilterValue, preFilteredUniqueValues },
}) {
  // Calculate the options for filtering
  // using the preFilteredRows
  const options = [...preFilteredUniqueValues.entries()]

  // Render a multi-select box
  return (
    <select
      value={getFilterValue()}
      onChange={e => {
        setFilterValue(e.target.value || undefined)
      }}
    >
      <option value="">All</option>
      {options.map((option, i) => (
        <option key={i} value={option[0]}>
          {option[0]} ({option[1]})
        </option>
      ))}
    </select>
  )
}

// This is a custom filter UI that uses a
// slider to set the filter value between a column's
// min and max values
export function SliderColumnFilter({
  column: { getFilterValue, setFilterValue, preFilteredMinMaxValues },
}) {
  const filterValue = getFilterValue()
  const [min, max] = preFilteredMinMaxValues

  return (
    <div
      css={`
        white-space: nowrap;
      `}
    >
      <span
        css={`
          font-size: 0.8rem;
          font-weight: lighter;
        `}
      >
        {min}
      </span>
      <input
        type="range"
        min={min}
        max={max}
        value={filterValue || min}
        onChange={e => {
          setFilterValue(parseInt(e.target.value, 10))
        }}
      />
      <span
        css={`
          font-size: 0.8rem;
          font-weight: lighter;
        `}
      >
        {max}
      </span>
      {filterValue ? (
        <button onClick={() => setFilterValue(undefined)}>Off</button>
      ) : null}
    </div>
  )
}

// This is a custom UI for our 'between' or number range
// filter. It uses two number boxes and filters rows to
// ones that have values between the two
export function NumberRangeColumnFilter({
  column: { getFilterValue, preFilteredMinMaxValues, setFilterValue },
}) {
  const [min, max] = preFilteredMinMaxValues
  const filterValue = getFilterValue() || []

  return (
    <div
      style={{
        display: 'flex',
      }}
    >
      <input
        value={filterValue[0] || ''}
        type="number"
        onChange={e => {
          const val = e.target.value
          setFilterValue((old = []) => [
            val ? parseInt(val, 10) : undefined,
            old[1],
          ])
        }}
        placeholder={`Min (${min})`}
        style={{
          width: '70px',
          marginRight: '0.5rem',
        }}
      />
      to
      <input
        value={filterValue[1] || ''}
        type="number"
        onChange={e => {
          const val = e.target.value
          setFilterValue((old = []) => [
            old[0],
            val ? parseInt(val, 10) : undefined,
          ])
        }}
        placeholder={`Max (${max})`}
        style={{
          width: '70px',
          marginLeft: '0.5rem',
        }}
      />{' '}
      {filterValue ? (
        <button onClick={() => setFilterValue(undefined)}>Off</button>
      ) : null}
    </div>
  )
}
