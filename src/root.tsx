import { useEffect } from 'react'
import useAsset from 'ultra/hooks/use-asset.js'
import App from './App.tsx'

export default function Root() {
  useEffect(() => {
    navigator.storage.estimate().then((r) => console.log('storage', r))
  })
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <title>Ultra</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="shortcut icon" href={useAsset('/favicon.ico')} />
        <link rel="stylesheet" href={useAsset('/style.css')} />
      </head>
      <body>
        <App />
      </body>
    </html>
  )
}
