import { spawnSync } from 'node:child_process'

const args = process.argv.slice(2)
const affected = args.includes('--affected')
// Each task owns a Vite server and Chromium. The general Nx default (5) is
// too expensive for the four-core CI runner, especially for 200K-row examples.
function runE2e() {
  return spawnSync(
    'nx',
    [
      affected ? 'affected' : 'run-many',
      '--target=test:e2e',
      '--parallel=2',
      ...args.filter((arg) => arg !== '--affected' && arg !== '--no-retry'),
    ],
    { stdio: 'inherit', env: process.env },
  )
}
const first = runE2e()
if (first.status === 0) process.exit(0)
if (first.error) console.error(first.error)
if (args.includes('--no-retry')) process.exit(first.status ?? 1)
console.log(
  'Some e2e projects failed. Retrying failed projects once (successful runs use Nx cache)...',
)
const second = runE2e()
if (second.error) console.error(second.error)
process.exit(second.status ?? 1)
