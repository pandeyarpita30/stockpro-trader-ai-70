import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Calendar, DollarSign, Activity, Newspaper } from "lucide-react";
import StockChart from "./StockChart";
import NewsPanel from "./NewsPanel";

interface StockDashboardProps {
  symbol: string;
}

// Mock data - In a real app, this would come from an API
const mockStockData = {
  AAPL: {
    name: "Apple Inc.",
    price: 189.25,
    change: 2.43,
    changePercent: 1.3,
    volume: "45.2M",
    marketCap: "2.97T",
    pe: 28.4,
    dividend: 0.24,
    high52: 199.62,
    low52: 164.08,
    prediction: "positive",
    targetPrice: 205.0,
    analystRating: "BUY"
  },
  TSLA: {
    name: "Tesla, Inc.",
    price: 234.56,
    change: -5.12,
    changePercent: -2.14,
    volume: "89.3M",
    marketCap: "745.2B",
    pe: 65.2,
    dividend: 0.0,
    high52: 299.29,
    low52: 138.80,
    prediction: "negative",
    targetPrice: 220.0,
    analystRating: "HOLD"
  },
  MSFT: {
    name: "Microsoft Corporation",
    price: 378.91,
    change: 8.67,
    changePercent: 2.34,
    volume: "32.1M",
    marketCap: "2.81T",
    pe: 34.1,
    dividend: 3.0,
    high52: 384.30,
    low52: 309.45,
    prediction: "positive",
    targetPrice: 420.0,
    analystRating: "BUY"
  }
};

const StockDashboard = ({ symbol }: StockDashboardProps) => {
  const [stockData, setStockData] = useState(mockStockData[symbol as keyof typeof mockStockData] || mockStockData.AAPL);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setLoading(true);
    setTimeout(() => {
      setStockData(mockStockData[symbol as keyof typeof mockStockData] || mockStockData.AAPL);
      setLoading(false);
    }, 1000);
  }, [symbol]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="bg-card">
                <CardHeader>
                  <div className="h-4 bg-muted rounded w-2/3"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-8 bg-muted rounded w-1/2"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const isPositive = stockData.change > 0;
  const isPredictionPositive = stockData.prediction === "positive";

  return (
    <div className="space-y-8">
      {/* Stock Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-foreground">
            {symbol} - {stockData.name}
          </h2>
          <div className="flex items-center gap-4 mt-2">
            <span className="text-4xl font-bold text-foreground">
              ${stockData.price.toFixed(2)}
            </span>
            <div className={`flex items-center gap-1 ${isPositive ? 'text-profit' : 'text-loss'}`}>
              {isPositive ? <TrendingUp className="h-5 w-5" /> : <TrendingDown className="h-5 w-5" />}
              <span className="text-lg font-semibold">
                {isPositive ? '+' : ''}{stockData.change.toFixed(2)} ({stockData.changePercent.toFixed(2)}%)
              </span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Badge 
            variant={isPredictionPositive ? "default" : "destructive"}
            className={isPredictionPositive ? "bg-profit hover:bg-profit/90" : "bg-loss hover:bg-loss/90"}
          >
            {stockData.analystRating}
          </Badge>
          <Badge variant="outline" className="border-border">
            Target: ${stockData.targetPrice.toFixed(2)}
          </Badge>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-card/50 backdrop-blur-sm border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Volume
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stockData.volume}</div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur-sm border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Market Cap
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stockData.marketCap}</div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur-sm border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">P/E Ratio</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stockData.pe}</div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur-sm border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">52W Range</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-foreground">
              ${stockData.low52} - ${stockData.high52}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chart and Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Stock Chart */}
        <div className="lg:col-span-2">
          <Card className="bg-card/50 backdrop-blur-sm border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                3-Year Price History
              </CardTitle>
              <CardDescription>
                Historical price movements and trend analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <StockChart symbol={symbol} />
            </CardContent>
          </Card>
        </div>

        {/* Analysis Panel */}
        <div className="space-y-6">
          {/* Prediction Card */}
          <Card className={`bg-gradient-to-br ${isPredictionPositive ? 'from-profit/10 to-profit/5' : 'from-loss/10 to-loss/5'} border-border`}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {isPredictionPositive ? 
                  <TrendingUp className="h-5 w-5 text-profit" /> : 
                  <TrendingDown className="h-5 w-5 text-loss" />
                }
                AI Prediction
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-lg font-semibold ${isPredictionPositive ? 'text-profit' : 'text-loss'}`}>
                {isPredictionPositive ? 'BULLISH' : 'BEARISH'} Outlook
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Based on technical analysis and market sentiment, we predict {' '}
                {isPredictionPositive ? 'upward' : 'downward'} movement towards ${stockData.targetPrice.toFixed(2)}
              </p>
            </CardContent>
          </Card>

          {/* Profitability Metrics */}
          <Card className="bg-card/50 backdrop-blur-sm border-border">
            <CardHeader>
              <CardTitle>Profitability Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Revenue Growth</span>
                  <span className="text-sm font-medium text-profit">+12.3%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Profit Margin</span>
                  <span className="text-sm font-medium text-profit">23.8%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">ROE</span>
                  <span className="text-sm font-medium text-profit">28.1%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-profit to-warning w-4/5 rounded-full"></div>
                </div>
                <div className="text-center">
                  <span className="text-2xl font-bold text-profit">85/100</span>
                  <p className="text-xs text-muted-foreground">Profitability Score</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* News Panel */}
      <NewsPanel symbol={symbol} companyName={stockData.name} />
    </div>
  );
};

export default StockDashboard;