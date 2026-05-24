import Link from "next/link";

function CrucibleMark() {
  return (
    <span className="relative flex h-8 w-8 shrink-0 items-center justify-center text-black" aria-hidden="true">
      <svg
        className="h-7 w-7"
        viewBox="0 0 32 32"
        fill="none"
        stroke="currentColor"
        strokeLinecap="square"
        strokeLinejoin="miter"
        strokeWidth="2.4"
      >
        <path d="M4 18L16 6L28 18" />
        <path d="M8 22L16 14L24 22" />
        <path d="M12 26L16 22L20 26" />
      </svg>
    </span>
  );
}

export function CrucibleBrand({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/"
      className={`inline-flex items-center gap-2 text-sm font-black tracking-tight text-black ${className}`}
    >
      <CrucibleMark />
      <span>Crucible</span>
    </Link>
  );
}
