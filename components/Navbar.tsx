"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { signIn, signOut, useSession } from "next-auth/react";

export function Navbar() {
  const { data: session, status } = useSession();

  return (
    <header className="h-16 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50 flex items-center px-6 justify-between">
      <Link href="/" className="text-xl font-bold text-white tracking-tight">
        Kladriva <span className="text-indigo-500">Academy</span>
      </Link>
      
      <div className="flex items-center gap-4">
        {status === "loading" ? (
          <div className="h-9 w-20 bg-slate-800 animate-pulse rounded-md"></div>
        ) : session ? (
          <>
            <Link href="/dashboard">
              <Button variant="ghost" className="text-slate-300 hover:text-white">Dashboard</Button>
            </Link>
            <div className="flex items-center gap-3 ml-4">
              <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-sm">
                {session.user?.name?.[0] || session.user?.email?.[0] || "U"}
              </div>
              <Button onClick={() => signOut()} variant="outline" className="border-slate-700 text-slate-300 hover:text-white">
                Sign Out
              </Button>
            </div>
          </>
        ) : (
          <Button onClick={() => signIn()} className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold">
            Sign In
          </Button>
        )}
      </div>
    </header>
  );
}
