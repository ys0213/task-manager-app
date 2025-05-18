import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";
import { fetchMonthlyUserStats } from "../../api/adminApi";

const MonthlyUserChart = () => {
  const [data, setData] = useState<{ month: string; count: number }[]>([]);

  useEffect(() => {
    fetchMonthlyUserStats()
      .then(setData)
      .catch((err) => console.error("통계 가져오기 실패:", err));
  }, []);

  return (
    <div className="mt-8">
      <h5 className="text-xl font-semibold mb-4">월별 가입자 수</h5>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="count" fill="#B0EDCA" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MonthlyUserChart;
