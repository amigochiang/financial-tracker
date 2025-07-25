import { useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { CompanyWatchlist } from './components/CompanyWatchlist'

const queryClient = new QueryClient()

interface Company {
  id: string;
  name: string;
  ticker?: string;
  financials?: {
    cashReserves?: number;
    annualRevenue?: number;
    annualProfit?: number;
    productAnnualRevenue?: number;
    annualGrossProfit?: number;
  };
}

function App() {
  const [companies, setCompanies] = useState<Company[]>([])

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-background text-foreground">
        <div className="container mx-auto p-6">
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-center">Portfolio Pro</h1>
            <p className="text-center text-muted-foreground mt-2">
              Financial Dashboard & Company Tracker
            </p>
          </header>
          
          <main>
            <CompanyWatchlist 
              companies={companies}
              onCompaniesChange={setCompanies}
            />
          </main>
        </div>
      </div>
    </QueryClientProvider>
  )
}

export default App
