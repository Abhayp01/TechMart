"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Hexagon } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (data.success || res.ok) {
        // Successfully logged in, redirect to home or dashboard
        router.push("/");
        router.refresh();
      } else {
        setError(data.message || data.error || "Login failed");
      }
    } catch (err: any) {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0F] flex flex-col justify-center items-center p-6 text-[#F5F0EB]">
      <Link href="/" className="flex items-center gap-3 mb-12 group">
        <Hexagon className="h-8 w-8 text-[#F5F0EB] group-hover:text-[#6C63FF] transition-colors" />
        <span className="font-heading font-bold text-3xl tracking-[0.15em] text-[#F5F0EB]">
          NEXUS CORE
        </span>
      </Link>

      <div className="w-full max-w-md bg-[#111] border border-[#222] p-10">
        <h1 className="text-2xl font-heading font-semibold mb-2">SYSTEM ACCESS</h1>
        <p className="text-[#888] font-mono text-sm mb-8 tracking-wide">AUTHENTICATE TO CONTINUE</p>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 mb-6 text-sm font-mono">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-mono text-[#888] mb-2 tracking-widest">IDENTIFIER (EMAIL)</label>
            <input
              type="email"
              required
              className="w-full bg-[#0A0A0F] border border-[#333] p-4 text-[#F5F0EB] focus:border-[#6C63FF] outline-none rounded-none font-mono transition-colors"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-mono text-[#888] mb-2 tracking-widest">PASSPHRASE</label>
            <input
              type="password"
              required
              className="w-full bg-[#0A0A0F] border border-[#333] p-4 text-[#F5F0EB] focus:border-[#6C63FF] outline-none rounded-none font-mono transition-colors"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#F5F0EB] text-[#0A0A0F] font-bold py-4 hover:bg-[#6C63FF] hover:text-[#F5F0EB] transition-all tracking-[0.2em] text-sm disabled:opacity-50 mt-4"
          >
            {loading ? "AUTHENTICATING..." : "INITIATE SESSION"}
          </button>
        </form>

        <div className="mt-8 text-center border-t border-[#222] pt-6">
          <p className="text-[#888] font-mono text-xs">
            NO CLEARANCE?{" "}
            <Link href="/signup" className="text-[#6C63FF] hover:text-[#F5F0EB] transition-colors ml-2">
              REQUEST ACCESS [→]
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
