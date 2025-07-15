import { useEffect, useState } from 'react';
import {PieChart,Pie,Cell,ResponsiveContainer,PieLabelRenderProps,Tooltip} from 'recharts';
import { fetchActiveUserCount } from '../../api/adminApi';

const COLORS = ['#58D68D', '#F9E79F'];
const LABELS = ['활동중', '탈퇴회원']; // 데이터에 맞춰서 라벨 설정

const PieChartComponent = () => {
  const [data, setData] = useState<{ name: string; value: number }[]>([]);

  useEffect(() => {
    fetchActiveUserCount()
    .then((fetchedData: { name: string; value: number }[]) => {
      const sorted = fetchedData.sort((a: { name: string }, b: { name: string }) => {
          // "활동중"을 먼저 정렬
          if (a.name === "활동중") return -1;
          if (b.name === "활동중") return 1;
          return 0;
        });
        setData(sorted);
      })
      .catch((err) => console.error('데이터 가져오기 실패:', err));
  }, []);

  // 총합 계산 (툴팁에 % 계산용)
  const total = data.reduce((acc, cur) => acc + cur.value, 0);

  const renderLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    index,
  }: PieLabelRenderProps & { index: number }) => {
    const RADIAN = Math.PI / 180;

    const numericCx = typeof cx === 'number' ? cx : parseFloat(cx ?? '0');
    const numericCy = typeof cy === 'number' ? cy : parseFloat(cy ?? '0');
    const numericInnerRadius = typeof innerRadius === 'number' ? innerRadius : parseFloat(innerRadius ?? '0');
    const numericOuterRadius = typeof outerRadius === 'number' ? outerRadius : parseFloat(outerRadius ?? '0');
    const numericMidAngle = typeof midAngle === 'number' ? midAngle : parseFloat(midAngle ?? '0');

    const radius = numericInnerRadius + (numericOuterRadius - numericInnerRadius) * 0.2;

    const x = numericCx + radius * Math.cos(-numericMidAngle * RADIAN);
    const y = numericCy + radius * Math.sin(-numericMidAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > numericCx ? 'start' : 'end'}
        dominantBaseline="central"
        fontWeight="bold"
      >
        {LABELS[index]}
      </text>
    );
  };

  // Tooltip 커스텀 렌더링
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const { value } = payload[0].payload;
      const percent = total > 0 ? ((value / total) * 100).toFixed(1) : '0';
      return (
        <div
          style={{
            background: 'rgba(0, 0, 0, 0.75)',
            color: '#fff',
            padding: '5px 10px',
            borderRadius: 4,
          }}
        >
          {`${value}명 (${percent}%)`}
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ width: '100%', height: 350 }}>
    <br />
      <h5 className="text-xl font-semibold mb-4">활동중/탈퇴 유저</h5>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderLabel}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PieChartComponent;
