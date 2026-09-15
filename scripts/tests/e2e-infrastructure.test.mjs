import assert from 'node:assert/strict'
import { spawn, spawnSync } from 'node:child_process'
import { once } from 'node:events'
import {
  mkdtemp,
  mkdir,
  readFile,
  readdir,
  rm,
  writeFile,
} from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { test } from 'node:test'

const root = fileURLToPath(new URL('../../', import.meta.url))
const playwright = path.join(root, 'node_modules/@playwright/test/cli.js')

async function filesBelow(directory) {
  const entries = await readdir(directory, { withFileTypes: true })
  const nested = await Promise.all(
    entries.map((entry) => {
      const filename = path.join(directory, entry.name)
      return entry.isDirectory() ? filesBelow(filename) : [filename]
    }),
  )
  return nested.flat()
}

test(
  'overlapping Playwright processes retain both sets of failure artifacts',
  {
    timeout: 60_000,
  },
  async () => {
    // Keep fixtures inside the workspace so they resolve its Playwright install.
    const parent = path.join(root, '.cache')
    await mkdir(parent, { recursive: true })
    const fixture = await mkdtemp(path.join(parent, 'e2e-artifacts-'))
    const output = path.join(root, 'test-results', path.basename(fixture))
    const marker = path.join(fixture, 'second-started')
    const children = []
    try {
      for (const name of ['first', 'second']) {
        const directory = path.join(fixture, name, 'tests/e2e')
        await mkdir(directory, { recursive: true })
        await writeFile(
          path.join(directory, 'failure.spec.ts'),
          `
        import { test, expect } from '@playwright/test'
        import { existsSync, writeFileSync } from 'node:fs'
        test('intentional failure', async ({ page }) => {
          await page.setContent('<h1>${name}</h1>')
          ${
            name === 'first'
              ? `console.log('FIRST_READY'); await expect.poll(() => existsSync(${JSON.stringify(marker)}), { timeout: 20000 }).toBe(true)`
              : `writeFileSync(${JSON.stringify(marker)}, 'ready')`
          }
          expect('intentional artifact failure').toBe('success')
        })
      `,
        )
      }
      function start(name) {
        const child = spawn(
          process.execPath,
          [
            playwright,
            'test',
            '--config',
            path.join(root, 'playwright.config.ts'),
            '--reporter=line',
            '--retries=0',
          ],
          {
            cwd: root,
            env: {
              ...process.env,
              CI: '1',
              PLAYWRIGHT_TEST_DIR: path.join(fixture, name, 'tests/e2e'),
            },
            stdio: ['ignore', 'pipe', 'pipe'],
          },
        )
        children.push(child)
        let log = ''
        const ready = new Promise((resolve) => {
          child.stdout.on('data', (chunk) => {
            log += chunk
            if (log.includes('FIRST_READY')) resolve(true)
          })
          child.once('close', () => resolve(false))
        })
        child.stderr.on('data', (chunk) => {
          log += chunk
        })
        const done = once(child, 'close').then(([code]) => ({ code, log }))
        return { ready, done }
      }
      const first = start('first')
      if (!(await first.ready)) assert.fail((await first.done).log)
      const second = start('second')
      for (const result of await Promise.all([first.done, second.done])) {
        assert.equal(result.code, 1, result.log)
        assert.match(result.log, /intentional artifact failure/)
        assert.doesNotMatch(result.log, /ENOENT|Retry #/)
      }
      for (const name of ['first', 'second']) {
        const files = await filesBelow(path.join(output, name))
        const trace = files.find((file) => file.endsWith('trace.zip'))
        const screenshot = files.find((file) => file.endsWith('.png'))
        assert.ok(trace, `${name} must retain its first-attempt trace`)
        assert.ok(screenshot, `${name} must retain its screenshot`)
        assert.equal((await readFile(trace)).subarray(0, 2).toString(), 'PK')
      }
    } finally {
      for (const child of children) {
        if (child.exitCode === null) child.kill()
      }
      await rm(fixture, { recursive: true, force: true })
      await rm(output, { recursive: true, force: true })
    }
  },
)

for (const retry of [true, false]) {
  test(`the E2E runner ${retry ? 'retries once by default' : 'supports explicit verification without retries'}`, async () => {
    const parent = path.join(root, '.cache')
    await mkdir(parent, { recursive: true })
    const fixture = await mkdtemp(path.join(parent, 'e2e-runner-'))
    try {
      const calls = path.join(fixture, 'calls.jsonl')
      await writeFile(
        path.join(fixture, 'nx'),
        `#!/usr/bin/env node
      import { appendFileSync } from 'node:fs'
      appendFileSync(${JSON.stringify(calls)}, JSON.stringify(process.argv.slice(2)) + '\\n')
      process.exit(7)
    `,
        { mode: 0o755 },
      )
      const result = spawnSync(
        process.execPath,
        [
          'scripts/run-e2e-with-retry.mjs',
          '--affected',
          '--base=main',
          ...(retry ? [] : ['--no-retry']),
        ],
        {
          cwd: root,
          env: {
            ...process.env,
            PATH: `${fixture}${path.delimiter}${process.env.PATH}`,
          },
          encoding: 'utf8',
        },
      )
      assert.equal(result.status, 7, result.stderr)
      const invocations = (await readFile(calls, 'utf8'))
        .trim()
        .split('\n')
        .map(JSON.parse)
      assert.deepEqual(
        invocations,
        Array.from({ length: retry ? 2 : 1 }, () => [
          'affected',
          '--target=test:e2e',
          '--parallel=2',
          '--base=main',
        ]),
      )
    } finally {
      await rm(fixture, { recursive: true, force: true })
    }
  })
}

test(
  'a failed test cleans up spawned server descendants',
  { timeout: 30_000 },
  async () => {
    const parent = path.join(root, '.cache')
    await mkdir(parent, { recursive: true })
    const fixture = await mkdtemp(path.join(parent, 'e2e-cleanup-'))
    const pidFile = path.join(fixture, 'server.pid')
    let pid
    try {
      await mkdir(path.join(fixture, 'tests/e2e'), { recursive: true })
      await writeFile(
        path.join(fixture, 'package.json'),
        JSON.stringify({ dependencies: { 'ember-source': '*' } }),
      )
      await writeFile(
        path.join(fixture, 'pnpm'),
        `#!/usr/bin/env node
      const { spawn } = require('node:child_process')
      const child = spawn(process.execPath, ['-e', 'setInterval(() => {}, 1000)'], { stdio: 'ignore' })
      require('node:fs').writeFileSync(${JSON.stringify(pidFile)}, String(child.pid))
      console.log('http://127.0.0.1:18999/')
      setInterval(() => {}, 1000)
    `,
        { mode: 0o755 },
      )
      await writeFile(
        path.join(fixture, 'tests/e2e/cleanup.spec.ts'),
        `
      import { test } from '@playwright/test'
      import { startExampleServer } from ${JSON.stringify(path.join(root, 'tests/e2e/helpers/startExampleServer.ts'))}
      let server
      test.afterAll(async () => { await server?.close(); await server?.close() })
      test('fails before caller reaches cleanup', async () => {
        server = await startExampleServer(${JSON.stringify(fixture)})
        throw new Error('intentional navigation failure')
      })
    `,
      )
      const child = spawn(
        process.execPath,
        [
          playwright,
          'test',
          '--config',
          path.join(root, 'playwright.config.ts'),
        ],
        {
          cwd: fixture,
          env: {
            ...process.env,
            PLAYWRIGHT_TEST_DIR: path.join(fixture, 'tests/e2e'),
            PATH: `${fixture}${path.delimiter}${process.env.PATH}`,
          },
          stdio: ['ignore', 'pipe', 'pipe'],
        },
      )
      let log = ''
      child.stdout.on('data', (chunk) => {
        log += chunk
      })
      child.stderr.on('data', (chunk) => {
        log += chunk
      })
      const [code] = await once(child, 'close')
      assert.equal(code, 1, log)
      assert.match(log, /intentional navigation failure/)
      pid = Number(await readFile(pidFile, 'utf8'))
      // Allow the OS to reap the killed descendant before checking its PID.
      for (let attempt = 0; attempt < 50; attempt++) {
        try {
          process.kill(pid, 0)
        } catch (error) {
          assert.equal(error.code, 'ESRCH')
          return
        }
        await new Promise((resolve) => setTimeout(resolve, 100))
      }
      assert.fail(`server descendant ${pid} survived the failed test`)
    } finally {
      if (pid) {
        try {
          process.kill(pid, 'SIGKILL')
        } catch {}
      }
      await rm(fixture, { recursive: true, force: true })
      await rm(
        path.join(root, 'test-results', '.cache', path.basename(fixture)),
        { recursive: true, force: true },
      )
    }
  },
)
