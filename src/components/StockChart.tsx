import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

interface StockChartProps {
  symbol: string;
}

// Mock historical data - In a real app, this would come from an API
const generateMockData = (symbol: string) => {
  const basePrice = symbol === 'AAPL' ? 150 : symbol === 'TSLA' ? 200 : 300;
  const data = [];
  const now = new Date();
  
  for (let i = 1095; i >= 0; i--) { // 3 years of data
    const date = new Date(now.getTime() - (i * 24 * 60 * 60 * 1000));
    const randomVariation = (Math.random() - 0.5) * 0.1;
    const trendFactor = (1095 - i) / 1095 * 0.3; // Gradual upward trend
    const price = basePrice * (1 + trendFactor + randomVariation);
    
    data.push({
      date: date.toISOString().split('T')[0],
      price: Number(price.toFixed(2)),
      volume: Math.floor(Math.random() * 100000000),
    });
  }
  
  return data;
};

const StockChart = ({ symbol }: StockChartProps) => {
  const data = generateMockData(symbol);
  
  // Get recent 30 days for better visualization
  const recentData = data.slice(-90);

  const formatPrice = (value: number) => `$${value.toFixed(2)}`;
  const formatVolume = (value: number) => `${(value / 1000000).toFixed(1)}M`;

  return (
    <div className="h-96 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={recentData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <defs>
            <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
              <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis 
            dataKey="date" 
            stroke="hsl(var(--muted-foreground))"
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          />
          <YAxis 
            stroke="hsl(var(--muted-foreground))"
            tick={{ fontSize: 12 }}
            tickFormatter={formatPrice}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px',
              color: 'hsl(var(--foreground))'
            }}
            labelFormatter={(value) => new Date(value).toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
            formatter={(value: number, name: string) => [
              name === 'price' ? formatPrice(value) : formatVolume(value),
              name === 'price' ? 'Price' : 'Volume'
            ]}
          />
          <Area
            type="monotone"
            dataKey="price"
            stroke="hsl(var(--primary))"
            strokeWidth={2}
            fill="url(#priceGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StockChart;