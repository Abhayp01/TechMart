"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronDown, ChevronUp, Check } from "lucide-react";
import { storeConfig } from "@/lib/store-config";

export function FilterSidebar({ categoryId }: { categoryId: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const categoryConfig = storeConfig.categories.find(c => c.id === categoryId) || storeConfig.categories[0];
  const filters = categoryConfig.filters || [];

  // Price range state
  const [priceMin, setPriceMin] = useState(searchParams.get("priceMin") || "");
  const [priceMax, setPriceMax] = useState(searchParams.get("priceMax") || "");

  const updateFilters = (key: string, value: string) => {
    const currentParams = new URLSearchParams(searchParams.toString());
    const existingValues = currentParams.getAll(key);

    if (existingValues.includes(value)) {
      currentParams.delete(key);
      const newValues = existingValues.filter(v => v !== value);
      newValues.forEach(v => currentParams.append(key, v));
    } else {
      currentParams.append(key, value);
    }

    router.push(`/products?${currentParams.toString()}`);
  };

  const applyPriceRange = () => {
    const currentParams = new URLSearchParams(searchParams.toString());
    if (priceMin) currentParams.set("priceMin", priceMin);
    else currentParams.delete("priceMin");
    if (priceMax) currentParams.set("priceMax", priceMax);
    else currentParams.delete("priceMax");
    router.push(`/products?${currentParams.toString()}`);
  };

  const clearFilters = () => {
    setPriceMin("");
    setPriceMax("");
    router.push(`/products?category=${categoryId}`);
  };

  // Check if any filters (besides category) are active
  let activeFilterCount = 0;
  for (const [key] of Array.from(searchParams.entries())) {
    if (key !== "category") activeFilterCount++;
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
        <h3 className="font-heading font-bold text-lg text-foreground">
          Filters {activeFilterCount > 0 && (
            <span className="ml-2 bg-primary text-primary-foreground text-[10px] font-bold px-2 py-0.5 rounded-full">
              {activeFilterCount}
            </span>
          )}
        </h3>
        {activeFilterCount > 0 && (
          <button onClick={clearFilters} className="text-xs font-semibold text-red-500 hover:text-red-600 transition-colors">
            CLEAR ALL
          </button>
        )}
      </div>

      <div className="space-y-6">
        {/* In Stock Toggle */}
        <div className="flex items-center justify-between pb-5 border-b border-border">
          <span className="font-semibold text-sm text-foreground">In Stock Only</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={searchParams.has("inStock")}
              onChange={() => {
                const params = new URLSearchParams(searchParams.toString());
                if (params.has("inStock")) params.delete("inStock");
                else params.set("inStock", "true");
                router.push(`/products?${params.toString()}`);
              }}
            />
            <div className="w-11 h-6 bg-muted border border-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
          </label>
        </div>

        {/* Price Range */}
        <div className="pb-5 border-b border-border">
          <h4 className="font-semibold text-sm text-foreground mb-3 uppercase tracking-wide">Price Range (₹)</h4>
          <div className="flex items-center gap-2 mb-3">
            <input
              type="number"
              placeholder="Min"
              min="0"
              value={priceMin}
              onChange={e => setPriceMin(e.target.value)}
              className="w-full border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 bg-white"
            />
            <span className="text-muted-foreground font-bold shrink-0">—</span>
            <input
              type="number"
              placeholder="Max"
              min="0"
              value={priceMax}
              onChange={e => setPriceMax(e.target.value)}
              className="w-full border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 bg-white"
            />
          </div>
          <button
            onClick={applyPriceRange}
            className="w-full bg-primary/10 text-primary font-semibold text-sm py-2 rounded-lg hover:bg-primary hover:text-white transition-colors"
          >
            Apply Price
          </button>
        </div>

        {/* Dynamic Filters */}
        {filters.map((filter) => (
          <FilterSection
            key={filter.id}
            title={filter.label}
            options={filter.options || []}
            filterKey={filter.id}
            searchParams={searchParams}
            updateFilters={updateFilters}
          />
        ))}
      </div>
    </div>
  );
}

function FilterSection({ title, options, filterKey, searchParams, updateFilters }: any) {
  const [isOpen, setIsOpen] = useState(true);
  const selectedValues = searchParams.getAll(filterKey);

  return (
    <div className="border-b border-border pb-5">
      <button
        className="flex w-full items-center justify-between font-semibold text-sm text-foreground mb-3"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="uppercase tracking-wide">{title}</span>
        {isOpen ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
      </button>

      {isOpen && (
        <div className="space-y-2.5">
          {options.map((opt: string) => {
            const isSelected = selectedValues.includes(opt);
            return (
              <label
                key={opt}
                className="flex items-center gap-3 cursor-pointer group"
                onClick={() => updateFilters(filterKey, opt)}
              >
                <div className={`w-4 h-4 border rounded flex items-center justify-center shrink-0 transition-colors ${isSelected ? "bg-primary border-primary" : "border-input group-hover:border-primary"}`}>
                  {isSelected && <Check className="w-3 h-3 text-primary-foreground" />}
                </div>
                <span className={`text-sm leading-tight ${isSelected ? "text-foreground font-semibold" : "text-muted-foreground group-hover:text-foreground"}`}>
                  {opt}
                </span>
              </label>
            );
          })}
        </div>
      )}
    </div>
  );
}
