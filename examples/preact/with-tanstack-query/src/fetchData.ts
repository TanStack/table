import { faker } from '@faker-js/faker'

export type Person = {
  id: number
  firstName: string
  lastName: string
  age: number
  visits: number
  progress: number
  status: 'relationship' | 'complicated' | 'single'
}

const range = (len: number) => {
  const arr: Array<number> = []
  for (let i = 0; i < len; i++) {
    arr.push(i)
  }
  return arr
}

const newPerson = (id: number): Person => {
  return {
    id,
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    age: faker.number.int(40),
    visits: faker.number.int(1000),
    progress: faker.number.int(100),
    status: faker.helpers.shuffle<Person['status']>([
      'relationship',
      'complicated',
      'single',
    ])[0],
  }
}

export function makeData(...lens: Array<number>) {
  return range(lens[0]).map((index) => newPerson(index + 1))
}

const data = makeData(10000)

const searchableFields = [
  'id',
  'firstName',
  'lastName',
  'age',
  'visits',
  'progress',
  'status',
] as const

type SearchableField = (typeof searchableFields)[number]

type BaseDataQuery = {
  sorting: Array<{ id: string; desc: boolean }>
  globalFilter: string
}

export type DataQuery = BaseDataQuery & {
  pagination: {
    pageIndex: number
    pageSize: number
  }
}

export type InfiniteDataQuery = BaseDataQuery & {
  cursor: number | null
  pageSize: number
}

export type InfiniteDataPage = {
  rows: Array<Person>
  nextCursor: number | undefined
  hasNextPage: boolean
}

function isSearchableField(value: string): value is SearchableField {
  return searchableFields.some((field) => field === value)
}

function getFilteredAndSortedData(options: BaseDataQuery) {
  const search = options.globalFilter.trim().toLowerCase()
  const filteredData = search
    ? data.filter((person) =>
        searchableFields.some((field) =>
          String(person[field]).toLowerCase().includes(search),
        ),
      )
    : data

  const sortedData = [...filteredData].sort((rowA, rowB) => {
    for (const sort of options.sorting) {
      if (!isSearchableField(sort.id)) continue

      const valueA = rowA[sort.id]
      const valueB = rowB[sort.id]
      const comparison =
        typeof valueA === 'number' && typeof valueB === 'number'
          ? valueA - valueB
          : String(valueA).localeCompare(String(valueB))

      if (comparison !== 0) return sort.desc ? -comparison : comparison
    }

    return rowA.id - rowB.id
  })

  return sortedData
}

export async function fetchData(options: DataQuery) {
  // Simulate some network latency
  await new Promise((r) => setTimeout(r, 500))

  const sortedData = getFilteredAndSortedData(options)
  const { pageIndex, pageSize } = options.pagination
  const pageStart = pageSize === Infinity ? 0 : pageIndex * pageSize

  return {
    rows: sortedData.slice(pageStart, pageStart + pageSize),
    rowCount: sortedData.length,
  }
}

export async function fetchInfiniteData(
  options: InfiniteDataQuery,
): Promise<InfiniteDataPage> {
  // Simulate some network latency
  await new Promise((r) => setTimeout(r, 500))

  const sortedData = getFilteredAndSortedData(options)

  const cursorIndex =
    options.cursor === null
      ? -1
      : sortedData.findIndex((person) => person.id === options.cursor)

  if (options.cursor !== null && cursorIndex === -1) {
    throw new Error(`Unknown cursor: ${options.cursor}`)
  }

  const start = cursorIndex + 1
  const rows = sortedData.slice(start, start + options.pageSize)
  const hasNextPage = start + rows.length < sortedData.length

  return {
    rows,
    // A production API would usually make this cursor opaque. Since the demo
    // data is static and IDs are unique, the last row ID is a sufficient token.
    nextCursor: hasNextPage ? rows.at(-1)?.id : undefined,
    hasNextPage,
  }
}
