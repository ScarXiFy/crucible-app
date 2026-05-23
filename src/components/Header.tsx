import Link from "next/link";
import { AccountMenu } from "@/components/AccountMenu";

export function Header({ email }: { email?: string | null }) {
  return (
    <header className="relative z-[100] border-b border-stone-200 bg-white/70 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-4">
        <Link href="/dashboard" className="flex items-center gap-3 text-xl font-bold tracking-tight">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500 text-base font-black text-white shadow-[4px_4px_0_#fbbf24]">
            C
          </span>
          Crucible
        </Link>
        <nav className="flex items-center gap-3">
          {email ? <AccountMenu email={email} /> : null}
        </nav>
      </div>
    </header>
  );
}
