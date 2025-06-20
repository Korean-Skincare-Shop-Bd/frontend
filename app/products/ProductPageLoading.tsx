export function ProductsLoading() {
  return (
    <div className="gap-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg animate-pulse">
          <div className="bg-gray-200 dark:bg-gray-700 mb-4 rounded h-64"></div>
          <div className="bg-gray-200 dark:bg-gray-700 mb-2 rounded w-3/4 h-4"></div>
          <div className="bg-gray-200 dark:bg-gray-700 mb-2 rounded w-1/2 h-4"></div>
        </div>
      ))}
    </div>
  );
}