export default function LawyerProfileLoading() {
  return (
    <div className="bg-cream min-h-screen animate-pulse">
      {/* Hero skeleton */}
      <div className="bg-navy px-6 pt-6 pb-0">
        <div className="max-w-[1200px] mx-auto">
          <div className="w-28 h-4 bg-white/20 rounded mb-6" />
          <div className="flex gap-7 items-end pb-5">
            <div className="size-20 rounded-full bg-white/20 shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="w-56 h-7 bg-white/20 rounded" />
              <div className="w-32 h-3 bg-white/10 rounded" />
              <div className="w-48 h-4 bg-white/10 rounded" />
            </div>
            <div className="w-36 h-10 bg-white/20 rounded-xl" />
          </div>
          <div className="h-10 border-t border-white/10" />
        </div>
      </div>

      {/* Body skeleton */}
      <div className="max-w-[1200px] mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8">
        <div className="flex flex-col gap-5">
          <div className="bg-white rounded-2xl p-6 space-y-3 shadow-sm">
            <div className="w-24 h-5 bg-gray-200 rounded" />
            <div className="w-full h-4 bg-gray-100 rounded" />
            <div className="w-5/6 h-4 bg-gray-100 rounded" />
            <div className="w-4/6 h-4 bg-gray-100 rounded" />
          </div>
          <div className="bg-white rounded-2xl p-6 space-y-3 shadow-sm">
            <div className="w-32 h-5 bg-gray-200 rounded" />
            {[1, 2, 3].map((i) => (
              <div key={i} className="w-full h-4 bg-gray-100 rounded" />
            ))}
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 h-64 shadow-sm" />
      </div>
    </div>
  );
}
