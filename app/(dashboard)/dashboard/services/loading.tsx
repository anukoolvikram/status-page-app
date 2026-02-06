export default function ServicesLoading() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <div className="h-9 w-32 animate-pulse rounded bg-gray-200" />
          <div className="mt-2 h-5 w-56 animate-pulse rounded bg-gray-100" />
        </div>
        <div className="h-10 w-28 animate-pulse rounded bg-gray-200" />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="rounded-xl border py-6 shadow-sm animate-pulse"
          >
            <div className="px-6">
              <div className="h-5 w-48 animate-pulse rounded bg-gray-200" />
              <div className="mt-2 h-4 w-32 animate-pulse rounded bg-gray-100" />
            </div>
            <div className="mt-4 px-6">
              <div className="h-6 w-20 animate-pulse rounded bg-gray-200" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
