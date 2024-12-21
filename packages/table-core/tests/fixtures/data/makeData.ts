import { faker } from '@faker-js/faker'
import { createArrayOfNumbers } from '../../helpers/testUtils'
import type { Person } from './types'

function createPerson(): Person {
  return {
    id: faker.string.uuid(),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    age: faker.number.int(40),
    visits: faker.number.int(1000),
    progress: faker.number.int(100),
    status: faker.helpers.arrayElement([
      'relationship',
      'complicated',
      'single',
    ]),
  }
}

/**
 * Creates a nested array of test Person objects
 * @param lengths - An array of numbers where each number determines the length of Person arrays at that depth.
 *                 e.g. makeData(3, 2) creates 3 parent rows with 2 sub-rows each
 * @returns An array of Person objects with optional nested subRows based on the provided lengths
 */
export function makeData(...lengths: Array<number>) {
  const makeDataLevel = (depth = 0): Array<Person> => {
    const len = lengths[depth]

    if (!len) return []

    return createArrayOfNumbers(len).map(() => {
      return {
        ...createPerson(),
        subRows: lengths[depth + 1] ? makeDataLevel(depth + 1) : undefined,
      }
    })
  }

  return makeDataLevel()
}
