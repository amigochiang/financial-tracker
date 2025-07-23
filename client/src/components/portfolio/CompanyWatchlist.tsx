import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Trash2, Plus, Edit3, DollarSign } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface Company {
  id: number;
  name: string;
  ticker: string;
  sector?: string;
  currency: string;
  financials?: {
    cashReserves?: number;
    annualRevenue?: number;
    annualProfit?: number;
    productAnnualRevenue?: number;
    annualGrossProfit?: number;
  };
}

interface PortfolioPosition {
  id: number;
  companyId: number;
  shares: string;
  averageCost: string;
  purchaseCurrency: string;
}

export default function CompanyWatchlist() {
  const [newCompanyName, setNewCompanyName] = useState('');
  const [newCompanyTicker, setNewCompanyTicker] = useState('');
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  // Fetch companies
  const { data: companies = [] } = useQuery<Company[]>({
    queryKey: ["/api/companies"],
  });

  // Fetch portfolio positions
  const { data: positions = [] } = useQuery<PortfolioPosition[]>({
    queryKey: ["/api/portfolio/positions"],
  });

  // Add company mutation
  const addCompanyMutation = useMutation({
    mutationFn: async (companyData: { name: string; ticker: string; currency: string; sector?: string }) => {
      const response = await apiRequest("POST", "/api/companies", companyData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/companies"] });
      toast({
        title: "Company Added",
        description: "Company has been added to your watchlist",
      });
      setNewCompanyName('');
      setNewCompanyTicker('');
      setIsAddDialogOpen(false);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add company",
        variant: "destructive",
      });
    }
  });

  // Update financials mutation
  const updateFinancialsMutation = useMutation({
    mutationFn: async ({ id, financials }: { id: number; financials: any }) => {
      const response = await apiRequest("PUT", `/api/companies/${id}/financials`, { financials });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/companies"] });
      toast({
        title: "Financial Data Updated",
        description: "Financial metrics have been updated",
      });
      setIsDialogOpen(false);
      setEditingCompany(null);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update financial data",
        variant: "destructive",
      });
    }
  });

  const formatCurrency = (amount?: number) => {
    if (!amount) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: 'compact',
      maximumFractionDigits: 1
    }).format(amount * 1000000);
  };

  const addCompany = () => {
    if (!newCompanyName.trim() || !newCompanyTicker.trim()) {
      toast({
        title: "Error",
        description: "Please enter both company name and ticker",
        variant: "destructive",
      });
      return;
    }

    addCompanyMutation.mutate({
      name: newCompanyName.trim(),
      ticker: newCompanyTicker.trim().toUpperCase(),
      currency: "USD",
      sector: "Technology"
    });
  };

  const getPositionInfo = (companyId: number) => {
    const position = positions.find(p => p.companyId === companyId);
    return position ? `${position.shares} shares` : 'Not owned';
  };

  return (
    <Card className="gradient-card p-6 border-slate-700 shadow-card">
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-semibold text-foreground">Company Watchlist</h2>
            <Badge variant="secondary" className="text-xs">
              {companies.length} companies
            </Badge>
          </div>
          
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="gradient-primary shadow-glow-primary">
                <Plus className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-800 border-slate-700">
              <DialogHeader>
                <DialogTitle className="text-foreground">Add New Company</DialogTitle>
                <DialogDescription className="text-muted-foreground">
                  Add a new company to your watchlist for tracking.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input
                    id="companyName"
                    value={newCompanyName}
                    onChange={(e) => setNewCompanyName(e.target.value)}
                    placeholder="e.g., Apple Inc."
                    className="bg-slate-700 border-slate-600"
                  />
                </div>
                <div>
                  <Label htmlFor="companyTicker">Ticker Symbol</Label>
                  <Input
                    id="companyTicker"
                    value={newCompanyTicker}
                    onChange={(e) => setNewCompanyTicker(e.target.value.toUpperCase())}
                    placeholder="e.g., AAPL"
                    className="bg-slate-700 border-slate-600"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button 
                    onClick={addCompany}
                    disabled={addCompanyMutation.isPending}
                    className="gradient-primary"
                  >
                    {addCompanyMutation.isPending ? 'Adding...' : 'Add Company'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        
        <div className="grid grid-cols-1 gap-4">
          {companies.map((company) => (
            <Card key={company.id} className="p-4 bg-slate-800 border-slate-700">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground mb-1">{company.name}</h3>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {company.ticker}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      <DollarSign className="h-3 w-3 mr-1" />
                      {company.currency}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {getPositionInfo(company.id)}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setEditingCompany(company);
                      setIsDialogOpen(true);
                    }}
                    className="h-8 w-8 p-0 hover:bg-accent"
                  >
                    <Edit3 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                <div className="space-y-1">
                  <p className="text-muted-foreground">Cash Reserves</p>
                  <p className="font-medium text-success">{formatCurrency(company.financials?.cashReserves)}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-muted-foreground">Annual Revenue</p>
                  <p className="font-medium text-primary">{formatCurrency(company.financials?.annualRevenue)}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-muted-foreground">Annual Profit</p>
                  <p className="font-medium text-success">{formatCurrency(company.financials?.annualProfit)}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-muted-foreground">Product Revenue</p>
                  <p className="font-medium text-primary">{formatCurrency(company.financials?.productAnnualRevenue)}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-muted-foreground">Gross Profit</p>
                  <p className="font-medium text-success">{formatCurrency(company.financials?.annualGrossProfit)}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
        
        {companies.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <p className="text-sm">No companies in your watchlist</p>
            <p className="text-xs mt-1">Add companies to start tracking their financial metrics</p>
          </div>
        )}
      </div>

      {/* Financial Data Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md bg-slate-800 border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-foreground">
              Edit Financial Data - {editingCompany?.name}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Enter financial metrics in millions USD. Leave fields as 0 if data is not available.
            </DialogDescription>
          </DialogHeader>
          {editingCompany && (
            <FinancialDataForm 
              company={editingCompany} 
              onSave={(financials) => updateFinancialsMutation.mutate({ id: editingCompany.id, financials })}
              onCancel={() => {
                setIsDialogOpen(false);
                setEditingCompany(null);
              }}
              isLoading={updateFinancialsMutation.isPending}
            />
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
}

interface FinancialDataFormProps {
  company: Company;
  onSave: (financials: any) => void;
  onCancel: () => void;
  isLoading: boolean;
}

function FinancialDataForm({ company, onSave, onCancel, isLoading }: FinancialDataFormProps) {
  const [formData, setFormData] = useState({
    cashReserves: company.financials?.cashReserves || 0,
    annualRevenue: company.financials?.annualRevenue || 0,
    annualProfit: company.financials?.annualProfit || 0,
    productAnnualRevenue: company.financials?.productAnnualRevenue || 0,
    annualGrossProfit: company.financials?.annualGrossProfit || 0,
  });

  const handleSave = () => {
    onSave(formData);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <div>
          <Label htmlFor="cashReserves" className="text-sm font-medium text-foreground">
            Cash Reserves (Millions USD)
          </Label>
          <Input
            id="cashReserves"
            type="number"
            value={formData.cashReserves}
            onChange={(e) => setFormData({...formData, cashReserves: Number(e.target.value)})}
            placeholder="0"
            className="mt-1 bg-slate-700 border-slate-600"
          />
        </div>
        
        <div>
          <Label htmlFor="annualRevenue" className="text-sm font-medium text-foreground">
            Annual Revenue (Millions USD)
          </Label>
          <Input
            id="annualRevenue"
            type="number"
            value={formData.annualRevenue}
            onChange={(e) => setFormData({...formData, annualRevenue: Number(e.target.value)})}
            placeholder="0"
            className="mt-1 bg-slate-700 border-slate-600"
          />
        </div>
        
        <div>
          <Label htmlFor="annualProfit" className="text-sm font-medium text-foreground">
            Annual Profit (Millions USD)
          </Label>
          <Input
            id="annualProfit"
            type="number"
            value={formData.annualProfit}
            onChange={(e) => setFormData({...formData, annualProfit: Number(e.target.value)})}
            placeholder="0"
            className="mt-1 bg-slate-700 border-slate-600"
          />
        </div>
        
        <div>
          <Label htmlFor="productAnnualRevenue" className="text-sm font-medium text-foreground">
            Product Annual Revenue (Millions USD)
          </Label>
          <Input
            id="productAnnualRevenue"
            type="number"
            value={formData.productAnnualRevenue}
            onChange={(e) => setFormData({...formData, productAnnualRevenue: Number(e.target.value)})}
            placeholder="0"
            className="mt-1 bg-slate-700 border-slate-600"
          />
        </div>
        
        <div>
          <Label htmlFor="annualGrossProfit" className="text-sm font-medium text-foreground">
            Annual Gross Profit (Millions USD)
          </Label>
          <Input
            id="annualGrossProfit"
            type="number"
            value={formData.annualGrossProfit}
            onChange={(e) => setFormData({...formData, annualGrossProfit: Number(e.target.value)})}
            placeholder="0"
            className="mt-1 bg-slate-700 border-slate-600"
          />
        </div>
      </div>
      
      <div className="flex justify-end gap-2 pt-4">
        <Button variant="outline" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button onClick={handleSave} disabled={isLoading} className="gradient-primary">
          {isLoading ? 'Saving...' : 'Save Financial Data'}
        </Button>
      </div>
    </div>
  );
}
