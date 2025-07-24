// Database schema definitions and types
export interface User {
  id: number;
  username: string;
  email?: string;
  createdAt: Date;
}

export interface InsertUser {
  username: string;
  email?: string;
}

export interface Company {
  id: number;
  name: string;
  ticker: string;
  sector: string;
  currency: string;
  financials?: {
    cashReserves?: number;
    annualRevenue?: number;
    annualProfit?: number;
    productAnnualRevenue?: number;
    annualGrossProfit?: number;
  };
  createdAt: Date;
}

export interface InsertCompany {
  name: string;
  ticker: string;
  sector: string;
  currency: string;
  financials?: {
    cashReserves?: number;
    annualRevenue?: number;
    annualProfit?: number;
    productAnnualRevenue?: number;
    annualGrossProfit?: number;
  };
}

export interface PortfolioPosition {
  id: number;
  userId: number;
  companyId: number;
  shares: string;
  averageCost: string;
  purchaseCurrency: string;
  createdAt: Date;
}

export interface InsertPortfolioPosition {
  userId: number;
  companyId: number;
  shares: string;
  averageCost: string;
  purchaseCurrency: string;
}

export interface CEOProfile {
  id: number;
  companyId: number;
  name: string;
  title: string;
  tenure: number;
  religion: string;
  strategy: string;
  leadership: string;
  photoUrl?: string;
  createdAt: Date;
}

export interface InsertCEOProfile {
  companyId: number;
  name: string;
  title: string;
  tenure: number;
  religion: string;
  strategy: string;
  leadership: string;
  photoUrl?: string;
}

export interface AIRecommendation {
  id: number;
  companyId: number;
  signal: "BUY" | "SELL" | "HOLD";
  confidence: string;
  targetPrice?: string;
  reasoning: string;
  fxAdvantage?: string;
  optimalTiming?: string;
  createdAt: Date;
}

export interface InsertAIRecommendation {
  companyId: number;
  signal: "BUY" | "SELL" | "HOLD";
  confidence: string;
  targetPrice?: string;
  reasoning: string;
  fxAdvantage?: string;
  optimalTiming?: string;
}

export interface CurrencyRate {
  id: number;
  fromCurrency: string;
  toCurrency: string;
  rate: string;
  change: string;
  changePercent: string;
  forecast24h?: string;
  volatilityRisk?: string;
  updatedAt: Date;
}

export interface InsertCurrencyRate {
  fromCurrency: string;
  toCurrency: string;
  rate: string;
  change: string;
  changePercent: string;
  forecast24h?: string;
  volatilityRisk?: string;
}

export interface MarketAlert {
  id: number;
  type: string;
  severity: "LOW" | "MEDIUM" | "HIGH";
  title: string;
  description: string;
  isActive: boolean;
  createdAt: Date;
}

export interface InsertMarketAlert {
  type: string;
  severity: "LOW" | "MEDIUM" | "HIGH";
  title: string;
  description: string;
  isActive: boolean;
}

export interface NewsArticle {
  id: number;
  title: string;
  content: string;
  source: string;
  companyId?: number;
  sentiment: "POSITIVE" | "NEGATIVE" | "NEUTRAL";
  publishedAt: Date;
  createdAt: Date;
}

export interface InsertNewsArticle {
  title: string;
  content: string;
  source: string;
  companyId?: number;
  sentiment: "POSITIVE" | "NEGATIVE" | "NEUTRAL";
  publishedAt: Date;
}

// Schema validation (basic implementation without Zod)
export const insertCompanySchema = {
  parse: (data: any): InsertCompany => {
    if (!data.name || !data.ticker || !data.sector || !data.currency) {
      throw new Error("Missing required company fields");
    }
    return data as InsertCompany;
  }
};

export const insertPortfolioPositionSchema = {
  parse: (data: any): InsertPortfolioPosition => {
    if (!data.companyId || !data.shares || !data.averageCost || !data.purchaseCurrency) {
      throw new Error("Missing required portfolio position fields");
    }
    return data as InsertPortfolioPosition;
  }
};

export const insertCEOProfileSchema = {
  parse: (data: any): InsertCEOProfile => {
    if (!data.companyId || !data.name || !data.title) {
      throw new Error("Missing required CEO profile fields");
    }
    return data as InsertCEOProfile;
  }
};

export const insertMarketAlertSchema = {
  parse: (data: any): InsertMarketAlert => {
    if (!data.type || !data.severity || !data.title || !data.description) {
      throw new Error("Missing required market alert fields");
    }
    return data as InsertMarketAlert;
  }
};

export const insertNewsArticleSchema = {
  parse: (data: any): InsertNewsArticle => {
    if (!data.title || !data.content || !data.source || !data.sentiment) {
      throw new Error("Missing required news article fields");
    }
    return data as InsertNewsArticle;
  }
};

// Export placeholder objects to maintain compatibility
export const users = {};
export const companies = {};
export const portfolioPositions = {};
export const ceoProfiles = {};
export const aiRecommendations = {};
export const currencyRates = {};
export const marketAlerts = {};
export const newsArticles = {};
