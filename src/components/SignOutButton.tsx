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
      className="rounded-md border border-stone-300 px-3 py-2 text-sm font-semibold text-stone-700 transition hover:border-stone-950 hover:text-stone-950"
    >
      Sign out
    </button>
  );
}
