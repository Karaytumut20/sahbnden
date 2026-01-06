
import React from 'react';
import { Star, StarHalf } from 'lucide-react';

export default function StarRating({ rating }: { rating: number }) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="flex items-center text-yellow-400">
      {[...Array(fullStars)].map((_, i) => (
        <Star key={`full_${i}`} size={16} fill="currentColor" />
      ))}
      {hasHalfStar && <StarHalf size={16} fill="currentColor" />}
      {[...Array(emptyStars)].map((_, i) => (
        <Star key={`empty_${i}`} size={16} className="text-gray-300" fill="currentColor" />
      ))}
      <span className="ml-1 text-xs font-bold text-gray-600">{rating}</span>
    </div>
  );
}
