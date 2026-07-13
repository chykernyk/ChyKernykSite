import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Stop the browser restoring a scrolled position on reload — this SPA
// drives navigation via pushState/replaceState, which Safari in particular
// treats as scroll-restorable history entries by default.
if ('scrollRestoration' in window.history) {
  window.history.scrollRestoration = 'manual'
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
