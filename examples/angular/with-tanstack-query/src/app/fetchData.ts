import { faker } from '@faker-js/faker'

export type Person = {
  firstName: string
  lastName: string
  age: number
  visits: number
  progress: number
  status: 'relationship' | 'complicated' | 'single'
  subRows?: Array<Person>
}

const range = (len: number) => {
  const arr: Array<number> = []
  for (let i = 0; i < len; i++) {
    arr.push(i)
  }
  return arr
}

const newPerson = (): Person => {
  return {
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
  const makeDataLevel = (depth = 0): Array<Person> => {
    const len = lens[depth]
    return range(len).map((_d): Person => {
      return {
        ...newPerson(),
        subRows: lens[depth + 1] ? makeDataLevel(depth + 1) : undefined,
      }
    })
  }

  return makeDataLevel()
}

const data = makeData(10000)

const searchableFields = [
  'firstName',
  'lastName',
  'age',
  'visits',
  'progress',
  'status',
] as const

type SearchableField = (typeof searchableFields)[number]

export type DataQuery = {
  pagination: {
    pageIndex: number
    pageSize: number
  }
  sorting: Array<{ id: string; desc: boolean }>
  globalFilter: string
}

function isSearchableField(value: string): value is SearchableField {
  return searchableFields.some((field) => field === value)
}

export async function fetchData(options: DataQuery) {
  // Simulate some network latency
  await new Promise((r) => setTimeout(r, 500))

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

    return 0
  })

  const { pageIndex, pageSize } = options.pagination

  return {
    rows: sortedData.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize),
    pageCount: Math.ceil(sortedData.length / pageSize),
    rowCount: sortedData.length,
  }
}
