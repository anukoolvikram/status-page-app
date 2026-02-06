export default function IncidentsLoading() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <div className="h-9 w-28 animate-pulse rounded bg-gray-200" />
          <div className="mt-2 h-5 w-64 animate-pulse rounded bg-gray-100" />
        </div>
        <div className="h-10 w-36 animate-pulse rounded bg-gray-200" />
      </div>

      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="rounded-xl border py-4 shadow-sm animate-pulse"
          >
            <div className="flex items-center justify-between px-6">
              <div className="h-5 w-48 animate-pulse rounded bg-gray-200" />
              <div className="h-6 w-20 animate-pulse rounded bg-gray-200" />
            </div>
            <div className="mt-3 px-6">
              <div className="h-4 w-full animate-pulse rounded bg-gray-100" />
              <div className="mt-2 h-4 w-48 animate-pulse rounded bg-gray-100" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
