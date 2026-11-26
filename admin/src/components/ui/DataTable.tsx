import type { ReactNode } from "react";

/** Table wrapper with loading, error and empty states shared by the posts and jobs lists. */
export function DataTable({
  columns,
  loading,
  error,
  empty,
  children,
  footer,
}: {
  columns: string[];
  loading: boolean;
  error?: string;
  empty: ReactNode | null;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-neutral-200 text-sm">
          <thead className="bg-neutral-50">
            <tr>
              {columns.map((column, index) => (
                <th
                  key={column}
                  scope="col"
                  className={`whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500 ${
                    index === columns.length - 1 ? "text-right" : ""
                  }`}
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {loading
              ? [0, 1, 2, 3].map((row) => (
                  <tr key={row}>
                    <td colSpan={columns.length} className="px-4 py-3">
                      <div className="h-6 animate-pulse rounded bg-neutral-100" />
                    </td>
                  </tr>
                ))
              : children}
          </tbody>
        </table>
      </div>
      {!loading && error && <p className="px-4 py-10 text-center text-sm text-red-600">{error}</p>}
      {!loading && !error && empty && <div className="px-4 py-12 text-center text-sm text-neutral-500">{empty}</div>}
      {footer}
    </div>
  );
}
