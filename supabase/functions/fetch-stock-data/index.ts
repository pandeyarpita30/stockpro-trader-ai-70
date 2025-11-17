import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { symbol, period = '1Y' } = await req.json();
    const apiKey = Deno.env.get('FINNHUB_API_KEY');

    if (!apiKey) {
      throw new Error('FINNHUB_API_KEY not configured');
    }

    console.log(`Fetching stock data for ${symbol} with period ${period}`);

    // Fetch current quote
    const quoteResponse = await fetch(
      `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${apiKey}`
    );
    const quoteData = await quoteResponse.json();

    // Validate that we got valid data
    if (!quoteData || quoteData.error || quoteData.c === undefined || quoteData.c === 0) {
      console.error('Invalid symbol or no data available');
      throw new Error(`No data available for symbol ${symbol}. Please check if the ticker symbol is correct.`);
    }

    // Fetch company profile
    const profileResponse = await fetch(
      `https://finnhub.io/api/v1/stock/profile2?symbol=${symbol}&token=${apiKey}`
    );
    const profileData = await profileResponse.json();

    // Validate profile data
    if (!profileData || !profileData.name) {
      console.error('No profile data available for symbol');
      throw new Error(`Symbol ${symbol} not found. Please use valid ticker symbols (e.g., AAPL, PLTR, TSLA).`);
    }

    // Fetch basic financials for additional metrics
    const metricsResponse = await fetch(
      `https://finnhub.io/api/v1/stock/metric?symbol=${symbol}&metric=all&token=${apiKey}`
    );
    const metricsData = await metricsResponse.json();
    const metrics = metricsData.metric || {};

    // Calculate time range for historical data based on period
    const periodMap: Record<string, number> = {
      '1M': 30,
      '3M': 90,
      '6M': 180,
      '1Y': 365,
      '3Y': 1095,
      '5Y': 1825,
      '10Y': 3650,
    };

    const daysAgo = periodMap[period] || 365;
    const to = Math.floor(Date.now() / 1000);
    const from = to - (daysAgo * 24 * 60 * 60);

    // Fetch historical candle data
    const candleResponse = await fetch(
      `https://finnhub.io/api/v1/stock/candle?symbol=${symbol}&resolution=D&from=${from}&to=${to}&token=${apiKey}`
    );
    const candleData = await candleResponse.json();

    // Transform the data to match our frontend format
    const historicalData = candleData.t?.map((timestamp: number, index: number) => ({
      date: new Date(timestamp * 1000).toISOString().split('T')[0],
      price: candleData.c[index],
    })) || [];

    // Calculate change and changePercent
    const currentPrice = quoteData.c || 0;
    const previousClose = quoteData.pc || 0;
    const change = currentPrice - previousClose;
    const changePercent = previousClose ? (change / previousClose) * 100 : 0;

    // Helper function to format large numbers
    const formatNumber = (num: number): string => {
      if (!num || num === 0) return '0';
      if (num >= 1e12) return `${(num / 1e12).toFixed(2)}T`;
      if (num >= 1e9) return `${(num / 1e9).toFixed(2)}B`;
      if (num >= 1e6) return `${(num / 1e6).toFixed(2)}M`;
      if (num >= 1e3) return `${(num / 1e3).toFixed(2)}K`;
      return num.toFixed(0);
    };

    // Calculate trading volume from historical data (last day's volume)
    const lastVolume = candleData.v?.[candleData.v.length - 1] || 0;
    const volume = formatNumber(lastVolume);
    
    // Market cap is in millions, convert to readable format
    const marketCapValue = (profileData.marketCapitalization || 0) * 1e6;
    const marketCap = formatNumber(marketCapValue);

    // Get 52-week high/low and P/E from metrics
    const low52 = metrics['52WeekLow'] || quoteData.l || 0;
    const high52 = metrics['52WeekHigh'] || quoteData.h || 0;
    const pe = metrics.peBasicExclExtraTTM || metrics.peExclExtraAnnual || 0;

    // Format response
    const stockData = {
      symbol: symbol,
      name: profileData.name || symbol,
      price: currentPrice,
      change: change,
      changePercent: changePercent,
      volume: volume,
      marketCap: marketCap,
      pe: pe ? parseFloat(pe.toFixed(2)) : 0,
      low52: low52,
      high52: high52,
      historicalData: historicalData,
      prediction: changePercent > 0 ? 'Bullish' : 'Bearish',
      targetPrice: currentPrice * (1 + (changePercent / 100) * 1.5),
      analystRating: changePercent > 2 ? 'Strong Buy' : changePercent > 0 ? 'Buy' : changePercent > -2 ? 'Hold' : 'Sell',
    };

    console.log('Stock data fetched successfully');

    return new Response(JSON.stringify(stockData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching stock data:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to fetch stock data' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
