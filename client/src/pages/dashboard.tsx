import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";

import PortfolioSummary from "@/components/portfolio/PortfolioSummary";
import CompanyWatchlist from "@/components/portfolio/CompanyWatchlist";
import AIRecommendations from "@/components/ai/AIRecommendations";
import CurrencyRates from "@/components/currency/CurrencyRates";
import MarketAlerts from "@/components/alerts/MarketAlerts";
import CEOProfiles from "@/components/executives/CEOProfiles";
import CompanyCharts from "@/components/charts/CompanyCharts";

export default function Dashboard() {
  const [baseCurrency, setBaseCurrency] = useState("TWD");
  const [lastUpdateTime, setLastUpdateTime] = useState(new Date());

  // Fetch portfolio summary
  const { data: portfolioSummary } = useQuery({
    queryKey: ["/api/portfolio/summary"],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  // Fetch market alerts
  const { data: alerts } = useQuery({
    queryKey: ["/api/market/alerts"],
    refetchInterval: 60000, // Refresh every minute
  });

  // Auto-refresh data
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdateTime(new Date());
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
      timeZone: "Asia/Taipei"
    });
  };

  const formatCurrency = (amount: number, currency: string = "TWD") => {
    return new Intl.NumberFormat('zh-TW', {
      style: 'currency',
      currency: currency,
      notation: 'compact',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const handleRefreshData = async () => {
    try {
      const response = await fetch("/api/data/refresh", { method: "POST" });
      if (response.ok) {
        toast({
          title: "Data Refreshed",
          description: "All portfolio and market data has been updated",
        });
        setLastUpdateTime(new Date());
      }
    } catch (error) {
      toast({
        title: "Refresh Failed",
        description: "Unable to refresh data. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900 text-slate-100">
      {/* Navigation Header */}
      <nav className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50">
        <div className="max-w-full px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-6">
              <h1 className="text-2xl font-bold text-primary">Portfolio Pro</h1>
              <div className="hidden md:flex space-x-4">
                <span className="text-sm text-slate-400">Last Updated:</span>
                <span className="text-sm text-slate-300">{formatTime(lastUpdateTime)} TST</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {/* Real-time status indicator */}
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-success rounded-full animate-pulse-subtle"></div>
                <span className="text-xs text-slate-400">Live Data</span>
              </div>
              
              {/* Currency selector */}
              <Select value={baseCurrency} onValueChange={setBaseCurrency}>
                <SelectTrigger className="w-24 bg-slate-800 border-slate-700">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TWD">TWD</SelectItem>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="JPY">JPY</SelectItem>
                </SelectContent>
              </Select>
              
              {/* Refresh button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRefreshData}
                className="text-slate-400 hover:text-slate-100"
              >
                Refresh
              </Button>
              
              {/* Alert bell */}
              <button className="relative p-2 text-slate-400 hover:text-slate-100 transition-colors">
                <Bell className="w-5 h-5" />
                {alerts && alerts.length > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0 text-xs"
                  >
                    {alerts.length}
                  </Badge>
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex min-h-screen">
        {/* Sidebar with Portfolio Summary and Watchlist */}
        <aside className="w-80 bg-slate-900 border-r border-slate-800 p-6 overflow-y-auto">
          <PortfolioSummary 
            summary={portfolioSummary} 
            baseCurrency={baseCurrency}
            formatCurrency={formatCurrency}
          />
          <CompanyWatchlist />
          
          {/* Quick Actions */}
          <div className="bg-slate-800 rounded-xl p-6 mt-6">
            <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Button className="w-full bg-primary hover:bg-primary/90 text-white">
                Buy Stocks
              </Button>
              <Button variant="secondary" className="w-full">
                Sell Stocks
              </Button>
              <Button variant="outline" className="w-full">
                Currency Exchange
              </Button>
            </div>
          </div>
        </aside>

        {/* Main Dashboard Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          {/* Top Row: AI Recommendations & Currency Rates */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <AIRecommendations />
            <CurrencyRates baseCurrency={baseCurrency} />
          </div>

          {/* Second Row: Market Alerts */}
          <div className="mb-6">
            <MarketAlerts />
          </div>

          {/* Third Row: CEO Profiles & Company Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <CEOProfiles />
            <CompanyCharts />
          </div>
        </main>
      </div>
    </div>
  );
}
