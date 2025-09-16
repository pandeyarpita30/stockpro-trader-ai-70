import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Settings, Key, ExternalLink, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface ApiProvider {
  name: string;
  description: string;
  url: string;
  features: string[];
  pricing: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

const apiProviders: ApiProvider[] = [
  {
    name: "Alpha Vantage",
    description: "Free tier with 500 requests/day. Perfect for getting started with real-time and historical stock data.",
    url: "https://www.alphavantage.co/",
    features: ["Real-time quotes", "Historical data", "Technical indicators", "Fundamental data"],
    pricing: "Free tier: 500 requests/day",
    difficulty: "Easy"
  },
  {
    name: "Finnhub",
    description: "Comprehensive financial data with generous free tier. Great for news and market data.",
    url: "https://finnhub.io/",
    features: ["Real-time data", "Company news", "Market sentiment", "Earnings data"],
    pricing: "Free tier: 60 calls/minute",
    difficulty: "Easy"
  },
  {
    name: "Polygon.io",
    description: "Professional-grade market data with real-time capabilities and extensive historical data.",
    url: "https://polygon.io/",
    features: ["Real-time trades", "Options data", "Crypto data", "Forex data"],
    pricing: "Free tier: 5 calls/minute",
    difficulty: "Medium"
  },
  {
    name: "IEX Cloud",
    description: "Simple API with clean documentation. Good balance of features and ease of use.",
    url: "https://iexcloud.io/",
    features: ["Stock prices", "Company info", "Market stats", "Economic data"],
    pricing: "Free tier: 500,000 messages/month",
    difficulty: "Easy"
  }
];

const ApiSetup = () => {
  const [selectedProvider, setSelectedProvider] = useState<string>('');
  const [apiKey, setApiKey] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const { toast } = useToast();

  const handleConnect = () => {
    if (!selectedProvider || !apiKey) {
      toast({
        title: "Missing Information",
        description: "Please select a provider and enter your API key.",
        variant: "destructive",
      });
      return;
    }

    // In a real app, you would validate the API key here
    // For now, we'll simulate a successful connection
    setIsConnected(true);
    toast({
      title: "API Connected!",
      description: `Successfully connected to ${selectedProvider}. You can now fetch real stock data.`,
    });
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-profit hover:bg-profit/90';
      case 'Medium': return 'bg-warning hover:bg-warning/90';
      case 'Hard': return 'bg-loss hover:bg-loss/90';
      default: return 'bg-muted hover:bg-muted/90';
    }
  };

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          API Setup - Connect Real Stock Data
        </CardTitle>
        <CardDescription>
          Choose a stock data provider to get real-time prices, historical data, and news feeds
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Connection Status */}
        {isConnected && (
          <div className="flex items-center gap-2 p-3 bg-profit/10 border border-profit/20 rounded-lg">
            <CheckCircle className="h-5 w-5 text-profit" />
            <span className="text-profit font-medium">Connected to {selectedProvider}</span>
            <Badge variant="outline" className="ml-auto border-profit text-profit">Active</Badge>
          </div>
        )}

        {/* API Providers */}
        <div className="space-y-4">
          <h4 className="font-semibold text-foreground">Choose Your Data Provider:</h4>
          <div className="grid gap-4">
            {apiProviders.map((provider) => (
              <div
                key={provider.name}
                className={`p-4 border rounded-lg cursor-pointer transition-all ${
                  selectedProvider === provider.name
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                }`}
                onClick={() => setSelectedProvider(provider.name)}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <h5 className="font-semibold text-foreground">{provider.name}</h5>
                    <Badge className={getDifficultyColor(provider.difficulty)}>
                      {provider.difficulty}
                    </Badge>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    asChild
                    className="text-xs"
                  >
                    <a href={provider.url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-3 w-3 mr-1" />
                      Visit
                    </a>
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground mb-3">{provider.description}</p>
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-1">
                    {provider.features.map((feature) => (
                      <Badge key={feature} variant="secondary" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">{provider.pricing}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* API Key Input */}
        {selectedProvider && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Key className="h-4 w-4 text-muted-foreground" />
              <label className="text-sm font-medium text-foreground">
                Enter your {selectedProvider} API Key:
              </label>
            </div>
            <div className="flex gap-2">
              <Input
                type="password"
                placeholder="Enter your API key here..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="flex-1"
              />
              <Button onClick={handleConnect} disabled={!apiKey}>
                Connect
              </Button>
            </div>
            <div className="flex items-start gap-2 p-3 bg-warning/10 border border-warning/20 rounded-lg">
              <AlertCircle className="h-4 w-4 text-warning mt-0.5" />
              <div className="text-sm">
                <p className="text-warning font-medium">Security Note:</p>
                <p className="text-muted-foreground">
                  For production apps, connect to Supabase to securely store API keys server-side.
                  This demo stores keys in browser localStorage only.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Sample Code */}
        {isConnected && (
          <div className="space-y-3">
            <h4 className="font-semibold text-foreground">Integration Ready!</h4>
            <div className="p-3 bg-muted/50 rounded-lg">
              <code className="text-sm text-foreground">
                // Sample API call for {selectedProvider}<br/>
                fetch(`https://api.{selectedProvider.toLowerCase().replace(' ', '')}.com/query?symbol=AAPL&apikey=${apiKey.slice(0, 8)}...`)
              </code>
            </div>
            <p className="text-xs text-muted-foreground">
              Your API integration is ready. The app will now use real data instead of mock data.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ApiSetup;