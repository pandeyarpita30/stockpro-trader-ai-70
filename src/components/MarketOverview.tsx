import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Activity } from "lucide-react";

const MarketOverview = () => {
  const marketData = [
    {
      index: "S&P 500",
      value: "4,567.23",
      change: "+23.45",
      changePercent: "+0.52%",
      positive: true
    },
    {
      index: "NASDAQ",
      value: "14,234.56",
      change: "-45.67",
      changePercent: "-0.32%",
      positive: false
    },
    {
      index: "DOW JONES",
      value: "34,789.12",
      change: "+123.89",
      changePercent: "+0.36%",
      positive: true
    },
    {
      index: "RUSSELL 2000",
      value: "1,987.45",
      change: "+12.34",
      changePercent: "+0.63%",
      positive: true
    }
  ];

  const topMovers = [
    { symbol: "NVDA", change: "+5.67%", positive: true },
    { symbol: "META", change: "+3.21%", positive: true },
    { symbol: "AMZN", change: "-2.14%", positive: false },
    { symbol: "GOOGL", change: "+1.89%", positive: true },
  ];

  return (
    <section className="mt-16">
      <h3 className="text-2xl font-bold mb-8 text-center">Market Overview</h3>
      
      {/* Major Indices */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {marketData.map((market) => (
          <Card key={market.index} className="bg-card/50 backdrop-blur-sm border-border hover:bg-card/70 transition-all">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">{market.index}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold text-foreground mb-1">{market.value}</div>
              <div className={`flex items-center gap-1 text-sm ${market.positive ? 'text-profit' : 'text-loss'}`}>
                {market.positive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                <span>{market.change} ({market.changePercent})</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Market Highlights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="bg-card/50 backdrop-blur-sm border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Top Movers
            </CardTitle>
            <CardDescription>Most active stocks today</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topMovers.map((stock) => (
                <div key={stock.symbol} className="flex items-center justify-between">
                  <span className="font-medium text-foreground">{stock.symbol}</span>
                  <div className={`flex items-center gap-1 ${stock.positive ? 'text-profit' : 'text-loss'}`}>
                    {stock.positive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                    <span className="font-semibold">{stock.change}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur-sm border-border">
          <CardHeader>
            <CardTitle>Market Sentiment</CardTitle>
            <CardDescription>Overall market health indicators</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Fear & Greed Index</span>
                <span className="text-sm font-medium text-warning">67 - Greed</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">VIX (Volatility)</span>
                <span className="text-sm font-medium text-profit">16.2 - Low</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Put/Call Ratio</span>
                <span className="text-sm font-medium text-foreground">0.83</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-loss via-warning to-profit w-2/3 rounded-full"></div>
              </div>
              <div className="text-center">
                <span className="text-lg font-bold text-warning">Bullish Trend</span>
                <p className="text-xs text-muted-foreground">Market sentiment is optimistic</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default MarketOverview;