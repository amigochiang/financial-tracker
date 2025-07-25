import { useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Dashboard from './pages/dashboard'
import { Toaster } from './components/ui/toaster'

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Dashboard />
      <Toaster />
    </QueryClientProvider>
  )
}

export default App
