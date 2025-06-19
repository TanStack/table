const range = len => {
  const arr = []
  for (let i = 0; i < len; i++) {
    arr.push(i)
  }
  return arr
}

const newPerson = (depth, index, total) => {
  const age = (depth + 1) * (index + 1)
  const visits = age * 10
  const progress = (index + 1) / total

  return {
    firstName: `${depth} ${index} firstName`,
    lastName: `${depth} ${index} lastName`,
    age,
    visits,
    progress,
    status:
      progress > 0.66
        ? 'relationship'
        : progress > 0.33
        ? 'complicated'
        : 'single',
  }
}

export default function makeTestData(...lens) {
  const makeDataLevel = (depth = 0) => {
    const len = lens[depth]
    return range(len).map(d => {
      return {
        ...newPerson(depth, d, len),
        subRows: lens[depth + 1] ? makeDataLevel(depth + 1) : undefined,
      }
    })
  }

  return makeDataLevel()
}
