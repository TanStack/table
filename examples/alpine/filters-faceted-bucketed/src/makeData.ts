import { faker } from '@faker-js/faker'

export type Account = {
  name: string
  lastLogin: Date
  storageBytes: number
  files: number
}

export const dataReferenceDate = new Date()

const newAccount = (): Account => {
  const ageInDays = faker.number.float({ min: 0, max: 1 }) ** 2 * 400
  const storageInGb = 0.05 * 10 ** faker.number.float({ min: 0, max: 4 })

  return {
    name: faker.person.fullName(),
    lastLogin: new Date(
      dataReferenceDate.getTime() - ageInDays * 24 * 60 * 60 * 1000,
    ),
    storageBytes: storageInGb * 1024 ** 3,
    files: faker.number.int({ max: 50_000 }),
  }
}

export function makeData(len: number): Array<Account> {
  return Array.from({ length: len }, newAccount)
}
