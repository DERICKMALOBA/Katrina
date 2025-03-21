import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const SearchResults = () => {
  const searchResults = useSelector((state) => state.search.results);
  const loading = useSelector((state) => state.search.loading);
  const error = useSelector((state) => state.search.error);

  // Debugging logs
  console.log('Search Results:', searchResults);
  console.log('Loading:', loading);
  console.log('Error:', error);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Search Results</h1>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}
      {searchResults.length > 0 ? (
        <ul>
          {searchResults.map((product) => (
            <li key={product.id} className="mb-2">
              <Link to={`/product/${product.id}`} className="text-purple-800 hover:underline">
                {product.name} - {product.category}
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p>No results found.</p>
      )}
    </div>
  );
};

export default SearchResults;