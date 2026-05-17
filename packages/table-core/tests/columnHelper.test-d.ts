import { createColumnHelper } from '../src'

type Expect<T extends true> = T
type Equal<T, U> =
  (<G>() => G extends T ? 1 : 2) extends <G>() => G extends U ? 1 : 2
    ? true
    : false

type Row = {
  user: {
    salary?: {
      amount: number
    }
  }
}

const columnHelper = createColumnHelper<Row>()

columnHelper.accessor('user.salary.amount', {
  cell: (info) => {
    const amount = info.getValue()

    type _ = Expect<Equal<typeof amount, number | undefined>>

    return amount
  },
})
