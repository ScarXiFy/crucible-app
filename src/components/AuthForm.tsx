"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createBrowserSupabase } from "@/lib/supabase/browser";

export function AuthForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = useMemo(
    () => searchParams.get("redirectTo") || "/dashboard",
    [searchParams],
  );
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);
    setIsSubmitting(true);

    const supabase = createBrowserSupabase();

    if (!supabase) {
      setMessage("Supabase environment variables are missing.");
      setIsSubmitting(false);
      return;
    }

    if (mode === "login") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setMessage(error.message);
      } else {
        router.push(redirectTo);
        router.refresh();
      }
    } else {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) {
        setMessage(error.message);
      } else if (data.user && data.session) {
        await supabase.from("users").upsert({
          id: data.user.id,
          email,
          role: "student",
        });
        router.push(redirectTo);
        router.refresh();
      } else {
        setMessage("Account created. Check your email to confirm your login.");
      }
    }

    setIsSubmitting(false);
  }

  return (
    <div className="border border-stone-300 bg-white p-6 shadow-[6px_6px_0_#1c1917]">
      <div className="grid grid-cols-2 border border-stone-200 p-1">
        {(["login", "register"] as const).map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setMode(item)}
            className={`px-4 py-2 text-sm font-semibold capitalize ${
              mode === item ? "bg-stone-950 text-white" : "text-stone-600"
            }`}
          >
            {item}
          </button>
        ))}
      </div>

      <form className="mt-6 space-y-4" onSubmit={submit}>
        <label className="block">
          <span className="text-sm font-semibold text-stone-700">Email</span>
          <input
            required
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="mt-2 w-full border border-stone-300 px-3 py-3 outline-none transition focus:border-stone-950"
          />
        </label>
        <label className="block">
          <span className="text-sm font-semibold text-stone-700">Password</span>
          <input
            required
            minLength={6}
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="mt-2 w-full border border-stone-300 px-3 py-3 outline-none transition focus:border-stone-950"
          />
        </label>
        {message ? (
          <p className="border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-900">
            {message}
          </p>
        ) : null}
        <button
          disabled={isSubmitting}
          className="w-full rounded-md bg-amber-500 px-4 py-3 font-semibold text-stone-950 transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Working..." : mode === "login" ? "Log in" : "Create account"}
        </button>
      </form>
    </div>
  );
}
