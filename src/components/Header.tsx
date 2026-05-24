import type { ReactNode } from "react";
import { AccountMenu } from "@/components/AccountMenu";
import { CrucibleBrand } from "@/components/CrucibleBrand";

export function Header({ actions, email }: { actions?: ReactNode; email?: string | null }) {
  return (
    <header className="relative z-[100] border-b border-stone-200 bg-white/70 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-4">
        <CrucibleBrand />
        <nav className="flex items-center gap-3">
          {actions}
          {email ? <AccountMenu email={email} /> : null}
        </nav>
      </div>
    </header>
  );
}
