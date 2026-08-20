import { faker } from '@faker-js/faker'

export type Person = Record<string, string>

export const makeColumns = (num: number) =>
  [...Array(num)].map((_, i) => {
    return {
      accessorKey: i.toString(),
      header: 'Column ' + i.toString(),
      size: Math.floor(Math.random() * 150) + 100,
    }
  })

export const makeData = (num: number, columns: Array<unknown>): Array<Person> =>
  [...Array(num)].map(() => ({
    ...Object.fromEntries(
      columns.map((col) => [
        (col as { accessorKey?: string }).accessorKey,
        faker.person.firstName(),
      ]),
    ),
  }))
