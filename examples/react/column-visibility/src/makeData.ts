import { faker } from '@faker-js/faker'

export type Person = {
  a: string
  b: string
  c: string
  d: string
  e: string
  f: string
  g: string
  h: string
  i: string
  j: string
}

const range = (len: number) => {
  const arr = []
  for (let i = 0; i < len; i++) {
    arr.push(i)
  }
  return arr
}

const newPerson = (): Person => {
  return {
    a: faker.name.firstName(),
    b: faker.name.lastName(),
    c: faker.name.lastName(),
    d: faker.name.lastName(),
    e: faker.name.lastName(),
    f: faker.name.lastName(),
    g: faker.name.lastName(),
    h: faker.name.lastName(),
    i: faker.name.lastName(),
    j: faker.name.lastName(),
  }
}

export function makeData(len: number) {
  return range(len).map((d): Person => {
    return {
      ...newPerson(),
    }
  })
}
