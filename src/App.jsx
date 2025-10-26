
import { useState } from 'react'
import { Routes , Route  } from 'react-router-dom'
import { Toaster } from '@/components/ui/sonner'
import Header from './components/custom/Header'
import Hero from './components/custom/Hero'
import Dashboard from './components/custom/Dashboard'
import Projects from './components/custom/Projects'
import Outline from './components/custom/Outline'
import Editor from './components/custom/Editor'
import Pricing from './components/custom/Pricing'
import PageNotFound from './components/custom/PageNotFound'


function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<Hero />} />
        <Route path="/dashboard" element={<Dashboard />}>
          {/* Child routes */}
          <Route path="projects" element={<Projects />} />
          <Route path="projects/:projectId/outline" element={<Outline />} />
          <Route path="projects/:projectId/editor" element={<Editor />} />
          
          
        </Route>
        <Route path="/pricing" element={<Pricing />} />
        
        {/* 404 Page - Must be last */}
        <Route path="*" element={<PageNotFound />} />
      </Routes>
      <Toaster />
    </>
  )
}

export default App
