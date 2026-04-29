"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { useCorporate } from "@/contexts/CorporateContext";

export default function PortfolioAnalytics() {
  const { portfolio } = useCorporate();

  const methodologyData = [
    { name: "REDD+", value: 35, color: "#0073e6" },
    { name: "Renewable Energy", value: 25, color: "#00d4aa" },
    { name: "Agriculture", value: 20, color: "#8b5cf6" },
    { name: "Energy Efficiency", value: 15, color: "#f59e0b" },
    { name: "Others", value: 5, color: "#6b7280" },
  ];

  const regionData = [
    { name: "South America", value: 40, color: "#10b981" },
    { name: "Asia", value: 30, color: "#3b82f6" },
    { name: "Africa", value: 20, color: "#8b5cf6" },
    { name: "North America", value: 10, color: "#f59e0b" },
  ];

  return (
    <div className="corporate-card p-6 h-full">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
        Portfolio Composition
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h3 className="font-medium mb-4 text-gray-700 dark:text-gray-300">
            By Methodology
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={methodologyData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
              >
                {methodologyData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value}%`, "Share"]} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {methodologyData.map((item) => (
              <div
                key={item.name}
                className="flex items-center justify-between text-sm"
              >
                <div className="flex items-center">
                  <div
                    className="w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-gray-700 dark:text-gray-300">
                    {item.name}
                  </span>
                </div>
                <span className="font-medium">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-medium mb-4 text-gray-700 dark:text-gray-300">
            By Region
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={regionData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
              >
                {regionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value}%`, "Share"]} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {regionData.map((item) => (
              <div
                key={item.name}
                className="flex items-center justify-between text-sm"
              >
                <div className="flex items-center">
                  <div
                    className="w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-gray-700 dark:text-gray-300">
                    {item.name}
                  </span>
                </div>
                <span className="font-medium">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <div className="text-2xl font-bold text-corporate-blue">
              {Object.keys(portfolio.sdgContributions ?? {}).length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              SDGs Supported
            </div>
          </div>
          <div className="text-center p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <div className="text-2xl font-bold text-corporate-teal">8</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Countries
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
