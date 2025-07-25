import { useState } from 'react';
import { Button } from "./ui";
import { Input } from "./ui";
import { Card } from "./ui";
import { Badge } from "./ui";
import { useToast } from "./ui";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui";
import { Label } from "./ui";
import { Trash2, Plus, Edit3, DollarSign } from "lucide-react";

interface Company {
  id: string;
  name: string;
  ticker?: string;
  financials?: {
    cashReserves?: number;
    annualRevenue?: number;
    annualProfit?: number;
    productAnnualRevenue?: number;
    annualGrossProfit?: number;
  };
}

interface CompanyWatchlistProps {
  companies: Company[];
  onCompaniesChange: (companies: Company[]) => void;
}

export const CompanyWatchlist = ({ companies, onCompaniesChange }: CompanyWatchlistProps) => {
  const [newCompany, setNewCompany] = useState('');
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const formatCurrency = (amount?: number) => {
    if (!amount) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: 'compact',
      maximumFractionDigits: 1
    }).format(amount * 1000000); // Convert millions to actual value
  };

  const addCompany = () => {
    if (!newCompany.trim()) {
      toast({
        title: "Error",
        description: "Please enter a company name",
        variant: "destructive",
      });
      return;
    }

    const company: Company = {
      id: Date.now().toString(),
      name: newCompany.trim(),
      financials: {}
    };

    onCompaniesChange([...companies, company]);
    setNewCompany('');
    
    toast({
      title: "Company Added",
      description: `${company.name} has been added to your watchlist`,
    });
  };

  const updateCompanyFinancials = (updatedCompany: Company) => {
    const updatedCompanies = companies.map(company => 
      company.id === updatedCompany.id ? updatedCompany : company
    );
    onCompaniesChange(updatedCompanies);
    setIsDialogOpen(false);
    setEditingCompany(null);
    
    toast({
      title: "Financial Data Updated",
      description: `Financial metrics for ${updatedCompany.name} have been updated`,
    });
  };

  const removeCompany = (id: string) => {
    const filteredCompanies = companies.filter(company => company.id !== id);
    onCompaniesChange(filteredCompanies);
    
    toast({
      title: "Company Removed",
      description: "Company has been removed from your watchlist",
    });
  };

  return (
    <Card className="p-6 bg-gradient-card border-border shadow-card">
      <div className="flex flex-col space-y-4">
        <div className="flex items-center space-x-2">
          <h2 className="text-xl font-semibold text-foreground">Company Watchlist</h2>
          <Badge variant="secondary" className="text-xs">
            {companies.length} companies
          </Badge>
        </div>
        
        <div className="flex space-x-2">
          <Input
            value={newCompany}
            onChange={(e) => setNewCompany(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addCompany()}
            placeholder="Add company (e.g., Apple Inc., Tesla)"
            className="flex-1 bg-input border-border"
          />
          <Button 
            onClick={addCompany}
            className="bg-gradient-primary hover:shadow-glow transition-all duration-300"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="grid grid-cols-1 gap-4">
          {companies.map((company) => (
            <Card key={company.id} className="p-4 bg-muted border-border">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground mb-1">{company.name}</h3>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      <DollarSign className="h-3 w-3 mr-1" />
                      Financial Data
                    </Badge>
                  </div>
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
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeCompany(company.id)}
                    className="h-8 w-8 p-0 hover:bg-destructive hover:text-destructive-foreground"
                  >
                    <Trash2 className="h-3 w-3" />
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
                  <p className="font-medium text-positive">{formatCurrency(company.financials?.annualProfit)}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-muted-foreground">Product Revenue</p>
                  <p className="font-medium text-primary">{formatCurrency(company.financials?.productAnnualRevenue)}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-muted-foreground">Gross Profit</p>
                  <p className="font-medium text-positive">{formatCurrency(company.financials?.annualGrossProfit)}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
        
        {companies.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <p className="text-sm">No companies in your watchlist</p>
            <p className="text-xs mt-1">Add companies to start tracking their news and financial metrics</p>
          </div>
        )}
      </div>

      {/* Financial Data Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground">
              Edit Financial Data - {editingCompany?.name}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Enter financial metrics in millions USD. Leave fields as 0 if data is not available.
            </DialogDescription>
          </DialogHeader>
          <FinancialDataForm 
            company={editingCompany} 
            onSave={updateCompanyFinancials}
            onCancel={() => {
              setIsDialogOpen(false);
              setEditingCompany(null);
            }}
          />
        </DialogContent>
      </Dialog>
    </Card>
  );
};

interface FinancialDataFormProps {
  company: Company | null;
  onSave: (company: Company) => void;
  onCancel: () => void;
}

const FinancialDataForm = ({ company, onSave, onCancel }: FinancialDataFormProps) => {
  const [formData, setFormData] = useState({
    cashReserves: company?.financials?.cashReserves || 0,
    annualRevenue: company?.financials?.annualRevenue || 0,
    annualProfit: company?.financials?.annualProfit || 0,
    productAnnualRevenue: company?.financials?.productAnnualRevenue || 0,
    annualGrossProfit: company?.financials?.annualGrossProfit || 0,
  });

  const handleSave = () => {
    if (!company) return;
    
    const updatedCompany: Company = {
      ...company,
      financials: formData
    };
    
    onSave(updatedCompany);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-3">
