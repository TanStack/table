import { createContext, useContext, useState, useCallback } from 'react'
import { createPortal } from 'react-dom'
import Router from 'next/router'
import Head from 'next/head'
import Link from 'next/link'
import { useDocSearchKeyboardEvents } from '@docsearch/react'
import { siteConfig } from 'siteConfig'

const SearchContext = createContext()
let DocSearchModal = null

export const useSearch = () => useContext(SearchContext)

export function SearchProvider({
  children,
  searchParameters = {
    hitsPerPage: 5,
  },
}) {
  const [isShowing, setIsShowing] = useState(false)

  const onOpen = useCallback(function onOpen() {
    function importDocSearchModalIfNeeded() {
      if (DocSearchModal) {
        return Promise.resolve()
      }

      return import('@docsearch/react/modal').then(
        ({ DocSearchModal: Modal }) => (DocSearchModal = Modal)
      )
    }

    importDocSearchModalIfNeeded().then(() => {
      setIsShowing(true)
    })
  }, [])

  const onClose = useCallback(() => setIsShowing(false), [])

  useDocSearchKeyboardEvents({
    isOpen: isShowing,
    onOpen,
    onClose,
  })

  const options = {
    appId: siteConfig.algolia.appId,
    apiKey: siteConfig.algolia.apiKey,
    indexName: siteConfig.algolia.indexName,
    renderModal: true,
  }

  return (
    <>
      <Head>
        <link
          key="algolia"
          rel="preconnect"
          href={`https://${options.appId}-dsn.algolia.net`}
          crossOrigin="true"
        />
      </Head>

      <SearchContext.Provider value={{ DocSearchModal, onOpen }}>
        {children}
      </SearchContext.Provider>

      {isShowing &&
        createPortal(
          <DocSearchModal
            {...options}
            searchParameters={searchParameters}
            onClose={onClose}
            navigator={{
              navigate({ suggestionUrl }) {
                Router.push(suggestionUrl)
              },
            }}
            transformItems={items => {
              return items.map(item => {
                const url = new URL(item.url)
                return {
                  ...item,
                  url: item.url
                    .replace(url.origin, '')
                    .replace('#__next', '')
                    .replace('/docs/#', '/docs/overview#'),
                }
              })
            }}
            hitComponent={Hit}
          />,
          document.body
        )}
    </>
  )
}

function Hit({ hit, children }) {
  return (
    <Link href={hit.url.replace()}>
      <a>{children}</a>
    </Link>
  )
}
