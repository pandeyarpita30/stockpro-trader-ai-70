import { useState } from "react";
import { Search, TrendingUp, Activity, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import StockDashboard from "@/components/StockDashboard";
import MarketOverview from "@/components/MarketOverview";

const Index = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStock, setSelectedStock] = useState<string | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      setSelectedStock(searchTerm.toUpperCase());
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                StockTrader Pro
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-2 text-sm">
                <Activity className="h-4 w-4 text-profit animate-pulse" />
                <span className="text-muted-foreground">Market Open</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="text-center py-16 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-accent/10 rounded-3xl blur-3xl"></div>
          <div className="relative">
            <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground via-primary to-accent bg-clip-text text-transparent">
              Trade Smarter
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Get real-time insights, historical trends, and AI-powered projections to make informed trading decisions
            </p>
            
            {/* Search Form */}
            <form onSubmit={handleSearch} className="max-w-md mx-auto mb-12">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                <Input
                  type="text"
                  placeholder="Enter company symbol (e.g., AAPL, TSLA)"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-3 text-lg bg-card/50 backdrop-blur-sm border-border focus:ring-primary focus:border-primary"
                />
                <Button 
                  type="submit" 
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground"
                >
                  Analyze
                </Button>
              </div>
            </form>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <Card className="bg-card/50 backdrop-blur-sm border-border hover:bg-card/70 transition-all">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Market Cap</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-profit">$45.2T</div>
                  <p className="text-xs text-muted-foreground">+2.4% today</p>
                </CardContent>
              </Card>
              <Card className="bg-card/50 backdrop-blur-sm border-border hover:bg-card/70 transition-all">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Active Stocks</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">8,234</div>
                  <p className="text-xs text-muted-foreground">Tracking all markets</p>
                </CardContent>
              </Card>
              <Card className="bg-card/50 backdrop-blur-sm border-border hover:bg-card/70 transition-all">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Success Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-warning">87.3%</div>
                  <p className="text-xs text-muted-foreground">AI predictions</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Market Overview */}
        <MarketOverview />

        {/* Stock Dashboard - Only show when stock is selected */}
        {selectedStock && (
          <section className="mt-12">
            <StockDashboard symbol={selectedStock} />
          </section>
        )}

        {/* Feature Cards */}
        <section className="mt-16">
          <h3 className="text-3xl font-bold text-center mb-12">Why Choose StockTrader Pro?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-gradient-to-br from-card to-card/50 border-border hover:border-primary/50 transition-all group">
              <CardHeader>
                <BarChart3 className="h-12 w-12 text-primary group-hover:text-accent transition-colors" />
                <CardTitle>Real-time Analysis</CardTitle>
                <CardDescription>
                  Get instant insights with our advanced algorithms analyzing market trends 24/7
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="bg-gradient-to-br from-card to-card/50 border-border hover:border-primary/50 transition-all group">
              <CardHeader>
                <TrendingUp className="h-12 w-12 text-primary group-hover:text-accent transition-colors" />
                <CardTitle>Historical Data</CardTitle>
                <CardDescription>
                  Access 3 years of comprehensive historical data to make informed decisions
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="bg-gradient-to-br from-card to-card/50 border-border hover:border-primary/50 transition-all group">
              <CardHeader>
                <Activity className="h-12 w-12 text-primary group-hover:text-accent transition-colors" />
                <CardTitle>News Impact</CardTitle>
                <CardDescription>
                  Understand how latest news affects stock prices with our sentiment analysis
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Index;