import { faker } from '@faker-js/faker'

export type Sale = {
  category: string
  item: string
  amount: number
  score: number
}

const categories = ['Hardware', 'Software', 'Services'] as const

const newSale = (): Sale => ({
  category: faker.helpers.arrayElement(categories),
  item: faker.commerce.productName(),
  amount: faker.number.int({ min: 25, max: 5_000 }),
  score: faker.number.int({ min: 60, max: 100 }),
})

export function makeData(length: number): Array<Sale> {
  return Array.from({ length }, newSale)
}
