"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Monitor, Cpu, HardDrive } from "lucide-react";

export default function CustomBuildPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate submission delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast.success("Build request submitted! We will contact you soon.");
    setIsSubmitting(false);
    (e.target as HTMLFormElement).reset();
  };

  return (
    <div className="min-h-screen bg-muted/20 py-16">
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-4">Custom PC Build</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Tell us what you need, and our experts will design the perfect system for your requirements and budget.
          </p>
        </div>

        <div className="bg-background rounded-2xl shadow-sm border p-8 md:p-12">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-sm font-semibold text-foreground">Full Name *</label>
                <input required type="text" className="w-full bg-muted/50 border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" placeholder="John Doe" />
              </div>
              
              <div className="space-y-3">
                <label className="text-sm font-semibold text-foreground">Phone Number *</label>
                <input required type="tel" className="w-full bg-muted/50 border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" placeholder="+91 98765 43210" />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-semibold text-foreground">Primary Use Case</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <label className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors has-[:checked]:border-primary has-[:checked]:bg-primary/5">
                  <input type="radio" name="useCase" value="gaming" className="text-primary focus:ring-primary accent-primary" defaultChecked />
                  <Monitor className="w-5 h-5 text-muted-foreground" />
                  <span className="font-medium text-sm">Gaming</span>
                </label>
                <label className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors has-[:checked]:border-primary has-[:checked]:bg-primary/5">
                  <input type="radio" name="useCase" value="workstation" className="text-primary focus:ring-primary accent-primary" />
                  <Cpu className="w-5 h-5 text-muted-foreground" />
                  <span className="font-medium text-sm">Workstation</span>
                </label>
                <label className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors has-[:checked]:border-primary has-[:checked]:bg-primary/5">
                  <input type="radio" name="useCase" value="office" className="text-primary focus:ring-primary accent-primary" />
                  <HardDrive className="w-5 h-5 text-muted-foreground" />
                  <span className="font-medium text-sm">Home/Office</span>
                </label>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-semibold text-foreground">Estimated Budget (₹)</label>
              <select className="w-full bg-muted/50 border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50">
                <option value="under50k">Under ₹50,000</option>
                <option value="50k-80k">₹50,000 - ₹80,000</option>
                <option value="80k-150k">₹80,000 - ₹1,50,000</option>
                <option value="above150k">Above ₹1,50,000</option>
              </select>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-semibold text-foreground">Specific Requirements or Preferences</label>
              <textarea 
                rows={4} 
                className="w-full bg-muted/50 border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" 
                placeholder="E.g., I need a lot of storage, prefer Intel over AMD, need RGB lighting..."
              ></textarea>
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-primary text-primary-foreground font-semibold py-4 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Submitting..." : "Submit Build Request"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
