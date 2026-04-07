import { faker } from '@faker-js/faker'

export const makeColumns = (num: number) =>
  [...Array(num)].map((_, i) => ({
    accessorKey: i.toString(),
    header: 'Column ' + i.toString(),
    size: Math.floor(Math.random() * 150) + 100,
  }))

export const makeData = (num: number, columns: Array<any>) =>
  [...Array(num)].map(() => ({
    ...Object.fromEntries(
      columns.map((col: any) => [col.accessorKey, faker.person.firstName()]),
    ),
  }))

export type Person = ReturnType<typeof makeData>[0]
