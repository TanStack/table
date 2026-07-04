export interface Person {
  firstName: string
  lastName: string
  age: number
  visits: number
  progress: number
  status: string
}

const names = [
  'Alice',
  'Bob',
  'Charlie',
  'David',
  'Eva',
  'Frank',
  'Grace',
  'Hannah',
  'Ian',
  'Jane',
]
const lastNames = [
  'Smith',
  'Johnson',
  'Williams',
  'Brown',
  'Jones',
  'Miller',
  'Davis',
  'Garcia',
  'Rodriguez',
  'Wilson',
]
const statuses = ['relationship', 'complicated', 'single']

export function makeData(count: number): Person[] {
  return Array.from({ length: count }, (_, i) => ({
    firstName: names[Math.floor(Math.random() * names.length)]!,
    lastName: lastNames[Math.floor(Math.random() * lastNames.length)]!,
    age: Math.floor(Math.random() * 40) + 20,
    visits: Math.floor(Math.random() * 100),
    progress: Math.floor(Math.random() * 100),
    status: statuses[Math.floor(Math.random() * statuses.length)]!,
  }))
}
