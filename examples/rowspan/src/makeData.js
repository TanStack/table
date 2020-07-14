import namor from 'namor'

const range = len => {
  const arr = []
  for (let i = 0; i < len; i++) {
    arr.push(i)
  }
  return arr
}

const newPerson = () => {
  const statusChance1 = Math.random()
  const statusChance2 = Math.random()
  const statusChance3 = Math.random()

  return {
    first:
      statusChance1 > 0.75
      ? 'John'
      : statusChance1 > 0.5
      ? 'Jenna'
      : statusChance1 > 0.25
      ? 'Don'
      : 'Chloe',
    middle: 
      statusChance2 > 0.75
      ? 'Thomas'
      : statusChance2 > 0.5
      ? 'Billy'
      : statusChance2 > 0.25
      ? 'Emily'
      : 'Madeline',
    last: 
      statusChance3 > 0.75
      ? 'Smith'
      : statusChance3 > 0.5
      ? 'Albert'
      : statusChance3 > 0.25
      ? 'Woodward'
      : 'Draper',
  }
}

export default function makeData(...lens) {
  const makeDataLevel = (depth = 0) => {
    const len = lens[depth]
    return range(len).map(d => {
      return {
        ...newPerson(),
        subRows: lens[depth + 1] ? makeDataLevel(depth + 1) : undefined,
      }
    })
  }

  return makeDataLevel()
}
