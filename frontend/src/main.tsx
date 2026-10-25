import '@fontsource/dela-gothic-one/latin-400.css'
import '@fontsource/dela-gothic-one/latin-ext-400.css'
import '@fontsource/dela-gothic-one/vietnamese-400.css'
import '@fontsource-variable/nunito/wght.css'
import '@fontsource-variable/pixelify-sans/wght.css'
import './styles/index.css'

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import { App } from './app/App'

const rootElement = document.getElementById('root')
if (!rootElement) {
  throw new Error('Root element #root not found in index.html')
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
