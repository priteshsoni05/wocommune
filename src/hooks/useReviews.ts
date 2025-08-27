import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface Review {
  id: string;
  booking_id: string;
  helper_id: string;
  seeker_id: string;
  rating: number;
  comment: string | null;
  service_title: string;
  reviewer_name: string;
  reviewer_avatar: string | null;
  created_at: string;
  updated_at: string;
}

export interface ReviewsStats {
  totalReviews: number;
  averageRating: number;
  ratingDistribution: { rating: number; count: number; percentage: number }[];
  monthlyGrowth: number;
}

export const useReviews = () => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchReviews();
    }
  }, [user]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: reviewsError } = await supabase
        .from("reviews")
        .select("*")
        .eq("helper_id", user?.id)
        .order("created_at", { ascending: false });

      if (reviewsError) {
        throw reviewsError;
      }

      setReviews(data || []);
    } catch (err) {
      console.error("Error fetching reviews:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch reviews");
    } finally {
      setLoading(false);
    }
  };

  const getReviewsStats = (): ReviewsStats => {
    const totalReviews = reviews.length;
    const averageRating = totalReviews > 0 
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews 
      : 0;

    const ratingDistribution = [5, 4, 3, 2, 1].map(rating => ({
      rating,
      count: reviews.filter(review => review.rating === rating).length,
      percentage: totalReviews > 0 
        ? (reviews.filter(review => review.rating === rating).length / totalReviews) * 100 
        : 0
    }));

    // Calculate monthly growth (reviews from this month vs last month)
    const now = new Date();
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    const thisMonthReviews = reviews.filter(review => 
      new Date(review.created_at) >= thisMonth
    ).length;

    const lastMonthReviews = reviews.filter(review => {
      const reviewDate = new Date(review.created_at);
      return reviewDate >= lastMonth && reviewDate < thisMonth;
    }).length;

    const monthlyGrowth = lastMonthReviews > 0 
      ? ((thisMonthReviews - lastMonthReviews) / lastMonthReviews) * 100 
      : thisMonthReviews > 0 ? 100 : 0;

    return {
      totalReviews,
      averageRating,
      ratingDistribution,
      monthlyGrowth
    };
  };

  const createReview = async (reviewData: {
    booking_id: string;
    helper_id: string;
    rating: number;
    comment?: string;
    service_title: string;
    reviewer_name: string;
    reviewer_avatar?: string;
  }) => {
    try {
      const { data, error: createError } = await supabase
        .from("reviews")
        .insert([{
          ...reviewData,
          seeker_id: user?.id
        }])
        .select()
        .single();

      if (createError) {
        throw createError;
      }

      // Refresh reviews list
      await fetchReviews();
      return { data, error: null };
    } catch (err) {
      console.error("Error creating review:", err);
      return { 
        data: null, 
        error: err instanceof Error ? err.message : "Failed to create review" 
      };
    }
  };

  return {
    reviews,
    loading,
    error,
    stats: getReviewsStats(),
    createReview,
    refetch: fetchReviews
  };
};