"use client";

import { useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Package,
  Globe,
  Download,
  RefreshCw,
} from "lucide-react";
import { useCorporate } from "@/contexts/CorporateContext";
import PortfolioSummary from "@/components/portfolio/PortfolioSummary";
import PortfolioHoldings from "@/components/portfolio/PortfolioHoldings";
import PerformanceChart from "@/components/portfolio/PerformanceChart";
import CompositionBreakdown from "@/components/portfolio/CompositionBreakdown";
import RiskMetrics from "@/components/portfolio/RiskMetrics";
import TransactionHistory from "@/components/portfolio/TransactionHistory";
import TimelineChart from "@/components/portfolio/TimelineChart";

export default function PortfolioPage() {
  const { portfolio } = useCorporate();
  const [timeRange, setTimeRange] = useState<"1m" | "3m" | "6m" | "1y" | "all">(
    "6m",
  );
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await portfolio.refresh();
    } finally {
      setIsRefreshing(false);
    }
  };

  const summary = portfolio.summary;
  const performance = portfolio.performance;

  return (
    <div className="space-y-6 animate-in">
      {/* Portfolio Header */}
      <div className="bg-linear-to-r from-corporate-navy via-corporate-blue to-corporate-teal rounded-2xl p-6 md:p-8 text-white shadow-2xl relative">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between">
          <div className="mb-6 lg:mb-0">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2 tracking-tight">
              Carbon Credit Portfolio
            </h1>
            <p className="text-blue-100 opacity-90 max-w-2xl">
              Track your carbon credit investments, performance, and impact
              analytics.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 min-w-50">
              <div className="text-sm text-blue-200 mb-1">
                Total Portfolio Value
              </div>
              <div className="text-2xl font-bold">
                {performance
                  ? `$${(performance.portfolioValue / 1000000).toFixed(2)}M`
                  : "Loading..."}
              </div>
              <div className="text-xs text-green-300 flex items-center">
                <TrendingUp size={12} className="mr-1" />
                {summary
                  ? `${summary.quarterlyGrowth.toFixed(1)}% this quarter`
                  : "Loading..."}
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 min-w-50">
              <div className="text-sm text-blue-200 mb-1">
                Carbon Neutrality Progress
              </div>
              <div className="text-2xl font-bold">
                {summary
                  ? `${summary.netZeroProgress.toFixed(0)}%`
                  : "Loading..."}
              </div>
              <div className="text-xs text-blue-300">2030 Target: 100%</div>
            </div>
          </div>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing || portfolio.isLoading}
            className="absolute top-6 right-6 p-2 hover:bg-white/10 rounded-lg transition-colors disabled:opacity-50"
          >
            <RefreshCw
              size={20}
              className={isRefreshing ? "animate-spin" : ""}
            />
          </button>
        </div>
      </div>

      {/* Portfolio Summary Component */}
      <PortfolioSummary />

      {/* Performance Chart */}
      <PerformanceChart />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Composition Breakdown */}
        <CompositionBreakdown />

        {/* Risk Metrics */}
        <RiskMetrics />
      </div>

      {/* Timeline Chart */}
      <TimelineChart />

      {/* Portfolio Holdings Component */}
      <PortfolioHoldings />

      {/* Transaction History */}
      <TransactionHistory />
    </div>
  );
}
