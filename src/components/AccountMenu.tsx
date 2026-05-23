"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserSupabase } from "@/lib/supabase/browser";

export function AccountMenu({ email }: { email?: string | null }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  async function signOut() {
    const supabase = createBrowserSupabase();
    await supabase?.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <div className="relative">
      <button
        type="button"
        title={email || "Account"}
        aria-label="Account menu"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((current) => !current)}
        className="flex h-10 w-10 items-center justify-center rounded-full border border-stone-200 bg-white text-stone-900 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-sky-200 hover:shadow-[0_12px_28px_rgba(14,165,233,0.12)]"
      >
        <svg viewBox="0 0 24 24" className="h-7 w-7" aria-hidden="true">
          <path
            fill="currentColor"
            d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm0 4.7a3.2 3.2 0 1 1 0 6.4 3.2 3.2 0 0 1 0-6.4Zm0 13.1a7.7 7.7 0 0 1-5.9-2.8c1.2-2 3.4-3.2 5.9-3.2s4.7 1.2 5.9 3.2a7.7 7.7 0 0 1-5.9 2.8Z"
          />
        </svg>
      </button>

      {isOpen ? (
        <div className="absolute right-0 z-[200] mt-3 w-56 rounded-2xl border border-stone-200 bg-white p-2 shadow-[0_24px_60px_rgba(15,23,42,0.14)]">
          {email ? (
            <div className="border-b border-stone-100 px-3 py-2.5">
              <p className="text-xs font-bold uppercase text-stone-400">Signed in as</p>
              <p className="mt-1 truncate text-sm font-bold text-stone-700">{email}</p>
            </div>
          ) : null}
          <button
            type="button"
            onClick={signOut}
            className="mt-2 w-full rounded-xl px-3 py-3 text-left text-sm font-bold text-stone-700 transition hover:bg-stone-100 hover:text-stone-950"
          >
            Sign out
          </button>
        </div>
      ) : null}
    </div>
  );
}
