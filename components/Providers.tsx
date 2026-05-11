"use client";

import { ThemeProvider } from "next-themes";
import { ReactNode, useEffect } from "react";
import { useAuthStore } from "@/store/authStore";

export function Providers({ children }: { children: ReactNode }) {
  const fetchUser = useAuthStore((state) => state.fetchUser);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      {children}
    </ThemeProvider>
  );
}
