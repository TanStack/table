import { spawnSync } from 'node:child_process'

const args = process.argv.slice(2)
const affected = args.includes('--affected')
// Each task owns a Vite server and Chromium. The general Nx default (5) is
// too expensive for the four-core CI runner, especially for 200K-row examples.
const result = spawnSync(
  'nx',
  [
    affected ? 'affected' : 'run-many',
    '--target=test:e2e',
    '--parallel=2',
    ...args.filter((arg) => arg !== '--affected'),
  ],
  { stdio: 'inherit', env: process.env },
)

if (result.error) console.error(result.error)
process.exit(result.status ?? 1)
