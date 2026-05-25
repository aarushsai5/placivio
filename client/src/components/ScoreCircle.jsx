import { RadialBarChart, RadialBar, ResponsiveContainer } from 'recharts';

export default function ScoreCircle({ score = 0, size = 192 }) {
  const getColor = (s) => {
    if (s < 40) return '#ef4444';
    if (s <= 70) return '#eab308';
    return '#22c55e';
  };

  const color = getColor(score);
  const data = [{ value: score, fill: color }];

  return (
    <div className="relative" style={{ width: size, height: size, minWidth: size, minHeight: size }}>
      <ResponsiveContainer width="100%" height="100%">
        <RadialBarChart
          cx="50%"
          cy="50%"
          innerRadius="75%"
          outerRadius="100%"
          startAngle={90}
          endAngle={-270}
          data={data}
          barSize={12}
        >
          <RadialBar
            background={{ fill: '#1a1a2e' }}
            dataKey="value"
            cornerRadius={10}
            max={100}
          />
        </RadialBarChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-bold" style={{ color }}>{score}</span>
        <span className="text-xs text-slate-500 mt-1">Placement Ready</span>
      </div>
    </div>
  );
}
