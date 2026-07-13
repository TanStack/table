/// <reference types="vite/client" />

import type Alpine from 'alpinejs'

declare global {
  interface Window {
    Alpine: typeof Alpine
  }
}
