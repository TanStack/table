export type Person = {
  id: string
  firstName: string
  lastName: string
  age: number
  visits: number
  status: string
  progress: number
}

export type Product = {
  id: string
  name: string
  category: string
  price: number
  stock: number
  rating: number
}

const firstNames = ['Tanner', 'Tandy', 'Joe', 'Kevin', 'Alicia', 'Morgan']
const lastNames = ['Linsley', 'Miller', 'Dirte', 'Vandy', 'Cole', 'West']
const statuses = ['Single', 'Complicated', 'In Relationship']
const productNames = ['Desk Lamp', 'Notebook', 'Chair', 'Monitor', 'Keyboard']
const categories = ['Office', 'Electronics', 'Accessories']

function pick<T>(values: Array<T>, index: number) {
  return values[index % values.length]
}

export function makeData(length: number): Array<Person> {
  return Array.from({ length }, (_, index) => ({
    id: `person_${index}`,
    firstName: pick(firstNames, index),
    lastName: pick(lastNames, index * 2),
    age: 20 + (index % 35),
    visits: 10 + ((index * 17) % 150),
    status: pick(statuses, index),
    progress: (index * 13) % 100,
  }))
}

export function makeProductData(length: number): Array<Product> {
  return Array.from({ length }, (_, index) => ({
    id: `product_${index}`,
    name: `${pick(productNames, index)} ${index + 1}`,
    category: pick(categories, index),
    price: 10 + ((index * 7) % 90),
    stock: 1 + ((index * 11) % 40),
    rating: 40 + ((index * 9) % 60),
  }))
}
