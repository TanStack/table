import {
  safelyAccessDocument,
  safelyAccessDocumentEvent,
} from '../../src/utils/document'
import { expect, vi, beforeEach, afterEach } from 'vitest'
import { before } from 'node:test'

const originalDocument = globalThis.document

describe('safelyAccessDocument', () => {
  describe('global document', () => {
    const mockedDocument = {}
    const originalDocument = globalThis.document
    beforeEach(() => {
      if (typeof globalThis.document === 'undefined') {
        globalThis.document = mockedDocument
      }
    })
    afterEach(() => {
      if (typeof originalDocument === 'undefined') {
        delete globalThis.document
      }
    })

    test('get global document when no args are passed', () => {
      const contextDocument = safelyAccessDocument()
      expect(contextDocument).toEqual(mockedDocument)
    })
  })

  test('get document', () => {
    let givenDocument = {} as Document
    const contextDocument = safelyAccessDocument(givenDocument)

    expect(contextDocument).toEqual(givenDocument)
  })
})

describe('safelyAccessDocumentEvent', () => {
  test('get document by given event', () => {
    const fakeDocument = {}
    const event = new Event('mousedown')
    class FakeElement extends EventTarget {
      ownerDocument = fakeDocument
    }
    Object.defineProperty(event, 'target', { value: new FakeElement() })

    const document = safelyAccessDocumentEvent(event)
    expect(fakeDocument).toEqual(document)
  })
})
