import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';

interface Company {
  id: number;
  name: string;
  ticker: string;
  currency: string;
}

interface StockPrice {
  ticker: string;
  price: number;
  change: number;
  changePercent: number;
  currency: string;
  priceInTWD: number;
}

export default function CompanyCharts() {
  const [selectedTicker, setSelectedTicker] = useState("AAPL");
  const [timeframe, setTimeframe] = useState("30D");

  // Fetch companies for the selector
  const { data: companies = [] } = useQuery<Company[]>({
    queryKey: ["/api/companies"],
  });

  // Fetch stock price for selected company
  const { data: stockPrice, isLoading: priceLoading } = useQuery<StockPrice>({
    queryKey: ["/api/stocks", selectedTicker, "price"],
    enabled: !!selectedTicker,
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const selectedCompany = companies.find(c => c.ticker === selectedTicker);

  // Mock chart data generation
  const generateChartData = () => {
    const points = 20;
    const data = [];
    let basePrice = stockPrice?.price || 100;
    
    // Historical data (first 15 points)
    for (let i = 0; i < 15; i++) {
      const variation = (Math.random() - 0.5) * 0.1;
      basePrice = basePrice * (1 + variation);
      data.push({
        index: i,
        price: basePrice,
        type: 'historical',
        height: Math.min(95, Math.max(5, (basePrice / (stockPrice?.price || 100)) * 50 + 25))
      });
    }
    
    // Predicted data (last 5 points)
    for (let i = 15; i < points; i++) {
      const variation = (Math.random() - 0.3) * 0.08; // Slightly bullish bias
      basePrice = basePrice * (1 + variation);
      data.push({
        index: i,
        price: basePrice,
        type: 'predicted',
        height: Math.min(95, Math.max(5, (basePrice / (stockPrice?.price || 100)) * 50 + 25))
      });
    }
    
    return data;
  };

  const chartData = generateChartData();
  const predictedPrice = chartData[chartData.length - 1]?.price || 0;
  const currentPrice = stockPrice?.priceInTWD || 0;
  const potentialGain = currentPrice > 0 ? ((predictedPrice * 31.245 - currentPrice) / currentPrice * 100) : 0;

  // Mock financial metrics
  const getFinancialMetrics = (ticker: string) => {
    const metrics = {
      "AAPL": { pe: 28.7, dividend: 0.52, marketCap: "$2.7T" },
      "TSLA": { pe: 45.2, dividend: 0.0, marketCap: "$780B" },
      "FMG": { pe: 12.1, dividend: 8.5, marketCap: "$75B" }
    };
    return metrics[ticker as keyof typeof metrics] || { pe: 25.0, dividend: 2.0, marketCap: "$100B" };
  };

  const financialMetrics = getFinancialMetrics(selectedTicker);

  if (priceLoading && !stockPrice) {
    return (
      <Card className="gradient-card p-6 border-slate-700">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold">Company Performance</h2>
        </div>
        <div className="animate-pulse">
          <div className="h-48 bg-slate-700 rounded-lg mb-6"></div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="h-16 bg-slate-700 rounded-lg"></div>
            <div className="h-16 bg-slate-700 rounded-lg"></div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="gradient-card p-6 border-slate-700">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold">Company Performance</h2>
        <Select value={selectedTicker} onValueChange={setSelectedTicker}>
          <SelectTrigger className="w-48 bg-slate-700 border-slate-600">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {companies.map((company) => (
              <SelectItem key={company.id} value={company.ticker}>
                {company.name} ({company.ticker})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Timeframe Selector */}
      <div className="flex justify-center space-x-2 mb-6">
        {["7D", "30D", "90D", "1Y"].map((period) => (
          <Button
            key={period}
            variant={timeframe === period ? "default" : "ghost"}
            size="sm"
            onClick={() => setTimeframe(period)}
            className={timeframe === period ? "bg-primary text-white" : "text-slate-400"}
          >
            {period}
          </Button>
        ))}
      </div>

      {/* Stock Price Chart */}
      <div className="chart-container rounded-lg p-4 h-48 mb-6">
        <div className="w-full h-full flex items-end justify-between space-x-1">
          {chartData.map((point, index) => (
            <div
              key={index}
              className={`flex-1 rounded-t-sm transition-all duration-300 ${
                point.type === 'historical'
                  ? 'bg-gradient-to-t from-primary/40 to-primary/80'
                  : 'bg-gradient-to-t from-success/30 to-success/60 opacity-70'
              } ${index === chartData.length - 1 && point.type === 'predicted' ? 'shadow-glow' : ''}`}
              style={{ height: `${point.height}%` }}
            />
          ))}
        </div>
        <div className="flex justify-between text-xs text-slate-400 mt-2">
          <span>{timeframe} ago</span>
          <span>Today</span>
          <span className="text-success">+3 months (AI)</span>
        </div>
      </div>

      {/* Financial Metrics */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-slate-700/50 rounded-lg p-3">
          <p className="text-xs text-slate-400 mb-1">Current Price (TWD)</p>
          <p className="text-lg font-semibold text-slate-100">
            ${currentPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          {stockPrice && (
            <p className={`text-xs ${stockPrice.change >= 0 ? 'text-success' : 'text-danger'}`}>
              {stockPrice.change >= 0 ? '+' : ''}${stockPrice.change.toFixed(2)} ({stockPrice.change >= 0 ? '+' : ''}{stockPrice.changePercent.toFixed(2)}%)
            </p>
          )}
        </div>
        <div className="bg-slate-700/50 rounded-lg p-3">
          <p className="text-xs text-slate-400 mb-1">AI Target (3M)</p>
          <p className="text-lg font-semibold text-success">
            ${(predictedPrice * 31.245).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <p className="text-xs text-success">
            {potentialGain >= 0 ? '+' : ''}{potentialGain.toFixed(2)}% potential
          </p>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-3 gap-3 text-center text-xs">
        <div>
          <p className="text-slate-400">P/E Ratio</p>
          <p className="font-semibold text-slate-100">{financialMetrics.pe}</p>
        </div>
        <div>
          <p className="text-slate-400">Dividend Yield</p>
          <p className="font-semibold text-slate-100">{financialMetrics.dividend}%</p>
        </div>
        <div>
          <p className="text-slate-400">Market Cap</p>
          <p className="font-semibold text-slate-100">{financialMetrics.marketCap}</p>
        </div>
      </div>

      {/* Company Info */}
      {selectedCompany && (
        <div className="mt-4 pt-4 border-t border-slate-700">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">Sector: {selectedCompany.currency}</span>
            <span className="text-slate-400">Currency: {selectedCompany.currency}</span>
          </div>
        </div>
      )}
    </Card>
  );
}
