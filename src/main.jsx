import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './App.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { ClerkProvider } from '@clerk/clerk-react'
import { UserDetailContext } from './../context/UserDetailContext.jsx'
// Import your Publishable Key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error('Missing Publishable Key')
}

function Root(){
  const [userDetail,setUserDetail] = useState()
  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
    <UserDetailContext.Provider value={{ userDetail, setUserDetail }}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </UserDetailContext.Provider>
  </ClerkProvider>
  )
}

createRoot(document.getElementById('root')).render(
  <Root/>
)
