import Link from "next/link";

export function EmptyState({
  title,
  body,
  href,
  action,
}: {
  title: string;
  body: string;
  href?: string;
  action?: string;
}) {
  return (
    <div className="border border-dashed border-stone-300 bg-white p-8 text-center">
      <h2 className="text-xl font-semibold text-stone-950">{title}</h2>
      <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-stone-600">{body}</p>
      {href && action ? (
        <Link
          href={href}
          className="mt-5 inline-flex rounded-md bg-stone-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-stone-800"
        >
          {action}
        </Link>
      ) : null}
    </div>
  );
}
