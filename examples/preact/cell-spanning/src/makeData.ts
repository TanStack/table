import { faker } from '@faker-js/faker'

export type ShiftStatus = 'Approved' | 'Pending' | 'Rejected'

export type Shift = {
  id: string
  region: 'North' | 'South' | 'East' | 'West'
  team: string
  shift: 'Morning' | 'Evening' | 'Night'
  employee: string
  hours: number
  status: ShiftStatus
}

const REGIONS: Array<Shift['region']> = ['North', 'South', 'East', 'West']
const TEAMS = ['Alpha', 'Bravo', 'Charlie']
const SHIFTS: Array<Shift['shift']> = ['Morning', 'Evening', 'Night']
const STATUSES: Array<ShiftStatus> = ['Approved', 'Pending', 'Rejected']

/**
 * Rows are emitted region-major, then team, then shift, so equal values are
 * already adjacent. Value-based row spanning only merges adjacent rows, so a
 * per-row random generator would produce a table with no merges at all until
 * the user sorted it.
 */
export function makeData(
  regions = REGIONS.length,
  teams = TEAMS.length,
  shifts = SHIFTS.length,
): Array<Shift> {
  const rows: Array<Shift> = []

  for (let r = 0; r < regions; r++) {
    for (let t = 0; t < teams; t++) {
      for (let s = 0; s < shifts; s++) {
        rows.push({
          id: `${r}-${t}-${s}`,
          region: REGIONS[r % REGIONS.length],
          team: TEAMS[t % TEAMS.length],
          shift: SHIFTS[s % SHIFTS.length],
          employee: faker.person.fullName(),
          hours: faker.number.int({ min: 4, max: 12 }),
          status: STATUSES[faker.number.int({ max: 2 })],
        })
      }
    }
  }

  return rows
}

export type SummaryRow = {
  id: string
  kind: 'shift' | 'subtotal'
  label: string
  region: Shift['region'] | ''
  hours: number
}

/**
 * A small fixed dataset for the column-spanning panel: per-region hour
 * subtotals rendered as full-width label rows between the data rows.
 */
export function makeSummaryData(): Array<SummaryRow> {
  const rows: Array<SummaryRow> = []

  for (const region of REGIONS.slice(0, 2)) {
    let total = 0
    for (const team of TEAMS) {
      const hours = faker.number.int({ min: 8, max: 40 })
      total += hours
      rows.push({
        id: `${region}-${team}`,
        kind: 'shift',
        label: `${region} / ${team}`,
        region,
        hours,
      })
    }
    rows.push({
      id: `${region}-subtotal`,
      kind: 'subtotal',
      label: `${region} total`,
      region: '',
      hours: total,
    })
  }

  return rows
}
