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
    const { symbol } = await req.json();
    const apiKey = Deno.env.get('FINNHUB_API_KEY');

    if (!apiKey) {
      throw new Error('FINNHUB_API_KEY not configured');
    }

    console.log(`Fetching news for ${symbol}`);

    // Get news from the last 30 days
    const to = new Date();
    const from = new Date();
    from.setDate(from.getDate() - 30);

    const toStr = to.toISOString().split('T')[0];
    const fromStr = from.toISOString().split('T')[0];

    const newsResponse = await fetch(
      `https://finnhub.io/api/v1/company-news?symbol=${symbol}&from=${fromStr}&to=${toStr}&token=${apiKey}`
    );
    const newsData = await newsResponse.json();

    // Transform news data to match our frontend format
    const news = newsData.slice(0, 10).map((item: any) => ({
      title: item.headline,
      summary: item.summary || item.headline,
      time: new Date(item.datetime * 1000).toLocaleString(),
      sentiment: item.sentiment || 'neutral',
      source: item.source,
      url: item.url,
    }));

    console.log(`Fetched ${news.length} news articles`);

    return new Response(JSON.stringify({ news }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching news:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to fetch news' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
