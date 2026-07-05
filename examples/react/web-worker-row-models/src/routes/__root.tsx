/// <reference types="vite/client" />
import * as React from 'react'
import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRoute,
} from '@tanstack/react-router'
import { TanStackDevtools } from '@tanstack/react-devtools'
import { tableDevtoolsPlugin } from '@tanstack/react-table-devtools'
import appCss from '../index.css?url'

// Captures console errors/warnings (e.g. React hydration mismatches) from
// before hydration starts so they can be inspected via window.__consoleLog.
const consoleProbe = `
window.__consoleLog = [];
(function () {
  var push = function (level, args) {
    try {
      window.__consoleLog.push({
        level: level,
        msg: Array.prototype.map
          .call(args, function (a) {
            return String((a && a.message) || (a && a.stack) || a);
          })
          .join(' ')
          .slice(0, 10000),
      });
    } catch (e) {}
  };
  var origError = console.error;
  var origWarn = console.warn;
  console.error = function () { push('error', arguments); origError.apply(console, arguments); };
  console.warn = function () { push('warn', arguments); origWarn.apply(console, arguments); };
  window.addEventListener('error', function (e) { push('uncaught', [e.message]); });
  window.addEventListener('unhandledrejection', function (e) { push('rejection', [e.reason]); });
})();
`

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'TanStack Table Web Worker Row Models (Start SSR)' },
    ],
    links: [{ rel: 'stylesheet', href: appCss }],
    scripts: [{ children: consoleProbe }],
  }),
  component: RootComponent,
})

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  )
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <TanStackDevtools plugins={[tableDevtoolsPlugin()]} />
        <Scripts />
      </body>
    </html>
  )
}
