"use client";

import { useState } from "react";
import OrderCard from "./OrderCard";
import { useOrdersQuery } from "@/queries/useOrdersQuery";
import { useOrdersCountQuery } from "@/queries/useOrdersCountQuery";

type TabStatus = "All" | "IN_PROGRESS" | "COMPLETED";

const TAB_LABELS: Record<TabStatus, string> = {
  All: "All",
  IN_PROGRESS: "In progress",
  COMPLETED: "Completed",
};

export default function OrdersContent() {
  const [activeTab, setActiveTab] = useState<TabStatus>("All");

  const {
    data: orders = [],
    isLoading,
    isError,
  } = useOrdersQuery(activeTab === "All" ? undefined : activeTab);

  const { data: counts } = useOrdersCountQuery();

  const getCount = (tab: TabStatus) => {
    if (!counts) return "–";
    if (tab === "All") return counts.total;
    if (tab === "IN_PROGRESS") return counts.in_progress;
    return counts.completed;
  };

  // We still need "All" counts even when filtered, but for simplicity 
  // with current API (which filters by status), we'll just show the count of current view
  // unless we fetch all and filter client-side.
  // The user's mock code had getCount which filtered MOCK_ORDERS.
  // With API, we might need a separate query for counts or just show count for current tab.
  // For now, I'll only show count for the current result set to keep it simple.

  const tabs: TabStatus[] = ["All", "IN_PROGRESS", "COMPLETED"];

  if (isLoading) {
    return (
      <div className="flex flex-col gap-12 max-mobile:gap-9">
        {/* Tabs */}
        <div className="flex gap-2.5 max-mobile:flex-col">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`w-[200px] py-5 px-10 border transition-all text-sm group max-tablet:w-full max-tablet:px-0 max-mobile:py-4 max-mobile:text-xs ${activeTab === tab
                ? "bg-black text-white border-black"
                : "bg-transparent text-black border-black/10 hover:bg-black hover:text-white"
                }`}
            >
              {TAB_LABELS[tab]} <span className={`transition-all ${activeTab === tab ? "text-white/40" : "text-black/60 group-hover:text-white/40"
                }`}>({getCount(tab)})</span>
            </button>
          ))}
        </div>



        <div className="min-h-[400px] flex items-center justify-center">
          <p className="text-sm text-black animate-pulse">
            Loading...
          </p>
        </div>
      </div>

    );
  }

  if (isError) {
    return (
      <div className="flex flex-col gap-12 max-mobile:gap-9">
        {/* Tabs */}
        <div className="flex gap-2.5 max-mobile:flex-col">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`w-[200px] py-5 px-10 border transition-all text-sm group max-tablet:w-full max-tablet:px-0 max-mobile:py-4 max-mobile:text-xs ${activeTab === tab
                ? "bg-black text-white border-black"
                : "bg-transparent text-black border-black/10 hover:bg-black hover:text-white"
                }`}
            >
              {TAB_LABELS[tab]} <span className={`transition-all ${activeTab === tab ? "text-white/40" : "text-black/60 group-hover:text-white/40"
                }`}>({getCount(tab)})</span>
            </button>
          ))}
        </div>



        <div className="min-h-[400px] flex flex-col items-center justify-center gap-4">
          <p className="text-sm text-black/40">
            Failed to load orders
          </p>
          <button
            onClick={() => window.location.reload()}
            className="text-xs underline underline-offset-4 decoration-black/40"
          >
            Retry
          </button>
        </div>

      </div>

    );
  }

  return (
    <div className="flex flex-col gap-12 max-mobile:gap-9">
      {/* Tabs */}
      <div className="flex gap-2.5 max-mobile:flex-col">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`w-[200px] py-5 px-10 border transition-all text-sm group max-tablet:w-full max-tablet:px-0 max-mobile:py-4 max-mobile:text-xs ${activeTab === tab
              ? "bg-black text-white border-black"
              : "bg-transparent text-black border-black/10 hover:bg-black hover:text-white"
              }`}
          >
            {TAB_LABELS[tab]} <span className={`transition-all ${activeTab === tab ? "text-white/40" : "text-black/60 group-hover:text-white/40"
              }`}>({getCount(tab)})</span>
          </button>
        ))}
      </div>



      {/* Orders List */}
      <div className="flex flex-col gap-8 max-mobile:gap-9">
        {orders.length > 0 ? (
          orders.map((order, idx) => (
            <OrderCard key={`${order.id}-${idx}`} order={order} />
          ))
        ) : (
          <div className="min-h-[400px] flex items-center justify-center">
            <p className="text-sm text-black/40">
              No orders found in this category
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
