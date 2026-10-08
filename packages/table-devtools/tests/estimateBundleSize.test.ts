import { describe, expect, it } from 'vitest'
import { bundleSizes } from '../src/bundleSizes'
import { estimateBundleSize } from '../src/estimateBundleSize'
import validation from './fixtures/bundleSizeValidation.json'
import type { BundleSizeSelection } from '../src/estimateBundleSize'

describe('estimateBundleSize', () => {
  it('returns the core size for an empty selection', () => {
    expect(estimateBundleSize({})).toBe(bundleSizes.core)
  })

  it('ignores core, custom, and unknown names', () => {
    expect(
      estimateBundleSize({
        features: ['coreRowsFeature', 'myCustomFeature'],
        filterFns: ['myCustomFilter'],
      }),
    ).toBe(bundleSizes.core)
  })

  it('adds a single feature at its measured size', () => {
    const size = bundleSizes.features.rowSortingFeature
    const estimate = estimateBundleSize({ features: ['rowSortingFeature'] })

    expect(Math.abs(estimate - (bundleSizes.core + size))).toBeLessThan(
      size * 0.02,
    )
  })

  it('counts code shared between items once', () => {
    const data = {
      core: 1000,
      estimate: {
        coreMinified: 4000,
        curve: [1, 1],
        chunks: [100, 200, 300],
        features: {
          a: [75, 300, 0, 1],
          b: [125, 500, 1, 2],
        },
      },
    }

    // Each item measures at 25% of its minified size, so the union of
    // chunks 0-2 (600 bytes) lands at 150 bytes, not the 200 bytes a sum of
    // the two items would give
    expect(estimateBundleSize({ features: ['a'] }, data)).toBe(1075)
    expect(estimateBundleSize({ features: ['a', 'b'] }, data)).toBe(1150)
  })

  it('stays close to real bundles of random item combinations', () => {
    for (const { selection, actual } of validation) {
      const estimate = estimateBundleSize(selection as BundleSizeSelection)
      expect(Math.abs(estimate / actual - 1)).toBeLessThan(0.05)
    }
  })
})
