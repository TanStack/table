/** Minimal typing for `process.env` used in dev/production splits (bundlers define this). */
declare const process: {
  readonly env: {
    readonly NODE_ENV?: string
  }
}
