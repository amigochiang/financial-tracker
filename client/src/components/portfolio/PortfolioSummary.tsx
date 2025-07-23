interface PortfolioSummaryProps {
  summary?: {
    totalValueTWD: number;
    totalChangeTWD: number;
    changePercent: number;
    fxImpactTWD: number;
  };
  baseCurrency: string;
  formatCurrency: (amount: number, currency?: string) => string;
}

export default function PortfolioSummary({ summary, baseCurrency, formatCurrency }: PortfolioSummaryProps) {
  if (!summary) {
    return (
      <div className="bg-gradient-to-br from-primary/20 to-purple/20 rounded-xl p-6 mb-6 border border-slate-700">
        <h2 className="text-lg font-semibold mb-4">Portfolio Summary</h2>
        <div className="space-y-3">
          <div className="animate-pulse">
            <div className="h-4 bg-slate-700 rounded w-3/4 mb-2"></div>
            <div className="h-8 bg-slate-700 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  const isPositive = summary.totalChangeTWD >= 0;

  return (
    <div className="bg-gradient-to-br from-primary/20 to-purple/20 rounded-xl p-6 mb-6 border border-slate-700">
      <h2 className="text-lg font-semibold mb-4">Portfolio Summary</h2>
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-slate-400">Total Value ({baseCurrency})</span>
          <span className="text-xl font-bold text-slate-100">
            {formatCurrency(summary.totalValueTWD, baseCurrency)}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-slate-400">Today's Change</span>
          <span className={`text-lg font-semibold ${isPositive ? 'text-success' : 'text-danger'}`}>
            {isPositive ? '+' : ''}{formatCurrency(summary.totalChangeTWD, baseCurrency)} ({isPositive ? '+' : ''}{summary.changePercent.toFixed(2)}%)
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-slate-400">FX Impact</span>
          <span className={`text-sm ${summary.fxImpactTWD >= 0 ? 'text-cyan' : 'text-warning'}`}>
            {summary.fxImpactTWD >= 0 ? '+' : ''}{formatCurrency(summary.fxImpactTWD, baseCurrency)} ({(summary.fxImpactTWD / summary.totalValueTWD * 100).toFixed(2)}%)
          </span>
        </div>
      </div>
    </div>
  );
}
