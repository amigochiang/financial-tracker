import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";

interface CurrencyRate {
  id: number;
  fromCurrency: string;
  toCurrency: string;
  rate: string;
  change: string;
  changePercent: string;
  forecast24h?: string;
  volatilityRisk?: string;
}

interface CurrencyRatesProps {
  baseCurrency: string;
}

export default function CurrencyRates({ baseCurrency }: CurrencyRatesProps) {
  const { data: rates = [], isLoading } = useQuery<CurrencyRate[]>({
    queryKey: ["/api/currency/rates"],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const getCurrencyColor = (currency: string) => {
    switch (currency) {
      case "USD": return "primary";
      case "JPY": return "danger";
      case "AUD": return "warning";
      default: return "secondary";
    }
  };

  const formatChange = (change: string, changePercent: string) => {
    const changeNum = parseFloat(change);
    const isPositive = changeNum >= 0;
    return {
      isPositive,
      display: `${isPositive ? '+' : ''}${change} (${isPositive ? '+' : ''}${changePercent}%)`
    };
  };

  if (isLoading) {
    return (
      <Card className="gradient-card p-6 border-slate-700">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold">Currency Rates</h2>
          <span className="text-xs text-slate-400">Base: {baseCurrency}</span>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="animate-pulse">
              <div className="h-16 bg-slate-700 rounded-lg"></div>
            </div>
          ))}
        </div>
      </Card>
    );
  }

  return (
    <Card className="gradient-card p-6 border-slate-700">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold">Currency Rates</h2>
        <span className="text-xs text-slate-400">Base: {baseCurrency}</span>
      </div>

      <div className="space-y-4">
        {rates.map((rate) => {
          const changeInfo = formatChange(rate.change, rate.changePercent);
          const colorClass = getCurrencyColor(rate.fromCurrency);
          
          return (
            <div key={rate.id} className="flex justify-between items-center p-3 bg-slate-700/50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 bg-${colorClass}/20 rounded-full flex items-center justify-center`}>
                  <span className={`text-xs font-bold text-${colorClass}`}>
                    {rate.fromCurrency}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-sm">
                    {rate.fromCurrency}/{rate.toCurrency}
                  </p>
                  <p className="text-xs text-slate-400">
                    {rate.fromCurrency === "JPY" ? "Japanese Yen" : 
                     rate.fromCurrency === "USD" ? "US Dollar" : 
                     rate.fromCurrency === "AUD" ? "Australian Dollar" : 
                     rate.fromCurrency}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-slate-100">
                  {parseFloat(rate.rate).toFixed(rate.fromCurrency === "JPY" ? 4 : 3)}
                </p>
                <p className={`text-xs ${changeInfo.isPositive ? 'text-success' : 'text-danger'}`}>
                  {changeInfo.display}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* FX Forecast Section */}
      <div className="mt-6 pt-4 border-t border-slate-700">
        <h3 className="text-sm font-semibold mb-3 text-cyan">AI FX Forecast (24h)</h3>
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-slate-400">USD/TWD Trend</span>
            <span className="text-success">↗ Bullish (+0.8%)</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-slate-400">Best Buy Window</span>
            <span className="text-warning">14:00-16:00 TST</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-slate-400">Volatility Risk</span>
            <span className="text-success">Low (12%)</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
