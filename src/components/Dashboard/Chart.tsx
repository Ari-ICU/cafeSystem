import React from "react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import Footer from "../../pages/Footer";

const data = [
  { name: "Jan", users: 400, sales: 2400 },
  { name: "Feb", users: 300, sales: 1398 },
  { name: "Mar", users: 200, sales: 9800 },
  { name: "Apr", users: 278, sales: 3908 },
  { name: "May", users: 189, sales: 4800 },
];

const pieData = [
  { name: "Mobile", value: 400 },
  { name: "Laptop", value: 300 },
  { name: "Tablet", value: 300 },
  { name: "Others", value: 200 },
];

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042"];

const Charts: React.FC = () => {
  return (
    <div className=" space-y-10">
      <h1 className="text-2xl font-bold">📊 Charts</h1>

      {/* Line Chart */}
      <div className="bg-white rounded-xl shadow p-4">
        <h2 className="text-lg font-semibold mb-2">User Growth</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <Line type="monotone" dataKey="users" stroke="#8884d8" />
            <CartesianGrid stroke="#ccc" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Bar Chart */}
      <div className="bg-white rounded-xl shadow p-4">
        <h2 className="text-lg font-semibold mb-2">Monthly Sales</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="sales" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Pie Chart */}
      <div className="bg-white rounded-xl shadow p-4">
        <h2 className="text-lg font-semibold mb-2">Device Usage</h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              outerRadius={100}
              label
              dataKey="value"
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
      {/* Footer */}
       <div className="mt-auto">
                <Footer />
              </div>
    </div>
  );
};

export default Charts;
