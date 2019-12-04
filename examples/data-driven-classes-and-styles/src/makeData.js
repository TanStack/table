import namor from 'namor'

const range = len => {
  const arr = []
  for (let i = 0; i < len; i++) {
    arr.push(i)
  }
  return arr
}

const newPerson = () => {
  return {
    firstName: namor.generate({ words: 1, numbers: 0 }),
    score0: Math.floor(Math.random() * 100),
    score1: Math.floor(Math.random() * 100),
    score2: Math.floor(Math.random() * 100),
    score3: Math.floor(Math.random() * 100),
    score4: Math.floor(Math.random() * 100),
    score5: Math.floor(Math.random() * 100),
    score6: Math.floor(Math.random() * 100),
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
