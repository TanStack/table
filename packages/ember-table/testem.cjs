'use strict'

// Resolve the Chromium binary that Playwright installs for this repo's e2e
// tests. Pointing testem's Chrome launcher at it lets this suite run anywhere
// that binary exists (contributors don't need a separate system Chrome
// install). If it isn't installed, testem falls back to a system Chrome, which
// CI runners provide.
function resolvePlaywrightChromium() {
  try {
    const fs = require('node:fs')
    const { chromium } = require('@playwright/test')
    const exe = chromium.executablePath()
    return exe && fs.existsSync(exe) ? exe : null
  } catch {
    return null
  }
}

const chromiumPath = resolvePlaywrightChromium()

const config = {
  test_page: 'tests/index.html?hidepassed',
  cwd: 'dist-tests',
  disable_watching: true,
  launch_in_ci: ['Chrome'],
  launch_in_dev: ['Chrome'],
  browser_start_timeout: 120,
  browser_args: {
    Chrome: {
      ci: [
        // --no-sandbox is needed when running Chrome inside a container
        process.env.CI ? '--no-sandbox' : null,
        '--headless=new',
        '--disable-dev-shm-usage',
        '--disable-software-rasterizer',
        '--mute-audio',
        '--remote-debugging-port=0',
        '--window-size=1440,900',
      ].filter(Boolean),
    },
  },
}

// Override where testem looks for the Chrome binary only when the Playwright
// chromium is present; otherwise leave testem's default discovery in place.
if (chromiumPath) {
  config.browser_paths = { Chrome: chromiumPath }
}

if (typeof module !== 'undefined') {
  module.exports = config
}
