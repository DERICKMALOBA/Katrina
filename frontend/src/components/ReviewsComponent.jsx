import { useEffect, useState } from 'react';
import { FaStar, FaStarHalfAlt } from "react-icons/fa";

const ReviewsComponent = ({ productId }) => {
  const [averageRating, setAverageRating] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch(`/api/products/reviewsget/${productId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch reviews");
        }
        const data = await response.json();
        
        // Calculate average rating
        if (data.length > 0) {
          const sum = data.reduce((acc, review) => acc + review.ratings, 0);
          const avg = sum / data.length;
          setAverageRating(avg);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [productId]);

  if (loading) return <div className="flex">Loading ratings...</div>;
  if (error) return <div className="flex">Error: {error}</div>;

  return (
    <div className="flex items-center">
      {[...Array(5)].map((_, index) => (
        <span key={index}>
          {averageRating > 0 ? (
            averageRating >= index + 1 ? (
              <FaStar className="text-yellow-500" />
            ) : averageRating > index && averageRating < index + 1 ? (
              <FaStarHalfAlt className="text-yellow-500" />
            ) : (
              <FaStar className="text-gray-300" />
            )
          ) : (
            <FaStar className="text-gray-300" />
          )}
        </span>
      ))}
    </div>
  );
};

export default ReviewsComponent;