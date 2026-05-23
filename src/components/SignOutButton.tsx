"use client";

import { useRouter } from "next/navigation";
import { createBrowserSupabase } from "@/lib/supabase/browser";

export function SignOutButton() {
  const router = useRouter();

  async function signOut() {
    const supabase = createBrowserSupabase();
    await supabase?.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={signOut}
      className="rounded-xl border border-stone-200 bg-white/80 px-4 py-2.5 text-sm font-bold text-stone-700 transition duration-200 hover:-translate-y-1 hover:border-stone-950 hover:bg-white hover:text-stone-950"
    >
      Sign out
    </button>
  );
}
