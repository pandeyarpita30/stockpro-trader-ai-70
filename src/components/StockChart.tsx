import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { Button } from "@/components/ui/button";

interface StockChartProps {
  symbol: string;
}

type TimePeriod = {
  label: string;
  value: string;
  days: number;
};

const timePeriods: TimePeriod[] = [
  { label: '1M', value: '1M', days: 30 },
  { label: '3M', value: '3M', days: 90 },
  { label: '6M', value: '6M', days: 180 },
  { label: '1Y', value: '1Y', days: 365 },
  { label: '3Y', value: '3Y', days: 1095 },
  { label: '5Y', value: '5Y', days: 1825 },
  { label: '10Y', value: '10Y', days: 3650 },
];

// Mock historical data generator with configurable time periods
const generateMockData = (symbol: string, days: number) => {
  const basePrice = symbol === 'AAPL' ? 150 : symbol === 'TSLA' ? 200 : 300;
  const data = [];
  const now = new Date();
  
  // Adjust data points based on time period for better performance
  const dataPoints = Math.min(days, 500); // Limit data points for performance
  const interval = Math.max(1, Math.floor(days / dataPoints));
  
  for (let i = days; i >= 0; i -= interval) {
    const date = new Date(now.getTime() - (i * 24 * 60 * 60 * 1000));
    const randomVariation = (Math.random() - 0.5) * 0.1;
    const trendFactor = (days - i) / days * 0.3; // Gradual upward trend
    const cyclicalFactor = Math.sin((days - i) / days * Math.PI * 4) * 0.1; // Add some cyclical movement
    const price = basePrice * (1 + trendFactor + randomVariation + cyclicalFactor);
    
    data.push({
      date: date.toISOString().split('T')[0],
      price: Number(price.toFixed(2)),
      volume: Math.floor(Math.random() * 100000000),
    });
  }
  
  return data.reverse();
};

const StockChart = ({ symbol }: StockChartProps) => {
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>(timePeriods[4]); // Default to 3Y
  const data = generateMockData(symbol, selectedPeriod.days);

  const formatPrice = (value: number) => `$${value.toFixed(2)}`;
  const formatVolume = (value: number) => `${(value / 1000000).toFixed(1)}M`;

  const getDateFormat = (): Intl.DateTimeFormatOptions => {
    if (selectedPeriod.days <= 30) return { month: 'short', day: 'numeric' } as const;
    if (selectedPeriod.days <= 365) return { month: 'short', year: '2-digit' } as const;
    return { year: 'numeric' } as const;
  };

  return (
    <div className="space-y-4">
      {/* Time Period Tabs */}
      <div className="flex flex-wrap gap-2 p-1 bg-muted/50 rounded-lg">
        {timePeriods.map((period) => (
          <Button
            key={period.value}
            variant={selectedPeriod.value === period.value ? "default" : "ghost"}
            size="sm"
            onClick={() => setSelectedPeriod(period)}
            className={`transition-all ${
              selectedPeriod.value === period.value 
                ? "bg-primary text-primary-foreground shadow-sm" 
                : "hover:bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            {period.label}
          </Button>
        ))}
      </div>
      
      {/* Chart */}
      <div className="h-96 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
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
              tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', getDateFormat())}
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
    </div>
  );
};

export default StockChart;