import { faker } from '@faker-js/faker'

const statuses = ['active', 'inactive', 'pending'] as const
const departments = [
  'engineering',
  'marketing',
  'finance',
  'sales',
  'hr',
] as const

export interface Person {
  id: string
  firstName: string
  lastName: string
  age: number
  email: string
  status: (typeof statuses)[number]
  department: (typeof departments)[number]
  joinDate: Date
  subRows?: Array<Person>
}

function range(len: number) {
  const arr: Array<number> = []
  for (let i = 0; i < len; i++) {
    arr.push(i)
  }
  return arr
}

function newPerson(): Person {
  return {
    id: faker.string.uuid(),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    age: faker.number.int({ min: 20, max: 65 }),
    email: faker.internet.email(),
    status: faker.helpers.arrayElement(statuses),
    department: faker.helpers.arrayElement(departments),
    joinDate: faker.date.past({ years: 5 }),
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
