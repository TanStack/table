import { mergeApplicationConfig } from '@angular/core'
import { provideServerRendering, withRoutes } from '@angular/ssr'
import { appConfig } from './app.config'
import { serverRoutes } from './app.routes.server'
import type { ApplicationConfig } from '@angular/core'

const serverConfig: ApplicationConfig = {
  providers: [provideServerRendering(withRoutes(serverRoutes))],
}

export const config = mergeApplicationConfig(appConfig, serverConfig)
