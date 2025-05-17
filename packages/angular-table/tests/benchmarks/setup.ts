import { injectTable, stockFeatures } from '../../src'
import type { ColumnDef } from '../../src'

export function createData(size: number) {
  return Array.from({ length: size }, (_, index) => ({
    id: index,
    title: `title-${index}`,
    name: `name-${index}`,
  }))
}

export const columns: Array<ColumnDef<typeof stockFeatures, any>> = [
  { id: 'col1' },
  { id: 'col2' },
  { id: 'col3' },
  { id: 'col4' },
  { id: 'col5' },
  { id: 'col6' },
  { id: 'col7' },
]

export function createTestTable(
  enableGranularReactivity: boolean,
  data: Array<any>,
  columns: Array<any>,
) {
  return injectTable(() => ({
    _features: stockFeatures,
    columns: columns,
    data,
    reactivity: {
      table: enableGranularReactivity,
      row: enableGranularReactivity,
      column: enableGranularReactivity,
      cell: enableGranularReactivity,
      header: enableGranularReactivity,
    },
  }))
}

export const benchCases = [
  { size: 100, max: 5, threshold: 10 },
  { size: 1000, max: 25, threshold: 50 },
  { size: 2000, max: 50, threshold: 100 },
  { size: 5000, max: 100, threshold: 500 },
  { size: 10_000, max: 200, threshold: 1000 },
  { size: 25_000, max: 500, threshold: 1000 },
  { size: 50_000, max: 1500, threshold: 1000 },
  { size: 100_000, max: 2000, threshold: 1500 },
]

console.log('Seeding data...')

export const dataMap = {} as Record<number, Array<any>>

for (const benchCase of benchCases) {
  dataMap[benchCase.size] = createData(benchCase.size)
}

console.log('Seed data completed')
