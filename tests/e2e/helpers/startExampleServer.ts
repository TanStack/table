import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'
import nodeProcess from 'node:process'
import { spawn } from 'node:child_process'
import type { ChildProcess } from 'node:child_process'
import { test } from '@playwright/test'
import { createServer } from 'vite'

// Browser examples declare a minimal global process, which also narrows the
// node:process export. This helper runs exclusively in a Node test worker.
const process = nodeProcess as NodeJS.Process

// Register cleanup before startup/navigation can fail. Killing pnpm alone leaves
// its Vite/Angular descendants alive on Linux, accumulating servers across tasks.
const children = new Set<ChildProcess>()
const servers = new Set<{ close: () => Promise<void> }>()

function killServer(child: ChildProcess) {
  if (!child.pid || !children.has(child)) return
  try {
    if (process.platform === 'win32') child.kill('SIGKILL')
    else process.kill(-child.pid, 'SIGKILL')
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'ESRCH') throw error
  }
  children.delete(child)
}

process.once('exit', () => {
  for (const child of children) killServer(child)
})

test.afterAll(async () => {
  for (const child of children) killServer(child)
  await Promise.all([...servers].map((server) => server.close()))
  servers.clear()
})

function hasDependency(exampleDir: string, dependency: string) {
  const pkgPath = path.join(exampleDir, 'package.json')
  if (!existsSync(pkgPath)) return false
  try {
    const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'))
    return Boolean(pkg.dependencies?.[dependency])
  } catch {
    return false
  }
}

export async function startExampleServer(exampleDir: string) {
  const jsConfig = path.join(exampleDir, 'vite.config.js')
  const tsConfig = path.join(exampleDir, 'vite.config.ts')
  const configFile = existsSync(jsConfig)
    ? jsConfig
    : existsSync(tsConfig)
      ? tsConfig
      : undefined

  if (!configFile && existsSync(path.join(exampleDir, 'angular.json'))) {
    return startAngularExampleServer(exampleDir)
  }

  // TanStack Start apps (SSR) need their own dev server process: running the
  // Start plugin through a programmatic createServer from the repo root
  // breaks its client/server environment resolution. Ember apps do too: their
  // config is vite.config.mjs (not detected above) and the embroider plugins
  // resolve babel config relative to the app directory.
  if (
    hasDependency(exampleDir, '@tanstack/react-start') ||
    hasDependency(exampleDir, 'ember-source')
  ) {
    return startSpawnedViteServer(exampleDir)
  }

  if (!configFile && !existsSync(path.join(exampleDir, 'index.html'))) {
    throw new Error(`Failed to find a Vite app for ${exampleDir}`)
  }

  const playwrightViteMode = (process.env as Record<string, string | undefined>)
    .PLAYWRIGHT_VITE_MODE
  const server = await createServer({
    root: exampleDir,
    configFile: configFile ?? false,
    logLevel: 'error',
    ...(playwrightViteMode ? { mode: playwrightViteMode } : {}),
    server: {
      host: '127.0.0.1',
      port: 0,
      strictPort: false,
    },
  })

  servers.add(server)
  await server.listen()
  // Crawl the entry before browser navigation so dependency optimization
  // does not invalidate module URLs while the smoke test loads them.
  const entry = path.join(exampleDir, 'index.html')
  if (existsSync(entry)) {
    await server.transformIndexHtml('/', readFileSync(entry, 'utf8'))
    await server.waitForRequestsIdle()
  }

  const address = server.httpServer?.address()
  if (!address || typeof address === 'string') {
    await server.close()
    throw new Error(`Failed to start Vite server for ${exampleDir}`)
  }

  return {
    url: `http://127.0.0.1:${address.port}/`,
    close: async () => {
      await server.close()
      servers.delete(server)
    },
  }
}

async function startSpawnedViteServer(exampleDir: string) {
  const maxAttempts = 5

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      return await listenOnSpawnedVitePort(exampleDir)
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      if (!message.includes('already in use') || attempt === maxAttempts - 1) {
        throw error
      }
    }
  }

  throw new Error(`Failed to start Vite server for ${exampleDir}`)
}

async function listenOnSpawnedVitePort(exampleDir: string) {
  // Random high port: `vite dev` has no port-0 support, and parallel test
  // workers must not collide. Avoid the 4100-6099 range so we do not land on
  // macOS services such as port 6000.
  const port = 18000 + Math.floor(Math.random() * 2000)
  const child = spawn(
    'pnpm',
    [
      'exec',
      'vite',
      'dev',
      '--host',
      '127.0.0.1',
      '--port',
      String(port),
      '--strictPort',
    ],
    {
      cwd: exampleDir,
      env: {
        ...process.env,
        FORCE_COLOR: '0',
        NO_COLOR: '1',
      },
      detached: process.platform !== 'win32',
      stdio: ['ignore', 'pipe', 'pipe'],
    },
  )

  children.add(child)
  let output = ''

  const url = await new Promise<string>((resolve, reject) => {
    const timeout = setTimeout(() => {
      killServer(child)
      reject(
        new Error(
          `Timed out starting Vite server for ${exampleDir}\n${output}`,
        ),
      )
    }, 90_000)

    const handleOutput = (chunk: Buffer) => {
      output += chunk.toString()

      const match = output.match(/http:\/\/127\.0\.0\.1:\d+\//)
      if (match) {
        clearTimeout(timeout)
        resolve(match[0])
      }
    }

    child.stdout.on('data', handleOutput)
    child.stderr.on('data', handleOutput)
    child.once('error', (error) => {
      clearTimeout(timeout)
      reject(error)
    })
    child.once('exit', (code) => {
      clearTimeout(timeout)

      if (code !== null && code !== 0) {
        reject(
          new Error(
            `Vite server exited with code ${code} for ${exampleDir}\n${output}`,
          ),
        )
      }
    })
  })

  return {
    url,
    close: async () => {
      killServer(child)
    },
  }
}

async function startAngularExampleServer(exampleDir: string) {
  const child = spawn(
    'pnpm',
    [
      'exec',
      'ng',
      'serve',
      '--host',
      '127.0.0.1',
      '--port',
      '0',
      '--configuration',
      'development',
    ],
    {
      cwd: exampleDir,
      env: {
        ...process.env,
        FORCE_COLOR: '0',
        NO_COLOR: '1',
      },
      detached: process.platform !== 'win32',
      stdio: ['ignore', 'pipe', 'pipe'],
    },
  )

  children.add(child)
  let output = ''

  const url = await new Promise<string>((resolve, reject) => {
    const timeout = setTimeout(() => {
      killServer(child)
      reject(
        new Error(
          `Timed out starting Angular server for ${exampleDir}\n${output}`,
        ),
      )
    }, 90_000)

    const handleOutput = (chunk: Buffer) => {
      output += chunk.toString()

      const match = output.match(/http:\/\/127\.0\.0\.1:\d+\//)
      if (match) {
        clearTimeout(timeout)
        resolve(match[0])
      }
    }

    child.stdout.on('data', handleOutput)
    child.stderr.on('data', handleOutput)
    child.once('error', (error) => {
      clearTimeout(timeout)
      reject(error)
    })
    child.once('exit', (code) => {
      clearTimeout(timeout)

      if (code !== null && code !== 0) {
        reject(
          new Error(
            `Angular server exited with code ${code} for ${exampleDir}\n${output}`,
          ),
        )
      }
    })
  })

  return {
    url,
    close: async () => {
      killServer(child)
    },
  }
}
