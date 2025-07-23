import { pgTable, text, serial, integer, boolean, decimal, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const companies = pgTable("companies", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  ticker: text("ticker").notNull().unique(),
  sector: text("sector"),
  currency: text("currency").notNull().default("USD"),
  financials: jsonb("financials"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const portfolioPositions = pgTable("portfolio_positions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  companyId: integer("company_id").references(() => companies.id),
  shares: decimal("shares", { precision: 10, scale: 2 }).notNull(),
  averageCost: decimal("average_cost", { precision: 10, scale: 2 }).notNull(),
  purchaseCurrency: text("purchase_currency").notNull().default("USD"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const ceoProfiles = pgTable("ceo_profiles", {
  id: serial("id").primaryKey(),
  companyId: integer("company_id").references(() => companies.id),
  name: text("name").notNull(),
  title: text("title").notNull(),
  tenure: integer("tenure"), // in years
  religion: text("religion").notNull(), // Christian, Other Religion
  strategy: text("strategy"),
  leadership: text("leadership"),
  photoUrl: text("photo_url"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const aiRecommendations = pgTable("ai_recommendations", {
  id: serial("id").primaryKey(),
  companyId: integer("company_id").references(() => companies.id),
  signal: text("signal").notNull(), // BUY, SELL, HOLD
  confidence: decimal("confidence", { precision: 5, scale: 2 }).notNull(),
  targetPrice: decimal("target_price", { precision: 10, scale: 2 }),
  reasoning: text("reasoning"),
  fxAdvantage: decimal("fx_advantage", { precision: 5, scale: 2 }),
  optimalTiming: text("optimal_timing"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const currencyRates = pgTable("currency_rates", {
  id: serial("id").primaryKey(),
  fromCurrency: text("from_currency").notNull(),
  toCurrency: text("to_currency").notNull(),
  rate: decimal("rate", { precision: 10, scale: 6 }).notNull(),
  change: decimal("change", { precision: 5, scale: 4 }),
  changePercent: decimal("change_percent", { precision: 5, scale: 2 }),
  forecast24h: text("forecast_24h"),
  volatilityRisk: text("volatility_risk"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const marketAlerts = pgTable("market_alerts", {
  id: serial("id").primaryKey(),
  type: text("type").notNull(), // BOND_ALERT, SENTIMENT, CRASH_WARNING
  severity: text("severity").notNull(), // LOW, MEDIUM, HIGH
  title: text("title").notNull(),
  description: text("description").notNull(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const newsArticles = pgTable("news_articles", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  sentiment: text("sentiment").notNull(), // POSITIVE, NEGATIVE, NEUTRAL
  impact: text("impact").notNull(), // LOW, MEDIUM, HIGH
  companyId: integer("company_id").references(() => companies.id),
  publishedAt: timestamp("published_at").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
});

export const insertCompanySchema = createInsertSchema(companies).omit({
  id: true,
  createdAt: true,
});

export const insertPortfolioPositionSchema = createInsertSchema(portfolioPositions).omit({
  id: true,
  createdAt: true,
});

export const insertCEOProfileSchema = createInsertSchema(ceoProfiles).omit({
  id: true,
  createdAt: true,
});

export const insertAIRecommendationSchema = createInsertSchema(aiRecommendations).omit({
  id: true,
  createdAt: true,
});

export const insertCurrencyRateSchema = createInsertSchema(currencyRates).omit({
  id: true,
  updatedAt: true,
});

export const insertMarketAlertSchema = createInsertSchema(marketAlerts).omit({
  id: true,
  createdAt: true,
});

export const insertNewsArticleSchema = createInsertSchema(newsArticles).omit({
  id: true,
  createdAt: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertCompany = z.infer<typeof insertCompanySchema>;
export type Company = typeof companies.$inferSelect;

export type InsertPortfolioPosition = z.infer<typeof insertPortfolioPositionSchema>;
export type PortfolioPosition = typeof portfolioPositions.$inferSelect;

export type InsertCEOProfile = z.infer<typeof insertCEOProfileSchema>;
export type CEOProfile = typeof ceoProfiles.$inferSelect;

export type InsertAIRecommendation = z.infer<typeof insertAIRecommendationSchema>;
export type AIRecommendation = typeof aiRecommendations.$inferSelect;

export type InsertCurrencyRate = z.infer<typeof insertCurrencyRateSchema>;
export type CurrencyRate = typeof currencyRates.$inferSelect;

export type InsertMarketAlert = z.infer<typeof insertMarketAlertSchema>;
export type MarketAlert = typeof marketAlerts.$inferSelect;

export type InsertNewsArticle = z.infer<typeof insertNewsArticleSchema>;
export type NewsArticle = typeof newsArticles.$inferSelect;
