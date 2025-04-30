import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const HorizontalFilters = ({ filters, setFilters }) => {
  const navigate = useNavigate();

  const handlePriceFilter = () => {
    updateUrlWithFilters();
  };

  useEffect(() => {
    if (filters.discount || filters.size || filters.sortBy) {
      updateUrlWithFilters();
    }
  }, [filters.discount, filters.size, filters.sortBy]);

  const updateUrlWithFilters = () => {
    const queryParams = new URLSearchParams();
    if (filters.discount) queryParams.append("discount", filters.discount);
    if (filters.size) queryParams.append("size", filters.size);
    if (filters.priceRange?.min != null && filters.priceRange.min !== "")
      queryParams.append("minPrice", filters.priceRange.min);
    if (filters.priceRange?.max != null && filters.priceRange.max !== "")
      queryParams.append("maxPrice", filters.priceRange.max);
    if (filters.sortBy) queryParams.append("sortBy", filters.sortBy);
    navigate(`/filtered-products?${queryParams.toString()}`);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-3 mb-4">
      <div className="flex flex-wrap items-end gap-3">
        {/* Discount Filter */}
        <div className="min-w-[120px]">
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Discount
          </label>
          <select
            className="w-full text-sm border p-1.5 rounded-md focus:ring-1 focus:ring-purple-500"
            value={filters.discount}
            onChange={(e) => setFilters({ ...filters, discount: e.target.value })}
          >
            <option value="">All</option>
            <option value="10">10%+</option>
            <option value="20">20%+</option>
            <option value="30">30%+</option>
            <option value="40">40%+</option>
            <option value="50">50%+</option>
          </select>
        </div>

        {/* Size Filter */}
        <div className="min-w-[120px]">
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Size
          </label>
          <select
            className="w-full text-sm border p-1.5 rounded-md focus:ring-1 focus:ring-purple-500"
            value={filters.size}
            onChange={(e) => setFilters({ ...filters, size: e.target.value })}
          >
            <option value="">All Sizes</option>
            {Array.from({ length: 16 }, (_, i) => i + 1).map((size) => (
              <option key={size} value={size}>
                {size} {size === 1 ? "Yr" : "Yrs"}
              </option>
            ))}
          </select>
        </div>

        {/* Price Range */}
        <div className="min-w-[220px]">
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Price Range
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              placeholder="Min"
              className="w-1/3 text-sm border p-1.5 rounded-md focus:ring-1 focus:ring-purple-500"
              value={filters.priceRange.min}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  priceRange: { ...filters.priceRange, min: e.target.value }
                })
              }
            />
            <span className="text-gray-400">-</span>
            <input
              type="number"
              placeholder="Max"
              className="w-1/3 text-sm border p-1.5 rounded-md focus:ring-1 focus:ring-purple-500"
              value={filters.priceRange.max}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  priceRange: { ...filters.priceRange, max: e.target.value }
                })
              }
            />
            <button
              onClick={handlePriceFilter}
              className="px-3 py-1.5 text-xs bg-purple-800 text-white rounded-md hover:bg-purple-700 transition"
            >
              Apply
            </button>
          </div>
        </div>

        {/* Sort By */}
        <div className="min-w-[120px]">
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Sort By
          </label>
          <select
            className="w-full text-sm border p-1.5 rounded-md focus:ring-1 focus:ring-purple-500"
            value={filters.sortBy}
            onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
          >
            <option value="">Featured</option>
            <option value="newest">Newest</option>
            <option value="low_to_high">Price: Low</option>
            <option value="high_to_low">Price: High</option>
            <option value="rating">Rating</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default HorizontalFilters;
