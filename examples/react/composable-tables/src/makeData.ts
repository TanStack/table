import { faker } from '@faker-js/faker'

export type Person = {
  firstName: string
  lastName: string
  age: number
  visits: number
  progress: number
  status: 'relationship' | 'complicated' | 'single'
  subRows?: Array<Person>
}

export type Product = {
  id: string
  name: string
  category: 'electronics' | 'clothing' | 'food' | 'books'
  price: number
  stock: number
  rating: number
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
    age: faker.number.int(40),
    visits: faker.number.int(1000),
    progress: faker.number.int(100),
    status: faker.helpers.shuffle<Person['status']>([
      'relationship',
      'complicated',
      'single',
    ])[0],
  }
}

const newProduct = (): Product => {
  return {
    id: faker.string.uuid(),
    name: faker.commerce.productName(),
    category: faker.helpers.shuffle<Product['category']>([
      'electronics',
      'clothing',
      'food',
      'books',
    ])[0],
    price: parseFloat(faker.commerce.price({ min: 5, max: 500 })),
    stock: faker.number.int({ min: 0, max: 200 }),
    rating: faker.number.int({ min: 0, max: 100 }),
  }
}

export function makeData(...lens: Array<number>) {
  const makeDataLevel = (depth = 0): Array<Person> => {
    const len = lens[depth]
    return range(len).map((): Person => {
      return {
        ...newPerson(),
        subRows: lens[depth + 1] ? makeDataLevel(depth + 1) : undefined,
      }
    })
  }

  return makeDataLevel()
}

export function makeProductData(count: number): Array<Product> {
  return range(count).map(() => newProduct())
}
