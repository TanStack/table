import { spawnSync } from 'node:child_process'

const nxArgs = ['run-many', '--target=test:e2e', ...process.argv.slice(2)]

function runE2e(label) {
  if (label) {
    console.log(`\n${label}\n`)
  }

  return spawnSync('nx', nxArgs, {
    stdio: 'inherit',
    env: process.env,
  })
}

const first = runE2e()
if (first.status === 0) {
  process.exit(0)
}

const second = runE2e(
  'Some e2e projects failed. Retrying failed projects once (successful runs use Nx cache)...',
)

process.exit(second.status ?? 1)
