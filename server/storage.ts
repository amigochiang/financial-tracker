import {
  users, companies, portfolioPositions, ceoProfiles, aiRecommendations,
  currencyRates, marketAlerts, newsArticles,
  type User, type InsertUser, type Company, type InsertCompany,
  type PortfolioPosition, type InsertPortfolioPosition,
  type CEOProfile, type InsertCEOProfile,
  type AIRecommendation, type InsertAIRecommendation,
  type CurrencyRate, type InsertCurrencyRate,
  type MarketAlert, type InsertMarketAlert,
  type NewsArticle, type InsertNewsArticle
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Company operations
  getAllCompanies(): Promise<Company[]>;
  getCompany(id: number): Promise<Company | undefined>;
  getCompanyByTicker(ticker: string): Promise<Company | undefined>;
  createCompany(company: InsertCompany): Promise<Company>;
  updateCompanyFinancials(id: number, financials: any): Promise<Company | undefined>;

  // Portfolio operations
  getPortfolioPositions(userId: number): Promise<PortfolioPosition[]>;
  getPortfolioPosition(userId: number, companyId: number): Promise<PortfolioPosition | undefined>;
  createPortfolioPosition(position: InsertPortfolioPosition): Promise<PortfolioPosition>;
  updatePortfolioPosition(id: number, shares: string, averageCost: string): Promise<PortfolioPosition | undefined>;
  deletePortfolioPosition(id: number): Promise<boolean>;

  // CEO Profile operations
  getCEOProfiles(): Promise<CEOProfile[]>;
  getCEOProfileByCompany(companyId: number): Promise<CEOProfile | undefined>;
  createCEOProfile(profile: InsertCEOProfile): Promise<CEOProfile>;

  // AI Recommendation operations
  getAIRecommendations(): Promise<AIRecommendation[]>;
  getAIRecommendationsByCompany(companyId: number): Promise<AIRecommendation[]>;
  createAIRecommendation(recommendation: InsertAIRecommendation): Promise<AIRecommendation>;

  // Currency operations
  getCurrencyRates(): Promise<CurrencyRate[]>;
  getCurrencyRate(fromCurrency: string, toCurrency: string): Promise<CurrencyRate | undefined>;
  updateCurrencyRate(rate: InsertCurrencyRate): Promise<CurrencyRate>;

  // Market Alert operations
  getActiveMarketAlerts(): Promise<MarketAlert[]>;
  createMarketAlert(alert: InsertMarketAlert): Promise<MarketAlert>;
  deactivateMarketAlert(id: number): Promise<boolean>;

  // News operations
  getRecentNews(limit?: number): Promise<NewsArticle[]>;
  getNewsByCompany(companyId: number): Promise<NewsArticle[]>;
  createNewsArticle(article: InsertNewsArticle): Promise<NewsArticle>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private companies: Map<number, Company>;
  private portfolioPositions: Map<number, PortfolioPosition>;
  private ceoProfiles: Map<number, CEOProfile>;
  private aiRecommendations: Map<number, AIRecommendation>;
  private currencyRates: Map<string, CurrencyRate>;
  private marketAlerts: Map<number, MarketAlert>;
  private newsArticles: Map<number, NewsArticle>;
  private currentId: number;

  constructor() {
    this.users = new Map();
    this.companies = new Map();
    this.portfolioPositions = new Map();
    this.ceoProfiles = new Map();
    this.aiRecommendations = new Map();
    this.currencyRates = new Map();
    this.marketAlerts = new Map();
    this.newsArticles = new Map();
    this.currentId = 1;
    this.initializeData();
  }

  private initializeData() {
    // Initialize with sample companies
    const appleId = this.currentId++;
    const teslaId = this.currentId++;
    const fortescueId = this.currentId++;

    this.companies.set(appleId, {
      id: appleId,
      name: "Apple Inc.",
      ticker: "AAPL",
      sector: "Technology",
      currency: "USD",
      financials: {
        cashReserves: 62000,
        annualRevenue: 383000,
        annualProfit: 100000,
        productAnnualRevenue: 300000,
        annualGrossProfit: 170000
      },
      createdAt: new Date()
    });

    this.companies.set(teslaId, {
      id: teslaId,
      name: "Tesla Inc.",
      ticker: "TSLA",
      sector: "Automotive",
      currency: "USD",
      financials: {
        cashReserves: 22000,
        annualRevenue: 96773,
        annualProfit: 1535,
        productAnnualRevenue: 80000,
        annualGrossProfit: 20000
      },
      createdAt: new Date()
    });

    this.companies.set(fortescueId, {
      id: fortescueId,
      name: "Fortescue Metals Group",
      ticker: "FMG",
      sector: "Mining",
      currency: "AUD",
      financials: {
        cashReserves: 4900,
        annualRevenue: 18220,
        annualProfit: 5700,
        productAnnualRevenue: 16400,
        annualGrossProfit: 9547
      },
      createdAt: new Date()
    });

    // Initialize CEO profiles
    this.ceoProfiles.set(this.currentId++, {
      id: this.currentId,
      companyId: appleId,
      name: "Tim Cook",
      title: "CEO",
      tenure: 13,
      religion: "Christian",
      strategy: "Innovation-focused",
      leadership: "Transformational",
      photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      createdAt: new Date()
    });

    this.ceoProfiles.set(this.currentId++, {
      id: this.currentId,
      companyId: teslaId,
      name: "Elon Musk",
      title: "CEO",
      tenure: 15,
      religion: "Other Religion",
      strategy: "Disruptive Growth",
      leadership: "Visionary",
      photoUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      createdAt: new Date()
    });

    this.ceoProfiles.set(this.currentId++, {
      id: this.currentId,
      companyId: fortescueId,
      name: "Andrew Forrest",
      title: "Executive Chairman",
      tenure: 18,
      religion: "Christian",
      strategy: "ESG-focused",
      leadership: "Sustainable",
      photoUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face",
      createdAt: new Date()
    });

    // Initialize currency rates
    this.currencyRates.set("USD-TWD", {
      id: this.currentId++,
      fromCurrency: "USD",
      toCurrency: "TWD",
      rate: "31.245",
      change: "0.12",
      changePercent: "0.38",
      forecast24h: "Bullish (+0.8%)",
      volatilityRisk: "Low (12%)",
      updatedAt: new Date()
    });

    this.currencyRates.set("JPY-TWD", {
      id: this.currentId++,
      fromCurrency: "JPY",
      toCurrency: "TWD",
      rate: "0.2089",
      change: "-0.003",
      changePercent: "-1.42",
      forecast24h: "Bearish (-0.5%)",
      volatilityRisk: "Medium (18%)",
      updatedAt: new Date()
    });

    this.currencyRates.set("AUD-TWD", {
      id: this.currentId++,
      fromCurrency: "AUD",
      toCurrency: "TWD",
      rate: "20.467",
      change: "0.08",
      changePercent: "0.39",
      forecast24h: "Stable (+0.2%)",
      volatilityRisk: "Low (10%)",
      updatedAt: new Date()
    });
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Company operations
  async getAllCompanies(): Promise<Company[]> {
    return Array.from(this.companies.values());
  }

  async getCompany(id: number): Promise<Company | undefined> {
    return this.companies.get(id);
  }

  async getCompanyByTicker(ticker: string): Promise<Company | undefined> {
    return Array.from(this.companies.values()).find(company => company.ticker === ticker);
  }

  async createCompany(insertCompany: InsertCompany): Promise<Company> {
    const id = this.currentId++;
    const company: Company = { ...insertCompany, id, createdAt: new Date() };
    this.companies.set(id, company);
    return company;
  }

  async updateCompanyFinancials(id: number, financials: any): Promise<Company | undefined> {
    const company = this.companies.get(id);
    if (company) {
      const updated = { ...company, financials };
      this.companies.set(id, updated);
      return updated;
    }
    return undefined;
  }

  // Portfolio operations
  async getPortfolioPositions(userId: number): Promise<PortfolioPosition[]> {
    return Array.from(this.portfolioPositions.values()).filter(position => position.userId === userId);
  }

  async getPortfolioPosition(userId: number, companyId: number): Promise<PortfolioPosition | undefined> {
    return Array.from(this.portfolioPositions.values()).find(
      position => position.userId === userId && position.companyId === companyId
    );
  }

  async createPortfolioPosition(insertPosition: InsertPortfolioPosition): Promise<PortfolioPosition> {
    const id = this.currentId++;
    const position: PortfolioPosition = { ...insertPosition, id, createdAt: new Date() };
    this.portfolioPositions.set(id, position);
    return position;
  }

  async updatePortfolioPosition(id: number, shares: string, averageCost: string): Promise<PortfolioPosition | undefined> {
    const position = this.portfolioPositions.get(id);
    if (position) {
      const updated = { ...position, shares, averageCost };
      this.portfolioPositions.set(id, updated);
      return updated;
    }
    return undefined;
  }

  async deletePortfolioPosition(id: number): Promise<boolean> {
    return this.portfolioPositions.delete(id);
  }

  // CEO Profile operations
  async getCEOProfiles(): Promise<CEOProfile[]> {
    return Array.from(this.ceoProfiles.values());
  }

  async getCEOProfileByCompany(companyId: number): Promise<CEOProfile | undefined> {
    return Array.from(this.ceoProfiles.values()).find(profile => profile.companyId === companyId);
  }

  async createCEOProfile(insertProfile: InsertCEOProfile): Promise<CEOProfile> {
    const id = this.currentId++;
    const profile: CEOProfile = { ...insertProfile, id, createdAt: new Date() };
    this.ceoProfiles.set(id, profile);
    return profile;
  }

  // AI Recommendation operations
  async getAIRecommendations(): Promise<AIRecommendation[]> {
    return Array.from(this.aiRecommendations.values());
  }

  async getAIRecommendationsByCompany(companyId: number): Promise<AIRecommendation[]> {
    return Array.from(this.aiRecommendations.values()).filter(rec => rec.companyId === companyId);
  }

  async createAIRecommendation(insertRecommendation: InsertAIRecommendation): Promise<AIRecommendation> {
    const id = this.currentId++;
    const recommendation: AIRecommendation = { ...insertRecommendation, id, createdAt: new Date() };
    this.aiRecommendations.set(id, recommendation);
    return recommendation;
  }

  // Currency operations
  async getCurrencyRates(): Promise<CurrencyRate[]> {
    return Array.from(this.currencyRates.values());
  }

  async getCurrencyRate(fromCurrency: string, toCurrency: string): Promise<CurrencyRate | undefined> {
    return this.currencyRates.get(`${fromCurrency}-${toCurrency}`);
  }

  async updateCurrencyRate(insertRate: InsertCurrencyRate): Promise<CurrencyRate> {
    const key = `${insertRate.fromCurrency}-${insertRate.toCurrency}`;
    const existing = this.currencyRates.get(key);
    const id = existing?.id || this.currentId++;
    const rate: CurrencyRate = { ...insertRate, id, updatedAt: new Date() };
    this.currencyRates.set(key, rate);
    return rate;
  }

  // Market Alert operations
  async getActiveMarketAlerts(): Promise<MarketAlert[]> {
    return Array.from(this.marketAlerts.values()).filter(alert => alert.isActive);
  }

  async createMarketAlert(insertAlert: InsertMarketAlert): Promise<MarketAlert> {
    const id = this.currentId++;
    const alert: MarketAlert = { ...insertAlert, id, createdAt: new Date() };
    this.marketAlerts.set(id, alert);
    return alert;
  }

  async deactivateMarketAlert(id: number): Promise<boolean> {
    const alert = this.marketAlerts.get(id);
    if (alert) {
      this.marketAlerts.set(id, { ...alert, isActive: false });
      return true;
    }
    return false;
  }

  // News operations
  async getRecentNews(limit: number = 10): Promise<NewsArticle[]> {
    return Array.from(this.newsArticles.values())
      .sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime())
      .slice(0, limit);
  }

  async getNewsByCompany(companyId: number): Promise<NewsArticle[]> {
    return Array.from(this.newsArticles.values()).filter(article => article.companyId === companyId);
  }

  async createNewsArticle(insertArticle: InsertNewsArticle): Promise<NewsArticle> {
    const id = this.currentId++;
    const article: NewsArticle = { ...insertArticle, id, createdAt: new Date() };
    this.newsArticles.set(id, article);
    return article;
  }
}

export const storage = new MemStorage();
