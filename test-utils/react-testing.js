import { render as originalRender } from '@testing-library/react'
import diff from 'jest-diff'
import chalk from 'chalk'

const render = (...args) => {
  const rendered = originalRender(...args)

  rendered.lastFragment = new DocumentFragment()

  rendered.debugDiff = (log = true) => {
    const nextFragment = rendered.asFragment()

    if (log) {
      console.log(
        diff(rendered.lastFragment, nextFragment, {
          aAnnotation: 'Previous',
          bAnnotation: 'Next',
          aColor: chalk.red,
          bColor: chalk.green,
        })
      )
    }

    rendered.lastFragment = nextFragment
  }
  return rendered
}

export * from '@testing-library/react'

export { render }
