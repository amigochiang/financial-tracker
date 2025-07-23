import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain } from "lucide-react";

interface AIRecommendation {
  id: number;
  signal: "BUY" | "SELL" | "HOLD";
  confidence: string;
  targetPrice?: string;
  reasoning: string;
  fxAdvantage?: string;
  optimalTiming?: string;
  company?: {
    name: string;
    ticker: string;
  };
}

export default function AIRecommendations() {
  const { data: recommendations = [], isLoading } = useQuery<AIRecommendation[]>({
    queryKey: ["/api/ai/recommendations"],
    refetchInterval: 120000, // Refresh every 2 minutes
  });

  const getSignalColor = (signal: string) => {
    switch (signal) {
      case "BUY": return "success";
      case "SELL": return "danger";
      case "HOLD": return "warning";
      default: return "secondary";
    }
  };

  const getSignalGradient = (signal: string) => {
    switch (signal) {
      case "BUY": return "from-success/20 to-success/10 border-success/30";
      case "SELL": return "from-danger/20 to-danger/10 border-danger/30";
      case "HOLD": return "from-warning/20 to-warning/10 border-warning/30";
      default: return "from-slate-700/20 to-slate-700/10 border-slate-700/30";
    }
  };

  if (isLoading) {
    return (
      <Card className="gradient-card p-6 border-slate-700">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-3">
            <h2 className="text-xl font-semibold">AI Recommendations</h2>
            <div className="w-2 h-2 bg-purple rounded-full animate-pulse-subtle"></div>
          </div>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="animate-pulse">
              <div className="h-24 bg-slate-700 rounded-lg"></div>
            </div>
          ))}
        </div>
      </Card>
    );
  }

  return (
    <Card className="gradient-card p-6 border-slate-700">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-3">
          <h2 className="text-xl font-semibold">AI Recommendations</h2>
          <div className="w-2 h-2 bg-purple rounded-full animate-pulse-subtle"></div>
        </div>
        <button className="text-xs text-slate-400 hover:text-slate-300">
          Last updated: 2 min ago
        </button>
      </div>

      <div className="space-y-4">
        {recommendations.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Brain className="w-12 h-12 mx-auto mb-4 text-purple" />
            <p className="text-sm">No AI recommendations available</p>
            <p className="text-xs mt-1">Generating new recommendations...</p>
          </div>
        ) : (
          recommendations.slice(0, 3).map((recommendation) => (
            <div
              key={recommendation.id}
              className={`bg-gradient-to-r ${getSignalGradient(recommendation.signal)} border rounded-lg p-4 ${
                recommendation.signal === "BUY" ? "trading-signal" : ""
              }`}
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 bg-${getSignalColor(recommendation.signal)} rounded-full`}></div>
                  <span className={`font-semibold text-${getSignalColor(recommendation.signal)}`}>
                    {recommendation.signal}
                  </span>
                </div>
                <span className="text-xs text-slate-400">
                  Confidence: {recommendation.confidence}%
                </span>
              </div>
              
              <p className="text-sm text-slate-300 mb-2">
                {recommendation.company?.name} ({recommendation.company?.ticker})
              </p>
              
              <p className="text-xs text-slate-400 mb-3">
                {recommendation.reasoning}
              </p>
              
              <div className="flex justify-between text-xs">
                {recommendation.targetPrice && (
                  <span className={`text-${getSignalColor(recommendation.signal)}`}>
                    Target: ${parseFloat(recommendation.targetPrice).toFixed(2)}
                  </span>
                )}
                {recommendation.fxAdvantage && (
                  <span className={parseFloat(recommendation.fxAdvantage) >= 0 ? "text-cyan" : "text-danger"}>
                    FX {parseFloat(recommendation.fxAdvantage) >= 0 ? "Advantage" : "Disadvantage"}: {recommendation.fxAdvantage}%
                  </span>
                )}
              </div>
              
              {recommendation.optimalTiming && (
                <div className="mt-2 text-xs text-slate-400">
                  <strong>Timing:</strong> {recommendation.optimalTiming}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-slate-700">
        <Button className="w-full bg-purple hover:bg-purple/90 text-white font-medium transition-colors flex items-center justify-center space-x-2">
          <Brain className="w-4 h-4" />
          <span>View Detailed Analysis</span>
        </Button>
      </div>
    </Card>
  );
}
