"use client";

import { useCartStore } from "@/lib/cart-store";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function CheckoutPage() {
  const { items, getSubtotal, clearCart } = useCartStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [contactInfo, setContactInfo] = useState({
    name: "", email: "", phone: "", address: "", city: ""
  });

  useEffect(() => {
    setMounted(true);
    if (items.length === 0) {
      router.push("/");
    }
  }, [items.length, router]);

  if (!mounted || items.length === 0) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      setStep(2);
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contactInfo,
          items,
          subtotal: getSubtotal()
        })
      });

      const data = await res.json();
      
      if (data.success) {
        clearCart();
        router.push(`/order-confirmed?id=${data.orderId}`);
      } else {
        alert("Error placing order: " + data.error);
        setIsSubmitting(false);
      }
    } catch (err) {
      console.error(err);
      alert("A network error occurred. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pt-24 pb-32 text-foreground">
      <div className="max-w-4xl mx-auto px-6">
        <h1 className="text-4xl font-heading font-bold mb-12 border-b border-border pb-6">ORDER INQUIRY</h1>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          <div className="md:col-span-7">
            <form onSubmit={handleSubmit}>
              {step === 1 ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <h2 className="text-xl font-semibold text-primary mb-6">1. CONTACT INFORMATION</h2>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-muted-foreground mb-2">FULL NAME</label>
                      <input 
                        required type="text" 
                        className="w-full bg-muted/50 border border-border p-4 text-foreground focus:border-primary focus:ring-1 focus:ring-primary outline-none rounded-lg"
                        value={contactInfo.name} onChange={e => setContactInfo({...contactInfo, name: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-muted-foreground mb-2">EMAIL ADDRESS</label>
                      <input 
                        required type="email" 
                        className="w-full bg-muted/50 border border-border p-4 text-foreground focus:border-primary focus:ring-1 focus:ring-primary outline-none rounded-lg"
                        value={contactInfo.email} onChange={e => setContactInfo({...contactInfo, email: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-muted-foreground mb-2">PHONE NUMBER</label>
                      <input 
                        required type="tel" 
                        className="w-full bg-muted/50 border border-border p-4 text-foreground focus:border-primary focus:ring-1 focus:ring-primary outline-none rounded-lg"
                        value={contactInfo.phone} onChange={e => setContactInfo({...contactInfo, phone: e.target.value})}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="col-span-2">
                        <label className="block text-sm font-medium text-muted-foreground mb-2">STREET ADDRESS</label>
                        <input 
                          required type="text" 
                          className="w-full bg-muted/50 border border-border p-4 text-foreground focus:border-primary focus:ring-1 focus:ring-primary outline-none rounded-lg"
                          value={contactInfo.address} onChange={e => setContactInfo({...contactInfo, address: e.target.value})}
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-sm font-medium text-muted-foreground mb-2">CITY</label>
                        <input 
                          required type="text" 
                          className="w-full bg-muted/50 border border-border p-4 text-foreground focus:border-primary focus:ring-1 focus:ring-primary outline-none rounded-lg"
                          value={contactInfo.city} onChange={e => setContactInfo({...contactInfo, city: e.target.value})}
                        />
                      </div>
                    </div>
                    
                    <button type="submit" className="w-full bg-primary text-primary-foreground font-bold py-4 hover:bg-primary/90 rounded-lg transition-colors mt-8">
                      CONTINUE TO REVIEW
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <h2 className="text-xl font-semibold text-primary mb-6">2. REVIEW INQUIRY</h2>
                  <div className="bg-muted/50 border border-border rounded-lg p-6 mb-8">
                    <h3 className="text-sm font-medium text-muted-foreground mb-4">DELIVERY DETAILS:</h3>
                    <p className="text-foreground">{contactInfo.name}</p>
                    <p className="text-foreground">{contactInfo.address}, {contactInfo.city}</p>
                    <p className="text-muted-foreground mt-2">{contactInfo.email}</p>
                    <p className="text-muted-foreground">{contactInfo.phone}</p>
                    <button type="button" onClick={() => setStep(1)} className="text-primary text-sm mt-4 font-medium hover:underline">EDIT DETAILS</button>
                  </div>

                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full bg-primary text-primary-foreground font-bold py-4 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
                  >
                    {isSubmitting ? "SENDING INQUIRY..." : "SUBMIT INQUIRY"}
                  </button>
                </motion.div>
              )}
            </form>
          </div>

          <div className="md:col-span-5">
            <div className="bg-muted/30 border border-border rounded-xl p-6 sticky top-24">
              <h3 className="font-semibold text-muted-foreground mb-6 pb-4 border-b border-border">INQUIRY SUMMARY</h3>
              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={`${item.id}-${item.variant}`} className="flex justify-between text-sm">
                    <span className="text-foreground">
                      {item.quantity}x {item.name}
                    </span>
                    <span className="font-medium text-muted-foreground">₹{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-border pt-6 flex justify-between items-center text-xl">
                <span className="font-semibold text-foreground">TOTAL ESTIMATE</span>
                <span className="font-bold text-primary">₹{getSubtotal().toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
