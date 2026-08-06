"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Hexagon, LockKeyhole, Mail, ShieldCheck } from "lucide-react";

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
        router.push("/");
        router.refresh();
      } else {
        setError(data.message || data.error || "We couldn't sign you in. Please check your details.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-mesh px-4 py-8 text-foreground sm:px-6 sm:py-12">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl items-center justify-center">
        <div className="grid w-full overflow-hidden rounded-3xl border border-border bg-card shadow-float lg:grid-cols-[0.9fr_1.1fr]">
          <div className="relative hidden overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-700 p-12 text-white lg:flex lg:flex-col lg:justify-between">
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
            <div className="absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-cyan-300/20 blur-3xl" />
            <Link href="/" className="relative flex items-center gap-2 text-lg font-bold tracking-tight">
              <Hexagon className="h-7 w-7" /> NEXUS CORE
            </Link>
            <div className="relative">
              <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-blue-100">Welcome back</p>
              <h1 className="max-w-sm text-4xl font-bold leading-tight">Your next upgrade starts here.</h1>
              <p className="mt-5 max-w-sm text-blue-100">Sign in to manage your account, revisit orders, and keep your tech setup moving.</p>
            </div>
            <div className="relative flex items-center gap-3 text-sm text-blue-100"><ShieldCheck className="h-5 w-5" /> Secure account access</div>
          </div>

          <div className="p-7 sm:p-12 lg:p-16">
            <div className="mb-10 lg:hidden">
              <Link href="/" className="flex items-center gap-2 text-lg font-bold tracking-tight text-primary"><Hexagon className="h-7 w-7" /> NEXUS CORE</Link>
            </div>
            <div className="mb-8">
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-primary">Account login</p>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Welcome back</h2>
              <p className="mt-3 text-muted-foreground">Sign in to continue shopping with NEXUS CORE.</p>
            </div>

            {error && <div role="alert" className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-5">
              <label className="block text-sm font-medium">Email address
                <span className="relative mt-2 block"><Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" /><input type="email" required autoComplete="email" placeholder="you@example.com" className="w-full rounded-xl border border-border bg-surface py-3.5 pl-12 pr-4 outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10" value={email} onChange={(e) => setEmail(e.target.value)} /></span>
              </label>
              <label className="block text-sm font-medium">Password
                <span className="relative mt-2 block"><LockKeyhole className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" /><input type="password" required autoComplete="current-password" placeholder="Enter your password" className="w-full rounded-xl border border-border bg-surface py-3.5 pl-12 pr-4 outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10" value={password} onChange={(e) => setPassword(e.target.value)} /></span>
              </label>
              <button type="submit" disabled={loading} className="group mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-4 font-semibold text-primary-foreground shadow-glow-blue transition hover:bg-accent disabled:cursor-not-allowed disabled:opacity-60">{loading ? "Signing you in..." : "Sign in"}<ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" /></button>
            </form>

            <p className="mt-8 text-center text-sm text-muted-foreground">New to NEXUS CORE? <Link href="/register" className="font-semibold text-primary hover:underline">Create an account</Link></p>
          </div>
        </div>
      </div>
    </main>
  );
}
