import { Card } from '@/components/ui/card';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

interface MetricsProps {
  data: {
    cycle: number;
    ipc: number;
    branchAccuracy: number;
    powerConsumption: number;
  }[];
}

export function Metrics({ data }: MetricsProps) {
  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-4">Performance Metrics</h3>
      <div className="w-full h-[300px]">
        <LineChart
          width={800}
          height={300}
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="cycle" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="ipc"
            stroke="#8884d8"
            name="IPC"
          />
          <Line
            type="monotone"
            dataKey="branchAccuracy"
            stroke="#82ca9d"
            name="Branch Prediction Accuracy"
          />
          <Line
            type="monotone"
            dataKey="powerConsumption"
            stroke="#ffc658"
            name="Power Consumption (W)"
          />
        </LineChart>
      </div>
    </Card>
  );
}
