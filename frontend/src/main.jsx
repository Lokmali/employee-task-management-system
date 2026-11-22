import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Find the empty <div id="root"> in index.html and render our React tree into it.
createRoot(document.getElementById('root')).render(
  // StrictMode runs some checks twice in development to catch mistakes. It is not used in production.
  <StrictMode>
    <App />
  </StrictMode>,
)
