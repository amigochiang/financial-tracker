import { storage } from "../storage";

export interface StockPrice {
  ticker: string;
  price: number;
  change: number;
  changePercent: number;
  currency: string;
  priceInTWD: number;
}

export interface PortfolioSummary {
  totalValueTWD: number;
  totalChangeTWD: number;
  changePercent: number;
  fxImpactTWD: number;
  positions: PortfolioPosition[];
}

export interface PortfolioPosition {
  company: any;
  shares: number;
  averageCost: number;
  currentPrice: number;
  currentValueTWD: number;
  totalReturnTWD: number;
  totalReturnPercent: number;
  fxImpact: number;
}

export class FinancialService {
  private stockPrices: Map<string, StockPrice> = new Map();
  private currencyRates: Map<string, number> = new Map();

  constructor() {
    this.initializeMockData();
  }

  private initializeMockData() {
    // Initialize mock stock prices
    this.stockPrices.set("AAPL", {
      ticker: "AAPL",
      price: 175.32,
      change: 2.45,
      changePercent: 1.42,
      currency: "USD",
      priceInTWD: 175.32 * 31.245
    });

    this.stockPrices.set("TSLA", {
      ticker: "TSLA",
      price: 248.50,
      change: -8.22,
      changePercent: -3.20,
      currency: "USD",
      priceInTWD: 248.50 * 31.245
    });

    this.stockPrices.set("FMG", {
      ticker: "FMG",
      price: 24.67,
      change: 0.85,
      changePercent: 3.57,
      currency: "AUD",
      priceInTWD: 24.67 * 20.467
    });

    // Initialize currency rates
    this.currencyRates.set("USD", 31.245);
    this.currencyRates.set("AUD", 20.467);
    this.currencyRates.set("JPY", 0.2089);
    this.currencyRates.set("TWD", 1.0);
  }

  async getStockPrice(ticker: string): Promise<StockPrice | undefined> {
    // In production, this would fetch from real financial APIs
    const price = this.stockPrices.get(ticker);
    if (price) {
      // Add some randomness to simulate real-time updates
      const variation = (Math.random() - 0.5) * 0.02; // ±1% variation
      const newPrice = price.price * (1 + variation);
      const newChange = newPrice - price.price;
      const newChangePercent = (newChange / price.price) * 100;
      
      const currencyRate = this.currencyRates.get(price.currency) || 1;
      
      return {
        ...price,
        price: newPrice,
        change: newChange,
        changePercent: newChangePercent,
        priceInTWD: newPrice * currencyRate
      };
    }
    return undefined;
  }

  async getPortfolioSummary(userId: number): Promise<PortfolioSummary> {
    const positions = await storage.getPortfolioPositions(userId);
    const companies = await storage.getAllCompanies();
    
    let totalValueTWD = 0;
    let totalChangeTWD = 0;
    let totalCostTWD = 0;
    let fxImpactTWD = 0;
    
    const portfolioPositions: PortfolioPosition[] = [];

    for (const position of positions) {
      const company = companies.find(c => c.id === position.companyId);
      if (!company) continue;

      const stockPrice = await this.getStockPrice(company.ticker);
      if (!stockPrice) continue;

      const shares = parseFloat(position.shares);
      const averageCost = parseFloat(position.averageCost);
      const currentValueTWD = shares * stockPrice.priceInTWD;
      const costInTWD = shares * averageCost * (this.currencyRates.get(position.purchaseCurrency) || 1);
      const totalReturnTWD = currentValueTWD - costInTWD;
      const totalReturnPercent = (totalReturnTWD / costInTWD) * 100;
      
      // Calculate FX impact (difference between purchase rate and current rate)
      const currentFXRate = this.currencyRates.get(company.currency) || 1;
      const purchaseFXRate = this.currencyRates.get(position.purchaseCurrency) || 1;
      const fxImpact = shares * stockPrice.price * (currentFXRate - purchaseFXRate);

      portfolioPositions.push({
        company,
        shares,
        averageCost,
        currentPrice: stockPrice.priceInTWD,
        currentValueTWD,
        totalReturnTWD,
        totalReturnPercent,
        fxImpact
      });

      totalValueTWD += currentValueTWD;
      totalCostTWD += costInTWD;
      fxImpactTWD += fxImpact;
    }

    totalChangeTWD = totalValueTWD - totalCostTWD;
    const changePercent = totalCostTWD > 0 ? (totalChangeTWD / totalCostTWD) * 100 : 0;

    return {
      totalValueTWD,
      totalChangeTWD,
      changePercent,
      fxImpactTWD,
      positions: portfolioPositions
    };
  }

  async updateCurrencyRates(): Promise<void> {
    // In production, this would fetch from currency APIs like OpenExchangeRates, CurrencyAPI, etc.
    const rates = await storage.getCurrencyRates();
    
    for (const rate of rates) {
      this.currencyRates.set(rate.fromCurrency, parseFloat(rate.rate));
      
      // Simulate real-time rate updates
      const variation = (Math.random() - 0.5) * 0.001; // ±0.1% variation
      const newRate = parseFloat(rate.rate) * (1 + variation);
      const change = newRate - parseFloat(rate.rate);
      const changePercent = (change / parseFloat(rate.rate)) * 100;
      
      await storage.updateCurrencyRate({
        fromCurrency: rate.fromCurrency,
        toCurrency: rate.toCurrency,
        rate: newRate.toString(),
        change: change.toString(),
        changePercent: changePercent.toString(),
        forecast24h: rate.forecast24h,
        volatilityRisk: rate.volatilityRisk
      });
    }
  }

  async calculateOptimalTradingTime(ticker: string, action: "BUY" | "SELL"): Promise<{
    recommended: boolean;
    reason: string;
    optimalWindow: string;
    fxAdvantage: number;
  }> {
    const company = await storage.getCompanyByTicker(ticker);
    if (!company) {
      return {
        recommended: false,
        reason: "Company not found",
        optimalWindow: "N/A",
        fxAdvantage: 0
      };
    }

    const currencyRate = await storage.getCurrencyRate(company.currency, "TWD");
    if (!currencyRate) {
      return {
        recommended: true,
        reason: "No currency data available",
        optimalWindow: "Immediate",
        fxAdvantage: 0
      };
    }

    const changePercent = parseFloat(currencyRate.changePercent || "0");
    const fxAdvantage = action === "BUY" ? -changePercent : changePercent;
    
    let recommended = true;
    let reason = "Current FX rates are favorable";
    let optimalWindow = "Next 24 hours";

    if (action === "SELL" && changePercent < -1) {
      recommended = false;
      reason = "Currency rates unfavorable for TWD conversion. Consider waiting.";
      optimalWindow = "Wait 2-3 days for better rates";
    } else if (action === "BUY" && changePercent > 1) {
      recommended = false;
      reason = "Currency rates make purchase more expensive. Consider waiting.";
      optimalWindow = "Wait for currency dip";
    } else if (Math.abs(changePercent) > 0.5) {
      optimalWindow = "Monitor rates closely - volatile period";
    }

    return {
      recommended,
      reason,
      optimalWindow,
      fxAdvantage: Math.round(fxAdvantage * 100) / 100
    };
  }

  async getDividendProjections(userId: number): Promise<{
    annualDividendTWD: number;
    yieldPercent: number;
    nextPaymentTWD: number;
    nextPaymentDate: Date;
  }> {
    const summary = await this.getPortfolioSummary(userId);
    
    // Simulate dividend calculations
    let totalAnnualDividends = 0;
    
    for (const position of summary.positions) {
      const dividendYield = this.getDividendYield(position.company.ticker);
      const annualDividend = position.currentValueTWD * (dividendYield / 100);
      totalAnnualDividends += annualDividend;
    }

    const overallYield = summary.totalValueTWD > 0 ? (totalAnnualDividends / summary.totalValueTWD) * 100 : 0;
    
    return {
      annualDividendTWD: totalAnnualDividends,
      yieldPercent: overallYield,
      nextPaymentTWD: totalAnnualDividends / 4, // Quarterly estimate
      nextPaymentDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // Next month
    };
  }

  private getDividendYield(ticker: string): number {
    const yields: { [key: string]: number } = {
      "AAPL": 0.52,
      "TSLA": 0.0,
      "FMG": 8.5
    };
    return yields[ticker] || 2.0;
  }
}

export const financialService = new FinancialService();
