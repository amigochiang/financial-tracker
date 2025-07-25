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
  const [companies, setCompanies] = useState<Company[]>([
    {
      id: '1',
      name: 'Apple Inc.',
      ticker: 'AAPL',
      financials: {
        cashReserves: 62000,
        annualRevenue: 383000,
        annualProfit: 100000,
        productAnnualRevenue: 300000,
        annualGrossProfit: 170000
      }
    },
    {
      id: '2',
      name: 'Tesla Inc.',
      ticker: 'TSLA',
      financials: {
        cashReserves: 22000,
        annualRevenue: 96773,
        annualProfit: 1535,
        productAnnualRevenue: 80000,
        annualGrossProfit: 20000
      }
    }
  ])

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-background text-foreground">
        <div className="container mx-auto p-6 max-w-6xl">
          <header className="mb-8">
            <h1 className="text-4xl font-bold text-center bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
              Portfolio Pro
            </h1>
            <p className="text-center text-muted-foreground mt-2 text-lg">
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
