import { existsSync } from 'node:fs'
import path from 'node:path'
import { spawn } from 'node:child_process'
import { createServer } from 'vite'

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

  if (!configFile && !existsSync(path.join(exampleDir, 'index.html'))) {
    throw new Error(`Failed to find a Vite app for ${exampleDir}`)
  }

  const server = await createServer({
    root: exampleDir,
    configFile: configFile ?? false,
    logLevel: 'error',
    server: {
      host: '127.0.0.1',
      port: 0,
      strictPort: false,
    },
  })

  await server.listen()

  const address = server.httpServer?.address()
  if (!address || typeof address === 'string') {
    await server.close()
    throw new Error(`Failed to start Vite server for ${exampleDir}`)
  }

  return {
    url: `http://127.0.0.1:${address.port}/`,
    close: () => server.close(),
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
      stdio: ['ignore', 'pipe', 'pipe'],
    },
  )

  let output = ''

  const url = await new Promise<string>((resolve, reject) => {
    const timeout = setTimeout(() => {
      child.kill()
      reject(
        new Error(
          `Timed out starting Angular server for ${exampleDir}\n${output}`,
        ),
      )
    }, 60_000)

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
      if (child.exitCode !== null || child.signalCode !== null) {
        return
      }

      child.kill()
      await new Promise<void>((resolve) => {
        child.once('exit', () => resolve())
      })
    },
  }
}
