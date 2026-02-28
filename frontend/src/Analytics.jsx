import { useEffect, useState } from "react";
import { Bar, Pie, Line } from "react-chartjs-2";
import axios from "axios";

export default function Analytics() {
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:8000/analytics/mysecret123/")
      .then(res => setAnalytics(res.data));
  }, []);

  if (!analytics) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-slate-100 p-10 space-y-10">

      <div className="bg-white p-6 rounded-2xl shadow">
        <h2>Total Production</h2>
        <Bar data={{
          labels: ["OK","Hold","Reject","Diagonal"],
          datasets: [{
            data: [
              analytics.totals.total_ok || 0,
              analytics.totals.total_hold || 0,
              analytics.totals.total_reject || 0,
              analytics.totals.total_diagonal || 0,
            ]
          }]
        }}/>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow">
        <h2>Operator Contribution</h2>
        <Pie data={{
          labels: analytics.operator_data.map(o => o.operator_name),
          datasets: [{
            data: analytics.operator_data.map(o => o.total_ok)
          }]
        }}/>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow">
        <h2>Daily Trend</h2>
        <Line data={{
          labels: analytics.daily_trend.map(d => d.day),
          datasets: [{
            data: analytics.daily_trend.map(d => d.total_ok)
          }]
        }}/>
      </div>

    </div>
  );
}