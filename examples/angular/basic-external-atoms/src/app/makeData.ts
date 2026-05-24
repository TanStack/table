import { faker } from '@faker-js/faker'

export type Person = {
  firstName: string
  lastName: string
  age: number
  visits: number
  status: 'relationship' | 'complicated' | 'single'
  progress: number
}

const range = (len: number) => Array.from({ length: len }, (_, index) => index)

const newPerson = (): Person => ({
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  age: faker.number.int(40),
  visits: faker.number.int(1000),
  status: faker.helpers.arrayElement(['relationship', 'complicated', 'single']),
  progress: faker.number.int(100),
})

export function makeData(len: number): Array<Person> {
  return range(len).map(() => newPerson())
}
