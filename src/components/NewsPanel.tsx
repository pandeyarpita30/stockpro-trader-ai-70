import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Newspaper, TrendingUp, TrendingDown, ExternalLink, Calendar } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface NewsPanelProps {
  symbol: string;
  companyName: string;
}

// Mock news data - In a real app, this would come from a news API
const mockNews = {
  AAPL: [
    {
      id: 1,
      title: "Apple Reports Strong Q4 Earnings Despite Supply Chain Challenges",
      summary: "Apple Inc. reported better-than-expected quarterly earnings, driven by strong iPhone 15 sales and services revenue growth.",
      sentiment: "positive",
      impact: "high",
      source: "Reuters",
      publishedAt: "2024-01-15T10:30:00Z",
      url: "#"
    },
    {
      id: 2,
      title: "New iPad Pro Models Expected to Drive Next Quarter Growth",
      summary: "Industry analysts predict upcoming iPad Pro refresh will boost Apple's tablet market share significantly.",
      sentiment: "positive",
      impact: "medium",
      source: "Bloomberg",
      publishedAt: "2024-01-14T14:20:00Z",
      url: "#"
    },
    {
      id: 3,
      title: "Regulatory Concerns in EU May Impact App Store Revenue",
      summary: "European Union's Digital Markets Act could force changes to Apple's App Store policies, potentially affecting revenue streams.",
      sentiment: "negative",
      impact: "medium",
      source: "Financial Times",
      publishedAt: "2024-01-13T09:15:00Z",
      url: "#"
    }
  ],
  TSLA: [
    {
      id: 1,
      title: "Tesla Delivers Record Number of Vehicles in Q4 2023",
      summary: "Tesla reported record quarterly deliveries, exceeding analyst expectations and demonstrating strong demand for EVs.",
      sentiment: "positive",
      impact: "high",
      source: "CNBC",
      publishedAt: "2024-01-15T11:45:00Z",
      url: "#"
    },
    {
      id: 2,
      title: "Cybertruck Production Ramp-Up Faces Manufacturing Challenges",
      summary: "Tesla's Cybertruck production is experiencing delays due to complex manufacturing processes and supply chain issues.",
      sentiment: "negative",
      impact: "medium",
      source: "WSJ",
      publishedAt: "2024-01-14T16:30:00Z",
      url: "#"
    },
    {
      id: 3,
      title: "Expansion into India Market Shows Promise for 2024",
      summary: "Tesla's entry strategy for the Indian market gains momentum with government support and infrastructure development.",
      sentiment: "positive",
      impact: "low",
      source: "Economic Times",
      publishedAt: "2024-01-13T12:00:00Z",
      url: "#"
    }
  ],
  MSFT: [
    {
      id: 1,
      title: "Microsoft AI Integration Drives Cloud Revenue to New Heights",
      summary: "Azure's AI services and Copilot adoption contribute to Microsoft's strongest cloud growth in two years.",
      sentiment: "positive",
      impact: "high",
      source: "TechCrunch",
      publishedAt: "2024-01-15T13:20:00Z",
      url: "#"
    },
    {
      id: 2,
      title: "Gaming Division Shows Strong Performance with Xbox Game Pass",
      summary: "Microsoft's gaming revenue increased 20% YoY, driven by Game Pass subscriptions and first-party title releases.",
      sentiment: "positive",
      impact: "medium",
      source: "The Verge",
      publishedAt: "2024-01-14T10:15:00Z",
      url: "#"
    },
    {
      id: 3,
      title: "Office 365 Faces Increased Competition from Google Workspace",
      summary: "Google's aggressive pricing and AI features in Workspace present challenges to Microsoft's Office dominance.",
      sentiment: "negative",
      impact: "low",
      source: "ZDNet",
      publishedAt: "2024-01-13T15:45:00Z",
      url: "#"
    }
  ]
};

const NewsPanel = ({ symbol, companyName }: NewsPanelProps) => {
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase.functions.invoke('fetch-stock-news', {
          body: { symbol }
        });

        if (error) {
          console.error('Error fetching news:', error);
          toast.error('Failed to fetch news');
          setLoading(false);
          return;
        }

        setNews(data.news || []);
      } catch (error) {
        console.error('Error:', error);
        toast.error('Failed to load news');
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [symbol]);

  const getSentimentBadge = (sentiment: string) => {
    const lowerSentiment = sentiment?.toLowerCase() || 'neutral';
    if (lowerSentiment.includes('positive') || lowerSentiment.includes('bullish')) {
      return { variant: 'default' as const, text: 'Positive' };
    }
    if (lowerSentiment.includes('negative') || lowerSentiment.includes('bearish')) {
      return { variant: 'destructive' as const, text: 'Negative' };
    }
    return { variant: 'secondary' as const, text: 'Neutral' };
  };

  if (loading) {
    return (
      <Card className="bg-card border-border/50 h-full">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Newspaper className="h-5 w-5 text-primary" />
            <CardTitle>Latest News</CardTitle>
          </div>
          <CardDescription>Loading news for {companyName}...</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-2 border-b pb-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-3 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return 'text-profit';
      case 'negative':
        return 'text-loss';
      default:
        return 'text-muted-foreground';
    }
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return <TrendingUp className="h-4 w-4" />;
      case 'negative':
        return <TrendingDown className="h-4 w-4" />;
      default:
        return <Calendar className="h-4 w-4" />;
    }
  };

  const getImpactVariant = (impact: string) => {
    switch (impact) {
      case 'high':
        return 'destructive';
      case 'medium':
        return 'default';
      default:
        return 'secondary';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Newspaper className="h-5 w-5" />
          Latest News - {companyName}
        </CardTitle>
        <CardDescription>
          Recent news and analysis that may impact {symbol} stock price
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {news.map((article) => (
            <div key={article.id} className="border-l-2 border-border pl-4 hover:border-primary/50 transition-colors">
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-semibold text-foreground hover:text-primary transition-colors cursor-pointer flex items-start gap-2">
                  {article.title}
                  <ExternalLink className="h-3 w-3 mt-1 opacity-50" />
                </h4>
                <div className="flex items-center gap-2 ml-4">
                  <Badge variant={getImpactVariant(article.impact)} className="text-xs">
                    {article.impact.toUpperCase()}
                  </Badge>
                  <div className={`flex items-center gap-1 ${getSentimentColor(article.sentiment)}`}>
                    {getSentimentIcon(article.sentiment)}
                  </div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                {article.summary}
              </p>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className="font-medium">{article.source}</span>
                <span>{formatDate(article.publishedAt)}</span>
              </div>
            </div>
          ))}
        </div>
        
        {/* News Impact Summary */}
        <div className="mt-8 p-4 bg-gradient-to-r from-primary/5 to-accent/5 rounded-lg border border-primary/20">
          <h5 className="font-semibold text-foreground mb-2">News Impact Analysis</h5>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-profit">2</div>
              <div className="text-xs text-muted-foreground">Positive</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-loss">1</div>
              <div className="text-xs text-muted-foreground">Negative</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-profit">+2.1%</div>
              <div className="text-xs text-muted-foreground">Sentiment Score</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NewsPanel;