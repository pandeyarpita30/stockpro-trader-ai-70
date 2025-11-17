import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Button } from "@/components/ui/button";

interface StockChartProps {
  symbol: string;
  data: Array<{ date: string; price: number }>;
  selectedPeriod: string;
  onPeriodChange: (period: string) => void;
}

type TimePeriod = {
  label: string;
  value: string;
};

const timePeriods: TimePeriod[] = [
  { label: '1M', value: '1M' },
  { label: '3M', value: '3M' },
  { label: '6M', value: '6M' },
  { label: '1Y', value: '1Y' },
  { label: '3Y', value: '3Y' },
  { label: '5Y', value: '5Y' },
  { label: '10Y', value: '10Y' },
];

const StockChart = ({ data, selectedPeriod, onPeriodChange }: StockChartProps) => {
  const formatPrice = (value: number) => `$${value.toFixed(2)}`;

  const getDateFormat = (): Intl.DateTimeFormatOptions => {
    if (selectedPeriod === '1M' || selectedPeriod === '3M') return { month: 'short', day: 'numeric' } as const;
    if (selectedPeriod === '6M' || selectedPeriod === '1Y') return { month: 'short', year: '2-digit' } as const;
    return { year: 'numeric' } as const;
  };

  return (
    <div className="space-y-4">
      {/* Time Period Tabs */}
      <div className="flex flex-wrap gap-2 p-1 bg-muted/50 rounded-lg">
        {timePeriods.map((period) => (
          <Button
            key={period.value}
            variant={selectedPeriod === period.value ? "default" : "ghost"}
            size="sm"
            onClick={() => onPeriodChange(period.value)}
            className={`transition-all ${
              selectedPeriod === period.value 
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
            formatter={(value: number) => [formatPrice(value), 'Price']}
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