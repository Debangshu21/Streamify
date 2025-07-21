import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// Makes the UI of chatpage look better
import "stream-chat-react/dist/css/v2/index.css"
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from "react-router";

import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
const queryClient = new QueryClient();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      {/* Used to setup tanstack query */}
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </BrowserRouter>
  </StrictMode>,
)
