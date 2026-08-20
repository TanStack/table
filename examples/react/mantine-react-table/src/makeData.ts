import { faker } from '@faker-js/faker'

export type Person = {
  id: string
  firstName: string
  lastName: string
  email: string
  age: number
  jobTitle: string
  city: string
  state: string
  salary: number
  status: 'active' | 'inactive' | 'pending'
  startDate: Date
  subRows?: Array<Person>
}

const STATUSES: Array<Person['status']> = ['active', 'inactive', 'pending']

const newPerson = (): Person => {
  const sex = faker.person.sex() as 'female' | 'male'
  const firstName = faker.person.firstName(sex)
  const lastName = faker.person.lastName()
  return {
    id: faker.string.uuid(),
    firstName,
    lastName,
    email: faker.internet
      .email({ firstName, lastName, provider: 'example.com' })
      .toLowerCase(),
    age: faker.number.int({ min: 18, max: 75 }),
    jobTitle: faker.person.jobTitle(),
    city: faker.location.city(),
    state: faker.location.state({ abbreviated: true }),
    salary: faker.number.int({ min: 35_000, max: 250_000 }),
    status: faker.helpers.arrayElement(STATUSES),
    startDate: faker.date.past({ years: 8 }),
  }
}

export function makeData(...lens: Array<number>): Array<Person> {
  const makeDataLevel = (depth = 0): Array<Person> => {
    const len = lens[depth]
    return Array.from({ length: len }, (): Person => {
      return {
        ...newPerson(),
        subRows: lens[depth + 1] ? makeDataLevel(depth + 1) : undefined,
      }
    })
  }
  return makeDataLevel()
}
