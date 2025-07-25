import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Bell, TrendingUp, DollarSign, Activity, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import CompanyWatchlist from "@/components/portfolio/CompanyWatchlist";

export default function Dashboard() {
  const [lastUpdateTime, setLastUpdateTime] = useState(new Date());

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

  const handleRefreshData = async () => {
    try {
      toast({
        title: "Data Refreshed",
        description: "All portfolio and market data has been updated",
      });
      setLastUpdateTime(new Date());
    } catch (error) {
      toast({
        title: "Refresh Failed",
        description: "Unable to refresh data. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-slate-100">
      {/* Navigation Header */}
      <nav className="bg-slate-900/80 backdrop-blur-sm border-b border-slate-700/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                  Portfolio Pro
                </h1>
              </div>
              <div className="hidden md:flex items-center space-x-4 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-slate-400">Live Data</span>
                </div>
                <span className="text-slate-500">•</span>
                <span className="text-slate-400">Last Updated:</span>
                <span className="text-slate-300 font-medium">{formatTime(lastUpdateTime)} TST</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRefreshData}
                className="text-slate-400 hover:text-slate-100 hover:bg-slate-800"
              >
                <Activity className="w-4 h-4 mr-2" />
                Refresh
              </Button>
              
              <button className="relative p-2 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-lg transition-colors">
                <Bell className="w-5 h-5" />
                <Badge 
                  variant="destructive" 
                  className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0 text-xs"
                >
                  3
                </Badge>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Portfolio Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700/50 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm font-medium">Total Value</p>
                <p className="text-2xl font-bold text-slate-100 mt-1">$2,847,392</p>
                <p className="text-green-400 text-sm mt-1 flex items-center">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +12.5% today
                </p>
              </div>
              <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-400" />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700/50 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm font-medium">Today's P&L</p>
                <p className="text-2xl font-bold text-green-400 mt-1">+$47,293</p>
                <p className="text-slate-400 text-sm mt-1">+1.69% change</p>
              </div>
              <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-blue-400" />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700/50 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm font-medium">Active Positions</p>
                <p className="text-2xl font-bold text-slate-100 mt-1">12</p>
                <p className="text-slate-400 text-sm mt-1">3 sectors</p>
              </div>
              <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-purple-400" />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700/50 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm font-medium">Cash Available</p>
                <p className="text-2xl font-bold text-slate-100 mt-1">$184,729</p>
                <p className="text-slate-400 text-sm mt-1">6.5% of portfolio</p>
              </div>
              <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-yellow-400" />
              </div>
            </div>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Company Watchlist - Takes up 2 columns */}
          <div className="lg:col-span-2">
            <CompanyWatchlist />
          </div>

          {/* Sidebar Content */}
          <div className="space-y-6">
            {/* Market Alerts */}
            <Card className="p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700/50 backdrop-blur-sm">
              <h3 className="text-lg font-semibold text-slate-100 mb-4 flex items-center">
                <Bell className="w-5 h-5 mr-2 text-yellow-400" />
                Market Alerts
              </h3>
              <div className="space-y-3">
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="destructive" className="text-xs">HIGH</Badge>
                    <span className="text-xs text-slate-400">2 min ago</span>
                  </div>
                  <p className="text-sm text-slate-200 font-medium">Bond Market Warning</p>
                  <p className="text-xs text-slate-400 mt-1">Inverted yield curve detected</p>
                </div>
                
                <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline" className="text-xs border-yellow-500/30 text-yellow-400">MEDIUM</Badge>
                    <span className="text-xs text-slate-400">15 min ago</span>
                  </div>
                  <p className="text-sm text-slate-200 font-medium">High Volatility</p>
                  <p className="text-xs text-slate-400 mt-1">VIX elevated at 24.8</p>
                </div>
              </div>
            </Card>

            {/* Quick Actions */}
            <Card className="p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700/50 backdrop-blur-sm">
              <h3 className="text-lg font-semibold text-slate-100 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium">
                  Buy Stocks
                </Button>
                <Button variant="outline" className="w-full border-slate-600 text-slate-300 hover:bg-slate-800">
                  Sell Stocks
                </Button>
                <Button variant="outline" className="w-full border-slate-600 text-slate-300 hover:bg-slate-800">
                  Currency Exchange
                </Button>
              </div>
            </Card>

            {/* Performance Summary */}
            <Card className="p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700/50 backdrop-blur-sm">
              <h3 className="text-lg font-semibold text-slate-100 mb-4">Performance</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 text-sm">1 Day</span>
                  <span className="text-green-400 font-medium">+1.69%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 text-sm">1 Week</span>
                  <span className="text-green-400 font-medium">+4.23%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 text-sm">1 Month</span>
                  <span className="text-green-400 font-medium">+8.91%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 text-sm">YTD</span>
                  <span className="text-green-400 font-medium">+24.67%</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}