import React from 'react'

export default id => () => {
  const fork = 'JasonRitchie'
  const branch = 'codesandbox'
  const baseUrl = `https://codesandbox.io/embed/github/${fork}/react-table/tree/${branch}/docs/src/sandboxes/`
  return (
    <iframe
      src={`${baseUrl}${id}?autoresize=1&hidenavigation=1&view=${global.innerWidth <
      1000
        ? 'preview'
        : 'split'}`}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: `100%`,
        height: `100%`,
        border: 0,
        overflow: `hidden`,
      }}
      sandbox='allow-modals allow-forms allow-popups allow-scripts allow-same-origin'
    />
  )
}
