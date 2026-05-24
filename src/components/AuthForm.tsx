"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  buildAuthModeHref,
  buildAuthCallbackUrl,
  getAuthModeCopy,
  type AuthMode,
} from "@/components/AuthForm.helpers";
import { createBrowserSupabase } from "@/lib/supabase/browser";

type OAuthProvider = "google" | "github";

const oauthOptions: {
  label: string;
  provider: OAuthProvider;
  helper: string;
  icon: React.ReactNode;
}[] = [
  {
    label: "Gmail",
    provider: "google",
    helper: "Continue with your Google account",
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true">
        <path fill="#4285F4" d="M21.6 12.2c0-.7-.1-1.3-.2-1.9H12v3.7h5.4a4.6 4.6 0 0 1-2 3v2.5h3.2c1.9-1.8 3-4.3 3-7.3Z" />
        <path fill="#34A853" d="M12 22c2.7 0 5-.9 6.6-2.5L15.4 17c-.9.6-2 .9-3.4.9-2.6 0-4.8-1.8-5.6-4.1H3.1v2.6A10 10 0 0 0 12 22Z" />
        <path fill="#FBBC05" d="M6.4 13.8a6 6 0 0 1 0-3.6V7.6H3.1a10 10 0 0 0 0 8.8l3.3-2.6Z" />
        <path fill="#EA4335" d="M12 6.1c1.5 0 2.8.5 3.8 1.5l2.9-2.9A9.7 9.7 0 0 0 12 2a10 10 0 0 0-8.9 5.6l3.3 2.6c.8-2.3 3-4.1 5.6-4.1Z" />
      </svg>
    ),
  },
  {
    label: "GitHub",
    provider: "github",
    helper: "Continue with your developer profile",
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true">
        <path
          fill="currentColor"
          d="M12 2a10 10 0 0 0-3.2 19.5c.5.1.7-.2.7-.5v-1.9c-2.9.6-3.5-1.2-3.5-1.2-.5-1.2-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 0 1.6 1 1.6 1 .9 1.6 2.4 1.1 2.9.9.1-.7.4-1.1.7-1.4-2.3-.3-4.7-1.1-4.7-5A3.9 3.9 0 0 1 6.6 7.6c-.1-.3-.5-1.3.1-2.7 0 0 .9-.3 2.8 1a9.8 9.8 0 0 1 5.1 0c1.9-1.3 2.8-1 2.8-1 .6 1.4.2 2.4.1 2.7a3.9 3.9 0 0 1 1.1 2.7c0 3.9-2.4 4.8-4.7 5 .4.3.7.9.7 1.8V21c0 .3.2.6.7.5A10 10 0 0 0 12 2Z"
        />
      </svg>
    ),
  },
];

type AuthFormProps = {
  authError: string | null;
  initialMode: AuthMode;
  redirectTo: string;
};

export function AuthForm({ authError, initialMode, redirectTo }: AuthFormProps) {
  const router = useRouter();
  const mode = initialMode;
  const modeCopy = getAuthModeCopy(mode);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(authError);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function ensureProfile(userId: string, email: string) {
    const supabase = createBrowserSupabase();

    if (!supabase) {
      return;
    }

    const { data: profile } = await supabase
      .from("users")
      .select("id")
      .eq("id", userId)
      .maybeSingle();

    if (!profile) {
      await supabase.from("users").insert({
        id: userId,
        email,
        role: "student",
      });
    }
  }

  async function continueWithOAuth(provider: OAuthProvider) {
    setMessage(null);
    const supabase = createBrowserSupabase();

    if (!supabase) {
      setMessage("Supabase environment variables are missing.");
      return;
    }

    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: buildAuthCallbackUrl(window.location.origin, redirectTo),
      },
    });

    if (error) {
      setMessage(error.message);
    }
  }

  async function submitPasswordAuth(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);

    const email = username.trim();

    if (!email || !password) {
      setMessage("Enter your username and password.");
      return;
    }

    const supabase = createBrowserSupabase();

    if (!supabase) {
      setMessage("Supabase environment variables are missing.");
      return;
    }

    setIsSubmitting(true);

    try {
      if (mode === "login") {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          setMessage(error.message);
          return;
        }

        if (data.user) {
          await ensureProfile(data.user.id, data.user.email ?? email);
        }

        router.replace(redirectTo);
        router.refresh();
        return;
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: buildAuthCallbackUrl(window.location.origin, redirectTo),
        },
      });

      if (error) {
        setMessage(error.message);
        return;
      }

      if (data.session && data.user) {
        await ensureProfile(data.user.id, data.user.email ?? email);
        router.replace(redirectTo);
        router.refresh();
        return;
      }

      setMessage("Check your email to confirm your account, then come back to login.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div
      data-auth-card
      className="relative rounded-[2rem] border border-stone-200 bg-white/90 p-6 shadow-[0_30px_80px_rgba(15,23,42,0.12)] backdrop-blur sm:p-8"
    >
      <div className="absolute -right-4 -top-4 hidden h-20 w-20 rounded-full bg-amber-200/80 blur-2xl sm:block" />
      <div className="absolute -bottom-5 -left-5 hidden h-24 w-24 rounded-full bg-sky-200/80 blur-2xl sm:block" />

      <div className="relative">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-500 text-base font-black text-white shadow-[4px_4px_0_#fbbf24]">
            C
          </span>
          <div>
            <p className="text-2xl font-bold text-stone-950">{modeCopy.title}</p>
            <p className="text-sm font-bold text-stone-500">{modeCopy.helper}</p>
          </div>
        </div>

        <div className="mt-7 grid grid-cols-2 rounded-2xl border border-stone-200 bg-stone-100 p-1">
          {(["login", "register"] as const).map((authMode) => (
            <Link
              key={authMode}
              href={buildAuthModeHref(authMode, redirectTo)}
              className={`rounded-xl px-4 py-2.5 text-sm font-bold transition ${
                mode === authMode
                  ? "bg-white text-stone-950 shadow-sm"
                  : "text-stone-500 hover:text-stone-950"
              }`}
            >
              {authMode === "login" ? "Login" : "Register"}
            </Link>
          ))}
        </div>

        <form onSubmit={submitPasswordAuth} className="mt-5 grid gap-4">
          <label className="grid gap-2 text-sm font-bold text-stone-700">
            Username
            <input
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              type="email"
              autoComplete="username"
              placeholder="name@example.com"
              className="h-12 rounded-2xl border border-stone-200 bg-[#fffdf8] px-4 text-base font-bold text-stone-950 outline-none transition focus:border-sky-300 focus:bg-white focus:ring-4 focus:ring-sky-100"
            />
          </label>

          <label className="grid gap-2 text-sm font-bold text-stone-700">
            Password
            <input
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              type="password"
              autoComplete={mode === "login" ? "current-password" : "new-password"}
              placeholder="Enter your password"
              className="h-12 rounded-2xl border border-stone-200 bg-[#fffdf8] px-4 text-base font-bold text-stone-950 outline-none transition focus:border-sky-300 focus:bg-white focus:ring-4 focus:ring-sky-100"
            />
          </label>

          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-2xl bg-stone-950 px-4 py-3 text-sm font-bold text-white shadow-[6px_6px_0_#fbbf24] transition duration-200 hover:-translate-y-1 hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
          >
            {isSubmitting ? modeCopy.pendingLabel : modeCopy.submitLabel}
          </button>
        </form>

        <div className="my-6 flex items-center gap-3">
          <span className="h-px flex-1 bg-stone-200" />
          <span className="text-xs font-black uppercase text-stone-400">or</span>
          <span className="h-px flex-1 bg-stone-200" />
        </div>

        <div className="grid gap-3">
          {oauthOptions.map((option) => (
            <button
              key={option.provider}
              type="button"
              onClick={() => continueWithOAuth(option.provider)}
              className="group flex items-center justify-between rounded-2xl border border-stone-200 bg-[#fffdf8] px-4 py-3 text-left transition duration-200 hover:-translate-y-1 hover:border-sky-200 hover:bg-white hover:shadow-[0_18px_45px_rgba(14,165,233,0.12)]"
            >
              <span className="flex items-center gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-stone-950 shadow-sm ring-1 ring-stone-200 transition group-hover:scale-105">
                  {option.icon}
                </span>
                <span>
                  <span className="block text-base font-bold text-stone-950">{option.label}</span>
                  <span className="block text-sm font-bold text-stone-500">{option.helper}</span>
                </span>
              </span>
              <span className="text-xl font-bold text-stone-300 transition group-hover:translate-x-1 group-hover:text-sky-500">
                -&gt;
              </span>
            </button>
          ))}
        </div>

        {message ? (
          <p className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-bold leading-6 text-amber-900">
            {message}
          </p>
        ) : null}
      </div>
    </div>
  );
}
