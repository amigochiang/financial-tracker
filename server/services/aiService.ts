import { storage } from "../storage";
import { sendTradingRecommendation, sendPortfolioAlert } from "./emailService";

export interface MarketData {
  price: number;
  volume: number;
  sentiment: "POSITIVE" | "NEGATIVE" | "NEUTRAL";
  volatility: number;
}

export interface CurrencyForecast {
  pair: string;
  currentRate: number;
  predicted24h: number;
  confidence: number;
  trend: "BULLISH" | "BEARISH" | "STABLE";
  volatilityRisk: "LOW" | "MEDIUM" | "HIGH";
}

export class AIService {
  private marketDataCache: Map<string, MarketData> = new Map();
  private lastAnalysisTime: Date = new Date();

  // Generate AI trading recommendations based on market data and sentiment
  async generateTradingRecommendations(): Promise<void> {
    const companies = await storage.getAllCompanies();
    
    for (const company of companies) {
      const marketData = await this.getMarketData(company.ticker);
      const newsAnalysis = await this.analyzeNewsSentiment(company.id);
      const fxAnalysis = await this.analyzeCurrencyImpact(company.currency);
      
      const recommendation = this.calculateRecommendation(marketData, newsAnalysis, fxAnalysis);
      
      if (recommendation.confidence > 70) {
        await storage.createAIRecommendation({
          companyId: company.id,
          signal: recommendation.signal,
          confidence: recommendation.confidence.toString(),
          targetPrice: recommendation.targetPrice?.toString(),
          reasoning: recommendation.reasoning,
          fxAdvantage: recommendation.fxAdvantage?.toString(),
          optimalTiming: recommendation.optimalTiming
        });

        // Send email notification for high-confidence recommendations
        if (recommendation.confidence > 85) {
          await sendTradingRecommendation({
            ...recommendation,
            company
          });
        }
      }
    }
  }

  // Analyze currency exchange rates and predict optimal timing
  async forecastCurrencyRates(): Promise<CurrencyForecast[]> {
    const rates = await storage.getCurrencyRates();
    const forecasts: CurrencyForecast[] = [];

    for (const rate of rates) {
      const forecast = this.predictCurrencyMovement(rate);
      forecasts.push(forecast);

      // Update the currency rate with forecast data
      await storage.updateCurrencyRate({
        fromCurrency: rate.fromCurrency,
        toCurrency: rate.toCurrency,
        rate: rate.rate,
        change: rate.change,
        changePercent: rate.changePercent,
        forecast24h: `${forecast.trend} (${(forecast.predicted24h - forecast.currentRate).toFixed(2)})`,
        volatilityRisk: `${forecast.volatilityRisk} (${forecast.confidence}%)`
      });
    }

    return forecasts;
  }

  // Monitor market conditions and generate alerts
  async monitorMarketConditions(): Promise<void> {
    const bondYield = await this.getBondYieldData();
    const vixLevel = await this.getVIXLevel();
    const sentiment = await this.getOverallMarketSentiment();

    // Check for crash indicators
    if (bondYield.isInverted && vixLevel > 25) {
      await storage.createMarketAlert({
        type: "CRASH_WARNING",
        severity: "HIGH",
        title: "Market Crash Risk Elevated",
        description: `Inverted yield curve and elevated VIX (${vixLevel}) indicate potential market correction within 6-18 months.`,
        isActive: true
      });

      await sendPortfolioAlert(
        "MARKET CRASH WARNING",
        `High risk market conditions detected. Consider defensive positioning.`,
        { bondYield: bondYield.current, vix: vixLevel, sentiment }
      );
    }

    // Check for high volatility
    if (vixLevel > 30) {
      await storage.createMarketAlert({
        type: "SENTIMENT",
        severity: "MEDIUM",
        title: "High Market Volatility",
        description: `VIX elevated at ${vixLevel}. Increased market uncertainty detected.`,
        isActive: true
      });
    }
  }

  // Simulate market data retrieval (in production, this would connect to real APIs)
  private async getMarketData(ticker: string): Promise<MarketData> {
    // In production, this would fetch from financial APIs like Alpha Vantage, Yahoo Finance, etc.
    const cached = this.marketDataCache.get(ticker);
    if (cached) return cached;

    // Simulate market data
    const mockData: MarketData = {
      price: 100 + Math.random() * 200,
      volume: Math.floor(Math.random() * 1000000),
      sentiment: Math.random() > 0.6 ? "POSITIVE" : Math.random() > 0.3 ? "NEUTRAL" : "NEGATIVE",
      volatility: Math.random() * 50
    };

    this.marketDataCache.set(ticker, mockData);
    return mockData;
  }

  private async analyzeNewsSentiment(companyId: number): Promise<number> {
    const news = await storage.getNewsByCompany(companyId);
    if (news.length === 0) return 0;

    let sentimentScore = 0;
    for (const article of news) {
      switch (article.sentiment) {
        case "POSITIVE": sentimentScore += 1; break;
        case "NEGATIVE": sentimentScore -= 1; break;
        default: sentimentScore += 0;
      }
    }

    return sentimentScore / news.length;
  }

  private async analyzeCurrencyImpact(currency: string): Promise<number> {
    const rate = await storage.getCurrencyRate(currency, "TWD");
    if (!rate) return 0;

    const changePercent = parseFloat(rate.changePercent || "0");
    return changePercent;
  }

  private calculateRecommendation(
    marketData: MarketData,
    sentimentScore: number,
    fxImpact: number
  ): {
    signal: "BUY" | "SELL" | "HOLD";
    confidence: number;
    targetPrice?: number;
    reasoning: string;
    fxAdvantage?: number;
    optimalTiming?: string;
  } {
    let score = 0;
    let reasoning = "";

    // Market sentiment analysis
    if (marketData.sentiment === "POSITIVE") {
      score += 30;
      reasoning += "Positive market sentiment. ";
    } else if (marketData.sentiment === "NEGATIVE") {
      score -= 30;
      reasoning += "Negative market sentiment. ";
    }

    // News sentiment
    if (sentimentScore > 0.3) {
      score += 25;
      reasoning += "Positive news sentiment. ";
    } else if (sentimentScore < -0.3) {
      score -= 25;
      reasoning += "Negative news sentiment. ";
    }

    // Currency impact
    if (fxImpact > 1) {
      score += 15;
      reasoning += "Favorable currency rates. ";
    } else if (fxImpact < -1) {
      score -= 15;
      reasoning += "Unfavorable currency rates. ";
    }

    // Volatility consideration
    if (marketData.volatility > 40) {
      score -= 10;
      reasoning += "High volatility increases risk. ";
    }

    // Determine signal and confidence
    let signal: "BUY" | "SELL" | "HOLD";
    let confidence: number;

    if (score > 40) {
      signal = "BUY";
      confidence = Math.min(95, 50 + score);
      reasoning += "Strong buy signal detected.";
    } else if (score < -40) {
      signal = "SELL";
      confidence = Math.min(95, 50 + Math.abs(score));
      reasoning += "Strong sell signal detected.";
    } else {
      signal = "HOLD";
      confidence = 60 + Math.random() * 20;
      reasoning += "Mixed signals suggest holding current position.";
    }

    // Calculate optimal timing based on FX rates
    let optimalTiming = "Immediate";
    if (Math.abs(fxImpact) < 0.5) {
      optimalTiming = "Next 24-48 hours";
    } else if (fxImpact < -1 && signal === "SELL") {
      optimalTiming = "Wait for better FX rates";
    }

    return {
      signal,
      confidence: Math.round(confidence),
      targetPrice: marketData.price * (1 + (score / 100)),
      reasoning: reasoning.trim(),
      fxAdvantage: Math.round(fxImpact * 100) / 100,
      optimalTiming
    };
  }

  private predictCurrencyMovement(rate: any): CurrencyForecast {
    const currentRate = parseFloat(rate.rate);
    const change = parseFloat(rate.change || "0");
    
    // Simulate currency prediction algorithm
    const volatility = Math.random() * 0.02; // 2% max volatility
    const trend = change > 0.01 ? "BULLISH" : change < -0.01 ? "BEARISH" : "STABLE";
    const predicted24h = currentRate + (change * 2) + (Math.random() - 0.5) * volatility;
    
    return {
      pair: `${rate.fromCurrency}/${rate.toCurrency}`,
      currentRate,
      predicted24h,
      confidence: Math.floor(70 + Math.random() * 25),
      trend,
      volatilityRisk: volatility > 0.015 ? "HIGH" : volatility > 0.008 ? "MEDIUM" : "LOW"
    };
  }

  private async getBondYieldData(): Promise<{ current: number; isInverted: boolean }> {
    // Simulate bond yield data
    const tenYear = 4.5 + Math.random() * 0.5;
    const twoYear = 4.8 + Math.random() * 0.3;
    
    return {
      current: tenYear,
      isInverted: twoYear > tenYear
    };
  }

  private async getVIXLevel(): Promise<number> {
    // Simulate VIX level
    return 15 + Math.random() * 20;
  }

  private async getOverallMarketSentiment(): Promise<string> {
    const sentiments = ["BULLISH", "BEARISH", "NEUTRAL"];
    return sentiments[Math.floor(Math.random() * sentiments.length)];
  }
}

export const aiService = new AIService();
