"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import {
  mockCorporateData,
  mockCredits,
  mockProjects,
  mockRetirements,
} from "@/lib/mockData";
import { usePortfolio } from "@/hooks/usePortfolio";
import type { PortfolioState } from "@/hooks/usePortfolio";
import type { AppError } from "@/lib/errors";
import type { PaginationParams, TimelineQueryParams } from "@/api/types";
import type { PortfolioHolding as PortfolioHoldingType } from "@/api/types";

interface CorporateContextType {
  // Company data
  company: any;
  credits: any[];
  projects: any[];
  retirements: any[];

  // Portfolio data (from API)
  portfolio: PortfolioState & {
    isLoading: boolean;
    refresh: () => Promise<void>;
    // Fetch methods
    fetchSummary: (params?: PaginationParams) => Promise<void>;
    fetchPerformance: (params?: PaginationParams) => Promise<void>;
    fetchComposition: (params?: PaginationParams) => Promise<void>;
    fetchRiskAnalysis: (params?: PaginationParams) => Promise<void>;
    fetchHoldings: (params?: PaginationParams) => Promise<void>;
    fetchTimeline: (params?: TimelineQueryParams) => Promise<void>;
    fetchAnalytics: (params?: PaginationParams) => Promise<void>;
    fetchTransactions: (params?: PaginationParams) => Promise<void>;
    fetchHoldingDetails: (id: string) => Promise<void>;
    selectHolding: (holding: PortfolioHoldingType) => void;
    clearHolding: () => void;
    // Error states
    summaryError: AppError | null;
    performanceError: AppError | null;
    compositionError: AppError | null;
    riskAnalysisError: AppError | null;
    holdingsError: AppError | null;
    analyticsError: AppError | null;
    timelineError: AppError | null;
    transactionsError: AppError | null;
    selectedHoldingError: AppError | null;
    // Loading states
    isLoadingSummary: boolean;
    isLoadingPerformance: boolean;
    isLoadingComposition: boolean;
    isLoadingRiskAnalysis: boolean;
    isLoadingHoldings: boolean;
    isLoadingAnalytics: boolean;
    isLoadingTimeline: boolean;
    isLoadingTransactions: boolean;
    isLoadingSelectedHolding: boolean;
  };

  // UI state
  selectedCredit: any | null;
  setSelectedCredit: (credit: any) => void;
  addToCart: (credit: any) => void;
  cart: any[];
  removeFromCart: (creditId: string) => void;
  clearCart: () => void;
  theme: "light" | "dark";
  toggleTheme: () => void;
}

const CorporateContext = createContext<CorporateContextType | undefined>(
  undefined,
);

export function CorporateProvider({ children }: { children: ReactNode }) {
  const [company] = useState(mockCorporateData);
  const [credits] = useState(mockCredits);
  const [projects] = useState(mockProjects);
  const [retirements] = useState(mockRetirements);
  const [selectedCredit, setSelectedCredit] = useState<any>(null);
  const [cart, setCart] = useState<any[]>([]);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  // Portfolio API integration
  const portfolioHook = usePortfolio();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    setIsInitialized(true);
  }, []);

  const addToCart = (credit: any) => {
    setCart((prev) => [...prev, credit]);
  };

  const removeFromCart = (creditId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== creditId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const portfolioValue = {
    ...portfolioHook.data,
    summary: portfolioHook.summary,
    performance: portfolioHook.performance,
    composition: portfolioHook.composition,
    riskAnalysis: portfolioHook.riskAnalysis,
    holdings: portfolioHook.holdings,
    analytics: portfolioHook.analytics,
    timeline: portfolioHook.timeline,
    transactions: portfolioHook.transactions,
    selectedHolding: portfolioHook.selectedHolding,
    isLoading: portfolioHook.isLoading,
    refresh: portfolioHook.fetchAll,
    // Fetch methods
    fetchSummary: portfolioHook.fetchSummary,
    fetchPerformance: portfolioHook.fetchPerformance,
    fetchComposition: portfolioHook.fetchComposition,
    fetchRiskAnalysis: portfolioHook.fetchRiskAnalysis,
    fetchHoldings: portfolioHook.fetchHoldings,
    fetchTimeline: portfolioHook.fetchTimeline,
    fetchAnalytics: portfolioHook.fetchAnalytics,
    fetchTransactions: portfolioHook.fetchTransactions,
    fetchHoldingDetails: portfolioHook.fetchHoldingDetails,
    selectHolding: portfolioHook.selectHolding,
    clearHolding: portfolioHook.clearHolding,
    // Error states
    summaryError: portfolioHook.summaryError,
    performanceError: portfolioHook.performanceError,
    compositionError: portfolioHook.compositionError,
    riskAnalysisError: portfolioHook.riskAnalysisError,
    holdingsError: portfolioHook.holdingsError,
    analyticsError: portfolioHook.analyticsError,
    timelineError: portfolioHook.timelineError,
    transactionsError: portfolioHook.transactionsError,
    selectedHoldingError: portfolioHook.selectedHoldingError,
    // Loading states
    isLoadingSummary: portfolioHook.isLoadingSummary,
    isLoadingPerformance: portfolioHook.isLoadingPerformance,
    isLoadingComposition: portfolioHook.isLoadingComposition,
    isLoadingRiskAnalysis: portfolioHook.isLoadingRiskAnalysis,
    isLoadingHoldings: portfolioHook.isLoadingHoldings,
    isLoadingAnalytics: portfolioHook.isLoadingAnalytics,
    isLoadingTimeline: portfolioHook.isLoadingTimeline,
    isLoadingTransactions: portfolioHook.isLoadingTransactions,
    isLoadingSelectedHolding: portfolioHook.isLoadingSelectedHolding,
  };

  return (
    <CorporateContext.Provider
      value={{
        company,
        credits,
        projects,
        retirements,
        portfolio: portfolioValue,
        selectedCredit,
        setSelectedCredit,
        addToCart,
        cart,
        removeFromCart,
        clearCart,
        theme,
        toggleTheme,
      }}
    >
      {children}
    </CorporateContext.Provider>
  );
}

export const useCorporate = () => {
  const context = useContext(CorporateContext);
  if (!context) {
    throw new Error("useCorporate must be used within CorporateProvider");
  }
  return context;
};
