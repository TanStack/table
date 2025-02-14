import { RenderMode, type ServerRoute } from '@angular/ssr'

export const serverRoutes: Array<ServerRoute> = [
  {
    path: '**',
    renderMode: RenderMode.Server,
  },
]
