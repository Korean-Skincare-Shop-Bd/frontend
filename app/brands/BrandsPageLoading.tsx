export function BrandsLoading() {
  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 container">
        {/* Header Loading */}
        <div className="mb-6 sm:mb-8">
          <div className="bg-gray-200 dark:bg-gray-700 rounded w-48 h-8 sm:h-10 animate-pulse"></div>
          <div className="bg-gray-200 dark:bg-gray-700 rounded w-80 h-4 sm:h-5 mt-2 animate-pulse"></div>
        </div>

        {/* Search Loading */}
        <div className="space-y-4 mb-6 sm:mb-8">
          <div className="bg-gray-200 dark:bg-gray-700 rounded h-10 sm:h-11 animate-pulse"></div>
          <div className="flex justify-between">
            <div className="bg-gray-200 dark:bg-gray-700 rounded w-32 h-8 animate-pulse"></div>
            <div className="bg-gray-200 dark:bg-gray-700 rounded w-24 h-8 animate-pulse"></div>
          </div>
        </div>

        {/* Grid Loading */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6 animate-pulse">
              <div className="bg-gray-200 dark:bg-gray-700 rounded-lg w-full h-24 mb-4"></div>
              <div className="bg-gray-200 dark:bg-gray-700 rounded w-3/4 h-5 mb-2"></div>
              <div className="bg-gray-200 dark:bg-gray-700 rounded w-full h-4 mb-3"></div>
              <div className="bg-gray-200 dark:bg-gray-700 rounded w-1/2 h-4 mb-4"></div>
              <div className="bg-gray-200 dark:bg-gray-700 rounded w-full h-10"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
