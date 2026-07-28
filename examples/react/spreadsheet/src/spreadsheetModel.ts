import { faker } from '@faker-js/faker'

export const DEFAULT_ROW_COUNT = 2_000
export const DEFAULT_COLUMN_COUNT = 100
export const STRESS_ROW_COUNT = 10_000
export const STRESS_COLUMN_COUNT = 250

export type CellValue = string | number | boolean | null
export type SpreadsheetColumnType = 'text' | 'number' | 'date' | 'boolean'

export interface SpreadsheetRow {
  id: string
  cells: Array<CellValue>
  kind: 'field-header' | 'data'
}

export interface SpreadsheetColumnMeta {
  id: string
  index: number
  letter: string
  label: string
  initialType: SpreadsheetColumnType
}

export interface SpreadsheetData {
  columns: Array<SpreadsheetColumnMeta>
  rows: Array<SpreadsheetRow>
}

export interface CellPatch {
  rowId: string
  columnId: string
  before: CellValue
  after: CellValue
}

export interface SpreadsheetCommand {
  label: string
  patches: Array<CellPatch>
}

export interface GridCoordinate {
  rowIndex: number
  columnIndex: number
}

export interface GridBounds {
  minRowIndex: number
  maxRowIndex: number
  minColumnIndex: number
  maxColumnIndex: number
}

export type FillDirection = 'up' | 'down' | 'left' | 'right'

export interface FillPreview {
  direction: FillDirection
  destination: GridBounds
  expanded: GridBounds
}

const seededColumnDefinitions: Array<{
  label: string
  type: SpreadsheetColumnType
}> = [
  { label: 'Account', type: 'text' },
  { label: 'Owner', type: 'text' },
  { label: 'Region', type: 'text' },
  { label: 'Status', type: 'text' },
  { label: 'Revenue', type: 'number' },
  { label: 'Units', type: 'number' },
  { label: 'Margin', type: 'number' },
  { label: 'Start Date', type: 'date' },
  { label: 'Due Date', type: 'date' },
  { label: 'Priority', type: 'text' },
  { label: 'Active', type: 'boolean' },
  { label: 'Notes', type: 'text' },
]

const regions = ['North', 'South', 'East', 'West', 'Central']
const statuses = ['Planned', 'Active', 'Blocked', 'Complete']
const priorities = ['Low', 'Medium', 'High', 'Urgent']

export function columnIndexToLetter(index: number) {
  let current = index + 1
  let result = ''

  while (current > 0) {
    const remainder = (current - 1) % 26
    result = String.fromCharCode(65 + remainder) + result
    current = Math.floor((current - 1) / 26)
  }

  return result
}

export function columnId(index: number) {
  return `column-${index}`
}

export function parseColumnIndex(id: string) {
  const value = Number(id.slice('column-'.length))
  return Number.isInteger(value) ? value : -1
}

export function makeSpreadsheetData(
  rowCount: number,
  columnCount: number,
  seed: number,
): SpreadsheetData {
  faker.seed(seed)

  const columns = makeColumns(columnCount)

  const rows: Array<SpreadsheetRow> = [
    {
      id: `row-${seed}-0`,
      kind: 'field-header',
      cells: columns.map((column) => column.label),
    },
  ]

  for (let rowIndex = 1; rowIndex < rowCount; rowIndex++) {
    const dataIndex = rowIndex - 1
    const startDate = new Date(2025, 0, 1 + (dataIndex % 330))
    const dueDate = new Date(startDate)
    dueDate.setDate(dueDate.getDate() + 14 + (dataIndex % 90))

    const seededValues: Array<CellValue> = [
      faker.company.name(),
      faker.person.fullName(),
      regions[dataIndex % regions.length],
      statuses[dataIndex % statuses.length],
      25_000 + ((dataIndex * 7_919) % 975_000),
      10 + ((dataIndex * 37) % 5_000),
      Math.round((8 + ((dataIndex * 17) % 62)) * 10) / 10,
      toIsoDate(startDate),
      toIsoDate(dueDate),
      priorities[dataIndex % priorities.length],
      dataIndex % 5 !== 0,
      dataIndex % 7 === 0 ? 'Follow up next week' : '',
    ]

    const cells = Array.from({ length: columnCount }, (_, columnIndex) => {
      if (columnIndex < seededValues.length) {
        return seededValues[columnIndex]!
      }

      if (columnIndex % 3 === 0) {
        return `Item ${dataIndex + 1}-${columnIndex + 1}`
      }

      return ((dataIndex + 1) * (columnIndex + 3)) % 10_000
    })

    rows.push({
      id: `row-${seed}-${rowIndex}`,
      kind: 'data',
      cells,
    })
  }

  return { columns, rows }
}

export function makeBlankSpreadsheetData(
  rowCount: number,
  columnCount: number,
  seed: number,
): SpreadsheetData {
  const columns = makeColumns(columnCount)
  const rows = Array.from({ length: rowCount }, (_, rowIndex) => ({
    id: `row-${seed}-${rowIndex}`,
    kind: rowIndex === 0 ? ('field-header' as const) : ('data' as const),
    cells:
      rowIndex === 0
        ? columns.map((column) => column.label)
        : Array<CellValue>(columnCount).fill(null),
  }))

  return { columns, rows }
}

function makeColumns(columnCount: number) {
  return Array.from({ length: columnCount }, (_, index) => {
    const seeded = seededColumnDefinitions.at(index)
    return {
      id: columnId(index),
      index,
      letter: columnIndexToLetter(index),
      label: seeded?.label ?? `Field ${index + 1}`,
      initialType: seeded?.type ?? (index % 3 === 0 ? 'text' : 'number'),
    } satisfies SpreadsheetColumnMeta
  })
}

function toIsoDate(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function formatCellValue(value: CellValue) {
  if (value == null) return ''
  if (typeof value === 'boolean') return value ? 'TRUE' : 'FALSE'
  return String(value)
}

export function parseInputValue(value: string): CellValue {
  const trimmed = value.trim()

  if (!trimmed) return null
  if (/^(true|false)$/i.test(trimmed)) return trimmed.toLowerCase() === 'true'
  if (/^[+-]?(?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?$/i.test(trimmed)) {
    const number = Number(trimmed)
    if (Number.isFinite(number)) return number
  }

  return value
}

export function cellValuesEqual(left: CellValue, right: CellValue) {
  return Object.is(left, right)
}

export function escapeTsvValue(value: CellValue) {
  const text = formatCellValue(value)
  const safeText =
    typeof value === 'string' && /^[\t\r ]*[=+@-]/.test(value)
      ? `'${text}`
      : text

  return /["\t\n\r]/.test(safeText)
    ? `"${safeText.replace(/"/g, '""')}"`
    : safeText
}

export function serializeTsv(ranges: Array<Array<Array<unknown>>>) {
  return ranges
    .map((range) =>
      range
        .map((row) =>
          row.map((value) => escapeTsvValue(value as CellValue)).join('\t'),
        )
        .join('\n'),
    )
    .join('\n\n')
}

export function parseTsv(text: string): Array<Array<string>> {
  const rows: Array<Array<string>> = [[]]
  let value = ''
  let quoted = false

  for (let index = 0; index < text.length; index++) {
    const character = text[index]

    if (quoted) {
      if (character === '"' && text[index + 1] === '"') {
        value += '"'
        index++
      } else if (character === '"') {
        quoted = false
      } else {
        value += character
      }
      continue
    }

    if (character === '"' && value.length === 0) {
      quoted = true
    } else if (character === '\t') {
      rows[rows.length - 1].push(value)
      value = ''
    } else if (character === '\n') {
      rows[rows.length - 1].push(value)
      rows.push([])
      value = ''
    } else if (character !== '\r') {
      value += character
    }
  }

  rows[rows.length - 1].push(value)

  if (
    rows.length > 1 &&
    rows[rows.length - 1].length === 1 &&
    rows[rows.length - 1][0] === ''
  ) {
    rows.pop()
  }

  return rows.length ? rows : [['']]
}

export function getFillPreview(
  source: GridBounds,
  hover: GridCoordinate,
): FillPreview | null {
  const rowDistance =
    hover.rowIndex < source.minRowIndex
      ? hover.rowIndex - source.minRowIndex
      : hover.rowIndex > source.maxRowIndex
        ? hover.rowIndex - source.maxRowIndex
        : 0
  const columnDistance =
    hover.columnIndex < source.minColumnIndex
      ? hover.columnIndex - source.minColumnIndex
      : hover.columnIndex > source.maxColumnIndex
        ? hover.columnIndex - source.maxColumnIndex
        : 0

  if (rowDistance === 0 && columnDistance === 0) return null

  if (Math.abs(rowDistance) >= Math.abs(columnDistance) && rowDistance !== 0) {
    if (rowDistance < 0) {
      const destination = {
        minRowIndex: hover.rowIndex,
        maxRowIndex: source.minRowIndex - 1,
        minColumnIndex: source.minColumnIndex,
        maxColumnIndex: source.maxColumnIndex,
      }
      return {
        direction: 'up',
        destination,
        expanded: { ...source, minRowIndex: hover.rowIndex },
      }
    }

    const destination = {
      minRowIndex: source.maxRowIndex + 1,
      maxRowIndex: hover.rowIndex,
      minColumnIndex: source.minColumnIndex,
      maxColumnIndex: source.maxColumnIndex,
    }
    return {
      direction: 'down',
      destination,
      expanded: { ...source, maxRowIndex: hover.rowIndex },
    }
  }

  if (columnDistance < 0) {
    const destination = {
      minRowIndex: source.minRowIndex,
      maxRowIndex: source.maxRowIndex,
      minColumnIndex: hover.columnIndex,
      maxColumnIndex: source.minColumnIndex - 1,
    }
    return {
      direction: 'left',
      destination,
      expanded: { ...source, minColumnIndex: hover.columnIndex },
    }
  }

  const destination = {
    minRowIndex: source.minRowIndex,
    maxRowIndex: source.maxRowIndex,
    minColumnIndex: source.maxColumnIndex + 1,
    maxColumnIndex: hover.columnIndex,
  }
  return {
    direction: 'right',
    destination,
    expanded: { ...source, maxColumnIndex: hover.columnIndex },
  }
}

export function buildFillPatches(options: {
  source: GridBounds
  preview: FillPreview
  rowIds: Array<string>
  columnIds: Array<string>
  getValue: (rowId: string, columnId: string) => CellValue
}): Array<CellPatch> {
  const { source, preview, rowIds, columnIds, getValue } = options
  const patches: Array<CellPatch> = []
  const vertical = preview.direction === 'up' || preview.direction === 'down'

  for (
    let rowIndex = preview.destination.minRowIndex;
    rowIndex <= preview.destination.maxRowIndex;
    rowIndex++
  ) {
    const rowId = rowIds[rowIndex]
    if (!rowId) continue

    for (
      let columnIndex = preview.destination.minColumnIndex;
      columnIndex <= preview.destination.maxColumnIndex;
      columnIndex++
    ) {
      const destinationColumnId = columnIds[columnIndex]
      if (!destinationColumnId) continue

      const sourceValues = vertical
        ? range(source.minRowIndex, source.maxRowIndex).map(
            (sourceRowIndex) => {
              const sourceRowId = rowIds[sourceRowIndex]
              return getValue(sourceRowId, destinationColumnId)
            },
          )
        : range(source.minColumnIndex, source.maxColumnIndex).map(
            (sourceColumnIndex) => {
              const sourceColumnId = columnIds[sourceColumnIndex]
              return getValue(rowId, sourceColumnId)
            },
          )

      const after = getFilledValue({
        sourceValues,
        sourceStart: vertical ? source.minRowIndex : source.minColumnIndex,
        sourceEnd: vertical ? source.maxRowIndex : source.maxColumnIndex,
        destinationIndex: vertical ? rowIndex : columnIndex,
      })
      const before = getValue(rowId, destinationColumnId)

      if (!cellValuesEqual(before, after)) {
        patches.push({
          rowId,
          columnId: destinationColumnId,
          before,
          after,
        })
      }
    }
  }

  return patches
}

function range(start: number, end: number) {
  return Array.from({ length: end - start + 1 }, (_, index) => start + index)
}

function getFilledValue(options: {
  sourceValues: Array<CellValue>
  sourceStart: number
  sourceEnd: number
  destinationIndex: number
}): CellValue {
  const { sourceValues, sourceStart, sourceEnd, destinationIndex } = options
  const sequence = inferSequence(sourceValues)

  if (sequence) {
    const offset =
      destinationIndex > sourceEnd
        ? destinationIndex - sourceEnd
        : destinationIndex - sourceStart
    const base =
      destinationIndex > sourceEnd
        ? sourceValues[sourceValues.length - 1]!
        : sourceValues[0]!

    if (sequence.type === 'number') {
      return (base as number) + sequence.step * offset
    }

    const date = parseIsoDate(base as string)!
    date.setUTCDate(date.getUTCDate() + sequence.step * offset)
    return date.toISOString().slice(0, 10)
  }

  return sourceValues[
    positiveModulo(destinationIndex - sourceStart, sourceValues.length)
  ]!
}

function inferSequence(values: Array<CellValue>) {
  if (values.length < 2 || values.some((value) => value == null)) return null

  if (values.every((value) => typeof value === 'number')) {
    const numbers = values
    const step = numbers[1] - numbers[0]
    if (
      Number.isFinite(step) &&
      numbers.every(
        (number, index) =>
          index === 0 || Math.abs(number - numbers[index - 1] - step) < 1e-9,
      )
    ) {
      return { type: 'number' as const, step }
    }
  }

  const dates = values.map((value) =>
    typeof value === 'string' ? parseIsoDate(value) : null,
  )
  if (dates.every((date): date is Date => date != null)) {
    const day = 86_400_000
    const step = (dates[1].getTime() - dates[0].getTime()) / day
    if (
      Number.isInteger(step) &&
      dates.every(
        (date, index) =>
          index === 0 ||
          (date.getTime() - dates[index - 1].getTime()) / day === step,
      )
    ) {
      return { type: 'date' as const, step }
    }
  }

  return null
}

function parseIsoDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null
  const date = new Date(`${value}T00:00:00.000Z`)
  return Number.isNaN(date.getTime()) ||
    date.toISOString().slice(0, 10) !== value
    ? null
    : date
}

function positiveModulo(value: number, divisor: number) {
  return ((value % divisor) + divisor) % divisor
}
