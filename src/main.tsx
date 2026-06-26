import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource/exo-2/cyrillic-600.css'
import '@fontsource/exo-2/cyrillic-700.css'
import '@fontsource/manrope/cyrillic-400.css'
import '@fontsource/manrope/cyrillic-500.css'
import '@fontsource/manrope/cyrillic-600.css'
import '@fontsource/manrope/cyrillic-700.css'
import App from './App'
import './styles.css'
import './latestOverrides.css'
import './latestPatch'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
