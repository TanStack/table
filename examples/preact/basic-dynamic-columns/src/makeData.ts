import { faker } from '@faker-js/faker'

// The example never references these keys statically. It's typed here only so the
// generated data has a realistic mix of value types (string, enum, number, boolean,
// Date) for the dynamic column-building logic to detect at runtime.
type Person = {
  firstName: string
  lastName: string
  status: 'relationship' | 'complicated' | 'single'
  age: number
  visits: number
  progress: number
  isActive: boolean
  createdAt: Date
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
    status: faker.helpers.shuffle<Person['status']>([
      'relationship',
      'complicated',
      'single',
    ])[0],
    age: faker.number.int(40),
    visits: faker.number.int(1000),
    progress: faker.number.int(100),
    isActive: faker.datatype.boolean(),
    createdAt: faker.date.past({ years: 5 }),
  }
}

export function makeData(count: number) {
  return range(count).map(newPerson)
}
