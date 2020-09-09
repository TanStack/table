const skewLow = n => (n < 0.9 ? n / 2 : n)

const sample = items => {
  const length = items.length
  const rand = Math.floor(skewLow(Math.random() * length))
  return items[rand]
}

const reps = [
  'Jones',
  'Kivell',
  'Jardine',
  'Gill',
  'Sorvino',
  'Andrews',
  'Thompson',
  'Morgan',
  'Howard',
  'Parent',
  'Smith',
]

const regions = ['East', 'Central', 'West', 'International']

const items = [
  ['Pencil', 1.99, 100],
  ['Binder', 19.99, 1, 50],
  ['Pen', 7.99, 1, 100],
  ['Desk', 299.99, 1, 10],
  ['Notebook', 10.99, 1, 30],
]

const dates = [
  '1/6/2018',
  '1/23/2018',
  '2/9/2018',
  '2/26/2018',
  '3/15/2018',
  '4/1/2018',
  '4/18/2018',
  '5/5/2018',
  '5/22/2018',
  '6/8/2018',
  '6/25/2018',
  '7/12/2018',
  '7/29/2018',
  '8/15/2018',
  '9/1/2018',
  '9/18/2018',
  '10/5/2018',
  '10/22/2018',
  '11/8/2018',
  '11/25/2018',
  '12/12/2018',
  '12/29/2018',
  '1/15/2019',
  '2/1/2019',
  '2/18/2019',
  '3/7/2019',
  '3/24/2019',
  '4/10/2019',
  '4/27/2019',
  '5/14/2019',
  '5/31/2019',
  '6/17/2019',
  '7/4/2019',
  '7/21/2019',
  '8/7/2019',
  '8/24/2019',
  '9/10/2019',
  '9/27/2019',
  '10/14/2019',
  '10/31/2019',
  '11/17/2019',
  '12/4/2019',
  '12/21/2019',
]

export default function makeData() {
  return Array.from(new Array(10000)).map(() => {
    const [item, unitCost, stock] = sample(items)
    const units = Math.ceil(skewLow(Math.random()) * stock)
    const total = units * unitCost

    return {
      date: sample(dates),
      rep: sample(reps),
      region: sample(regions),
      item,
      unitCost,
      units,
      total,
    }
  })
}
