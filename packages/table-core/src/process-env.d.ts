/** Minimal typing for `process.env` used in dev-only guards (bundlers define this). */
declare const process: {
  readonly env: {
    readonly NODE_ENV?: string
  }
}
