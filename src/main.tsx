import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { captureSource } from './lib/source'

// Before the app reads the address: remember which Discord server sent this visitor (?from=)
captureSource()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
