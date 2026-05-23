import Link from "next/link";
import { SignOutButton } from "@/components/SignOutButton";
import type { UserRole } from "@/lib/types";

export function Header({ email, role }: { email?: string | null; role?: UserRole | null }) {
  return (
    <header className="border-b border-stone-300 bg-[#f7f7f2]">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-4">
        <Link href="/dashboard" className="text-xl font-semibold tracking-tight">
          Crucible
        </Link>
        <nav className="flex items-center gap-4 text-sm font-medium text-stone-700">
          <Link href="/dashboard" className="transition hover:text-stone-950">
            Dashboard
          </Link>
          {role === "admin" ? (
            <Link href="/admin" className="transition hover:text-stone-950">
              Admin
            </Link>
          ) : null}
          {email ? <span className="hidden text-stone-500 sm:inline">{email}</span> : null}
          {email ? <SignOutButton /> : null}
        </nav>
      </div>
    </header>
  );
}
