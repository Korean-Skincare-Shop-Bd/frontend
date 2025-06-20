export const OrdersLoading = () => (
  <div className="mx-auto px-4 py-8 container">
    <div className="space-y-4 animate-pulse">
      <div className="bg-gray-200 rounded w-1/4 h-8"></div>
      <div className="bg-gray-200 rounded h-10"></div>
      <div className="space-y-2">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bg-gray-200 rounded h-16"></div>
        ))}
      </div>
    </div>
  </div>
);