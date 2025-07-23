import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { aiService } from "./services/aiService";
import { financialService } from "./services/financialService";
import { sendPortfolioAlert } from "./services/emailService";
import {
  insertCompanySchema,
  insertPortfolioPositionSchema,
  insertCEOProfileSchema,
  insertMarketAlertSchema,
  insertNewsArticleSchema
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Company routes
  app.get("/api/companies", async (req, res) => {
    try {
      const companies = await storage.getAllCompanies();
      res.json(companies);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch companies" });
    }
  });

  app.post("/api/companies", async (req, res) => {
    try {
      const validatedData = insertCompanySchema.parse(req.body);
      const company = await storage.createCompany(validatedData);
      res.json(company);
    } catch (error) {
      res.status(400).json({ error: "Invalid company data" });
    }
  });

  app.put("/api/companies/:id/financials", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { financials } = req.body;
      const company = await storage.updateCompanyFinancials(id, financials);
      if (!company) {
        return res.status(404).json({ error: "Company not found" });
      }
      res.json(company);
    } catch (error) {
      res.status(500).json({ error: "Failed to update financials" });
    }
  });

  // Portfolio routes
  app.get("/api/portfolio/summary", async (req, res) => {
    try {
      const userId = 1; // Default user for demo
      const summary = await financialService.getPortfolioSummary(userId);
      res.json(summary);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch portfolio summary" });
    }
  });

  app.get("/api/portfolio/positions", async (req, res) => {
    try {
      const userId = 1; // Default user for demo
      const positions = await storage.getPortfolioPositions(userId);
      res.json(positions);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch portfolio positions" });
    }
  });

  app.post("/api/portfolio/positions", async (req, res) => {
    try {
      const validatedData = insertPortfolioPositionSchema.parse(req.body);
      const position = await storage.createPortfolioPosition({
        ...validatedData,
        userId: 1 // Default user for demo
      });
      res.json(position);
    } catch (error) {
      res.status(400).json({ error: "Invalid position data" });
    }
  });

  app.put("/api/portfolio/positions/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { shares, averageCost } = req.body;
      const position = await storage.updatePortfolioPosition(id, shares, averageCost);
      if (!position) {
        return res.status(404).json({ error: "Position not found" });
      }
      res.json(position);
    } catch (error) {
      res.status(500).json({ error: "Failed to update position" });
    }
  });

  app.delete("/api/portfolio/positions/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deletePortfolioPosition(id);
      if (!deleted) {
        return res.status(404).json({ error: "Position not found" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete position" });
    }
  });

  app.get("/api/portfolio/dividends", async (req, res) => {
    try {
      const userId = 1;
      const dividends = await financialService.getDividendProjections(userId);
      res.json(dividends);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch dividend projections" });
    }
  });

  // Stock price routes
  app.get("/api/stocks/:ticker/price", async (req, res) => {
    try {
      const { ticker } = req.params;
      const price = await financialService.getStockPrice(ticker);
      if (!price) {
        return res.status(404).json({ error: "Stock price not found" });
      }
      res.json(price);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch stock price" });
    }
  });

  app.get("/api/stocks/:ticker/trading-analysis", async (req, res) => {
    try {
      const { ticker } = req.params;
      const { action } = req.query;
      
      if (!action || (action !== "BUY" && action !== "SELL")) {
        return res.status(400).json({ error: "Invalid action parameter" });
      }

      const analysis = await financialService.calculateOptimalTradingTime(ticker, action as "BUY" | "SELL");
      res.json(analysis);
    } catch (error) {
      res.status(500).json({ error: "Failed to analyze trading timing" });
    }
  });

  // AI recommendation routes
  app.get("/api/ai/recommendations", async (req, res) => {
    try {
      const recommendations = await storage.getAIRecommendations();
      
      // Fetch associated company data
      const companies = await storage.getAllCompanies();
      const enrichedRecommendations = recommendations.map(rec => {
        const company = companies.find(c => c.id === rec.companyId);
        return { ...rec, company };
      });

      res.json(enrichedRecommendations);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch AI recommendations" });
    }
  });

  app.post("/api/ai/generate-recommendations", async (req, res) => {
    try {
      await aiService.generateTradingRecommendations();
      res.json({ success: true, message: "Recommendations generated successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to generate recommendations" });
    }
  });

  app.get("/api/ai/currency-forecast", async (req, res) => {
    try {
      const forecasts = await aiService.forecastCurrencyRates();
      res.json(forecasts);
    } catch (error) {
      res.status(500).json({ error: "Failed to generate currency forecasts" });
    }
  });

  // Currency routes
  app.get("/api/currency/rates", async (req, res) => {
    try {
      const rates = await storage.getCurrencyRates();
      res.json(rates);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch currency rates" });
    }
  });

  app.post("/api/currency/update-rates", async (req, res) => {
    try {
      await financialService.updateCurrencyRates();
      res.json({ success: true, message: "Currency rates updated successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to update currency rates" });
    }
  });

  // CEO profile routes
  app.get("/api/ceo-profiles", async (req, res) => {
    try {
      const profiles = await storage.getCEOProfiles();
      
      // Fetch associated company data
      const companies = await storage.getAllCompanies();
      const enrichedProfiles = profiles.map(profile => {
        const company = companies.find(c => c.id === profile.companyId);
        return { ...profile, company };
      });

      res.json(enrichedProfiles);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch CEO profiles" });
    }
  });

  app.post("/api/ceo-profiles", async (req, res) => {
    try {
      const validatedData = insertCEOProfileSchema.parse(req.body);
      const profile = await storage.createCEOProfile(validatedData);
      res.json(profile);
    } catch (error) {
      res.status(400).json({ error: "Invalid CEO profile data" });
    }
  });

  // Market alert routes
  app.get("/api/market/alerts", async (req, res) => {
    try {
      const alerts = await storage.getActiveMarketAlerts();
      res.json(alerts);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch market alerts" });
    }
  });

  app.post("/api/market/alerts", async (req, res) => {
    try {
      const validatedData = insertMarketAlertSchema.parse(req.body);
      const alert = await storage.createMarketAlert(validatedData);
      
      // Send email notification for high severity alerts
      if (alert.severity === "HIGH") {
        await sendPortfolioAlert(alert.title, alert.description);
      }
      
      res.json(alert);
    } catch (error) {
      res.status(400).json({ error: "Invalid alert data" });
    }
  });

  app.post("/api/market/monitor", async (req, res) => {
    try {
      await aiService.monitorMarketConditions();
      res.json({ success: true, message: "Market monitoring completed" });
    } catch (error) {
      res.status(500).json({ error: "Failed to monitor market conditions" });
    }
  });

  // News routes
  app.get("/api/news", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const news = await storage.getRecentNews(limit);
      
      // Fetch associated company data
      const companies = await storage.getAllCompanies();
      const enrichedNews = news.map(article => {
        const company = article.companyId ? companies.find(c => c.id === article.companyId) : null;
        return { ...article, company };
      });

      res.json(enrichedNews);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch news" });
    }
  });

  app.post("/api/news", async (req, res) => {
    try {
      const validatedData = insertNewsArticleSchema.parse(req.body);
      const article = await storage.createNewsArticle(validatedData);
      res.json(article);
    } catch (error) {
      res.status(400).json({ error: "Invalid news data" });
    }
  });

  // Email notification routes
  app.post("/api/notifications/test", async (req, res) => {
    try {
      const { type, message } = req.body;
      const success = await sendPortfolioAlert(type || "Test Alert", message || "This is a test notification");
      res.json({ success, message: "Test notification sent" });
    } catch (error) {
      res.status(500).json({ error: "Failed to send test notification" });
    }
  });

  // Data refresh route
  app.post("/api/data/refresh", async (req, res) => {
    try {
      // Update currency rates
      await financialService.updateCurrencyRates();
      
      // Generate new AI recommendations
      await aiService.generateTradingRecommendations();
      
      // Monitor market conditions
      await aiService.monitorMarketConditions();
      
      // Generate currency forecasts
      await aiService.forecastCurrencyRates();
      
      res.json({ 
        success: true, 
        message: "All data refreshed successfully",
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to refresh data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
