import { faker } from '@faker-js/faker'

// twice the usual example's field count, so there are enough columns to
// meaningfully hide, reorder, and pin while a cell selection is active
export type Person = {
  id: string
  firstName: string
  lastName: string
  age: number
  visits: number
  progress: number
  status: 'relationship' | 'complicated' | 'single'
  email: string
  phone: string
  city: string
  country: string
  department: string
  salary: number
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
    id: faker.string.uuid(),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    age: faker.number.int(40),
    visits: faker.number.int(1000),
    progress: faker.number.int(100),
    status: faker.helpers.shuffle<Person['status']>([
      'relationship',
      'complicated',
      'single',
    ])[0]!,
    email: faker.internet.email(),
    phone: faker.phone.number(),
    city: faker.location.city(),
    country: faker.location.country(),
    department: faker.commerce.department(),
    salary: faker.number.int({ min: 40_000, max: 200_000 }),
  }
}

export function makeData(...lens: Array<number>) {
  const makeDataLevel = (depth = 0): Array<Person> => {
    const len = lens[depth] ?? 0
    return range(len).map((): Person => {
      return {
        ...newPerson(),
        subRows: lens[depth + 1] ? makeDataLevel(depth + 1) : undefined,
      }
    })
  }

  return makeDataLevel()
}
