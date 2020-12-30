import React from 'react'
import '@docsearch/react/dist/style.css'
import '../styles/index.css'
import Head from 'next/head'
import { SearchProvider } from 'components/useSearch'

function loadScript(src, attrs = {}) {
  if (typeof document !== 'undefined') {
    const script = document.createElement('script')
    script.async = true
    script.defer = true
    Object.keys(attrs).forEach(attr => script.setAttribute(attr, attrs[attr]))
    script.src = src
    document.body.appendChild(script)
  }
}

function MyApp({ Component, pageProps }) {
  React.useEffect(() => {
    loadScript('https://buttons.github.io/buttons.js')
    // Convert kit slide up form
    loadScript('https://tanstack.ck.page/84f1bb01b8/index.js', {
      'data-uid': '84f1bb01b8',
    })
  }, [])

  return (
    <>
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <style
          dangerouslySetInnerHTML={{
            __html: `
        @media (max-width: 390px) {
            .formkit-slide-in {
              display: none;
            }
          }
          @media (max-height: 740px) {
            .formkit-slide-in {
              display: none;
            }
          }
          `,
          }}
        />
      </Head>
      <img src="https://static.scarf.sh/a.png?x-pxid=2b0d73f3-59ed-4ac8-9e75-b5b2098d75eb" />
      <SearchProvider>
        <Component {...pageProps} />
      </SearchProvider>
    </>
  )
}

export default MyApp
