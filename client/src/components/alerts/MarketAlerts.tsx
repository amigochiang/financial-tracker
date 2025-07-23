import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { AlertTriangle, TrendingDown } from "lucide-react";

interface MarketAlert {
  id: number;
  type: string;
  severity: "LOW" | "MEDIUM" | "HIGH";
  title: string;
  description: string;
  isActive: boolean;
}

interface NewsArticle {
  id: number;
  title: string;
  sentiment: "POSITIVE" | "NEGATIVE" | "NEUTRAL";
  impact: "LOW" | "MEDIUM" | "HIGH";
  publishedAt: string;
}

export default function MarketAlerts() {
  const { data: alerts = [] } = useQuery<MarketAlert[]>({
    queryKey: ["/api/market/alerts"],
    refetchInterval: 60000, // Refresh every minute
  });

  const { data: news = [] } = useQuery<NewsArticle[]>({
    queryKey: ["/api/news"],
    refetchInterval: 120000, // Refresh every 2 minutes
  });

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "HIGH": return "danger";
      case "MEDIUM": return "warning";
      case "LOW": return "success";
      default: return "secondary";
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "POSITIVE": return "success";
      case "NEGATIVE": return "danger";
      case "NEUTRAL": return "warning";
      default: return "secondary";
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes} min ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)} hour${Math.floor(diffInMinutes / 60) > 1 ? 's' : ''} ago`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)} day${Math.floor(diffInMinutes / 1440) > 1 ? 's' : ''} ago`;
    }
  };

  return (
    <Card className="gradient-card p-6 border-slate-700 lg:col-span-2">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold">Market Alerts & News</h2>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-danger rounded-full animate-pulse-subtle"></div>
          <span className="text-xs text-slate-400">{alerts.length} Active Alerts</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Bond Market Warning */}
        <div className="bg-gradient-to-r from-danger/20 to-danger/10 border border-danger/30 rounded-lg p-4">
          <div className="flex items-center space-x-3 mb-3">
            <AlertTriangle className="w-5 h-5 text-danger" />
            <span className="font-semibold text-danger">BOND ALERT</span>
          </div>
          <p className="text-sm text-slate-300 mb-2">US 10Y Treasury Yield</p>
          <p className="text-xs text-slate-400 mb-3">
            Inverted yield curve detected. Historical indicator of market corrections within 6-18 months.
          </p>
          <div className="flex justify-between text-xs">
            <span className="text-slate-400">Current: 4.85%</span>
            <span className="text-danger">Risk: High</span>
          </div>
        </div>

        {/* Market Sentiment */}
        <div className="bg-gradient-to-r from-warning/20 to-warning/10 border border-warning/30 rounded-lg p-4">
          <div className="flex items-center space-x-3 mb-3">
            <TrendingDown className="w-5 h-5 text-warning" />
            <span className="font-semibold text-warning">SENTIMENT</span>
          </div>
          <p className="text-sm text-slate-300 mb-2">Market Fear Index</p>
          <p className="text-xs text-slate-400 mb-3">
            VIX elevated at 24.8. Institutional selling pressure increasing across tech sector.
          </p>
          <div className="flex justify-between text-xs">
            <span className="text-slate-400">VIX: 24.8</span>
            <span className="text-warning">Caution</span>
          </div>
        </div>
      </div>

      {/* Recent News with Sentiment */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-slate-300 mb-3">Latest Market News</h3>
        
        {news.length === 0 ? (
          <div className="text-center py-4 text-muted-foreground">
            <p className="text-sm">No recent news available</p>
          </div>
        ) : (
          <div className="space-y-3">
            {/* Sample news items */}
            <div className="flex items-start space-x-3 p-3 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-colors">
              <div className="w-2 h-2 bg-danger rounded-full mt-2 flex-shrink-0"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-200">
                  Fed Signals Potential Rate Hikes Amid Inflation Concerns
                </p>
                <div className="flex items-center space-x-4 mt-2">
                  <span className="text-xs text-slate-400">15 min ago</span>
                  <span className="text-xs px-2 py-1 bg-danger/20 text-danger rounded">Negative</span>
                  <span className="text-xs text-slate-400">Impact: High</span>
                </div>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-3 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-colors">
              <div className="w-2 h-2 bg-success rounded-full mt-2 flex-shrink-0"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-200">
                  Apple Reports Strong iPhone Sales in Asian Markets
                </p>
                <div className="flex items-center space-x-4 mt-2">
                  <span className="text-xs text-slate-400">32 min ago</span>
                  <span className="text-xs px-2 py-1 bg-success/20 text-success rounded">Positive</span>
                  <span className="text-xs text-slate-400">Impact: Medium</span>
                </div>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-3 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-colors">
              <div className="w-2 h-2 bg-warning rounded-full mt-2 flex-shrink-0"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-200">
                  Iron Ore Futures Decline on China Manufacturing Data
                </p>
                <div className="flex items-center space-x-4 mt-2">
                  <span className="text-xs text-slate-400">1 hour ago</span>
                  <span className="text-xs px-2 py-1 bg-warning/20 text-warning rounded">Neutral</span>
                  <span className="text-xs text-slate-400">Impact: Medium</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
