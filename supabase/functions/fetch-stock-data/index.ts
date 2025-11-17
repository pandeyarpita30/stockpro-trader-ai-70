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

    // Fetch company profile
    const profileResponse = await fetch(
      `https://finnhub.io/api/v1/stock/profile2?symbol=${symbol}&token=${apiKey}`
    );
    const profileData = await profileResponse.json();

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

    // Format response
    const stockData = {
      symbol: symbol,
      name: profileData.name || symbol,
      price: currentPrice,
      change: change,
      changePercent: changePercent,
      volume: profileData.shareOutstanding || 0,
      marketCap: profileData.marketCapitalization || 0,
      peRatio: 0, // Finnhub doesn't provide P/E in basic profile
      weekRange52: `${quoteData.l || 0} - ${quoteData.h || 0}`,
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
