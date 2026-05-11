"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronDown, ChevronUp, Check, X } from "lucide-react";
import { storeConfig } from "@/lib/store-config";

export function FilterSidebar({ categoryId }: { categoryId: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const categoryConfig = storeConfig.categories.find(c => c.id === categoryId) || storeConfig.categories[0];
  const filters = categoryConfig.filters || [];

  const updateFilters = (key: string, value: string) => {
    const currentParams = new URLSearchParams(searchParams.toString());
    const existingValues = currentParams.getAll(key);
    
    if (existingValues.includes(value)) {
      // Remove value
      currentParams.delete(key);
      const newValues = existingValues.filter(v => v !== value);
      newValues.forEach(v => currentParams.append(key, v));
    } else {
      // Add value
      currentParams.append(key, value);
    }
    
    router.push(`/products?${currentParams.toString()}`);
  };

  const clearFilters = () => {
    router.push(`/products?category=${categoryId}`);
  };

  // Check if any filters (besides category) are active
  let activeFilterCount = 0;
  for (const [key] of Array.from(searchParams.entries())) {
    if (key !== "category") activeFilterCount++;
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#222]">
        <h3 className="font-heading font-bold text-xl text-[#F5F0EB]">FILTERS</h3>
        {activeFilterCount > 0 && (
          <button onClick={clearFilters} className="text-xs font-mono text-[#EF4444] hover:text-red-400">
            CLEAR ALL
          </button>
        )}
      </div>

      <div className="space-y-8">
        {/* Availability Toggle */}
        <div className="flex items-center justify-between">
          <span className="font-mono text-sm text-[#F5F0EB]">In Stock Only</span>
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
            <div className="w-11 h-6 bg-[#222] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#6C63FF]"></div>
          </label>
        </div>

        {/* Dynamic Filters */}
        {filters.map((filter) => (
          <FilterSection 
            key={filter.id} 
            title={filter.label} 
            options={filter.options || ["Option 1", "Option 2", "Option 3"]} // Fallback for demo
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
    <div className="border-t border-[#222] pt-6">
      <button 
        className="flex w-full items-center justify-between font-mono text-sm text-[#F5F0EB] mb-4"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{title.toUpperCase()}</span>
        {isOpen ? <ChevronUp className="w-4 h-4 text-[#666]" /> : <ChevronDown className="w-4 h-4 text-[#666]" />}
      </button>
      
      {isOpen && (
        <div className="space-y-3">
          {options.map((opt: string) => {
            const isSelected = selectedValues.includes(opt);
            return (
              <label key={opt} className="flex items-center gap-3 cursor-pointer group">
                <div className={`w-4 h-4 border flex items-center justify-center transition-colors ${isSelected ? 'bg-[#6C63FF] border-[#6C63FF]' : 'border-[#444] group-hover:border-[#6C63FF]'}`}>
                  {isSelected && <Check className="w-3 h-3 text-white" />}
                </div>
                <span className={`text-sm ${isSelected ? 'text-[#F5F0EB]' : 'text-[#888] group-hover:text-[#ccc]'}`}>
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
