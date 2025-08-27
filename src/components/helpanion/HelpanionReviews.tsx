import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Star, StarIcon, MessageSquare, TrendingUp } from "lucide-react";
import { useReviews } from "@/hooks/useReviews";

export const HelpanionReviews = () => {
  const { reviews, loading, error, stats } = useReviews();

  if (loading) {
    return (
      <div className="p-8 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Reviews</h1>
          <p className="text-lg text-muted-foreground">
            See what people are saying about your sessions
          </p>
        </div>
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading reviews...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Reviews</h1>
          <p className="text-lg text-muted-foreground">
            See what people are saying about your sessions
          </p>
        </div>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <MessageSquare className="h-12 w-12 text-destructive mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">Error loading reviews</h3>
              <p className="text-muted-foreground">{error}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`}
      />
    ));
  };

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Reviews</h1>
        <p className="text-lg text-muted-foreground">
          See what people are saying about your sessions
        </p>
      </div>

      {reviews.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No reviews yet</h3>
              <p className="text-muted-foreground">
                Complete some sessions to start receiving reviews from the community
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Review Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">{stats.averageRating.toFixed(1)}</div>
                  <div className="flex justify-center items-center gap-1 mt-2">
                    {renderStars(Math.round(stats.averageRating))}
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Based on {stats.totalReviews} review{stats.totalReviews !== 1 ? 's' : ''}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">{stats.totalReviews}</div>
                  <p className="text-sm text-muted-foreground mt-2">Total Reviews</p>
                  <div className="flex items-center justify-center gap-1 mt-2 text-success">
                    <TrendingUp className="h-4 w-4" />
                    <span className="text-sm">
                      {stats.monthlyGrowth > 0 ? '+' : ''}{stats.monthlyGrowth.toFixed(0)}% this month
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">
                    {stats.ratingDistribution.find(r => r.rating === 5)?.percentage.toFixed(0) || 0}%
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">5-Star Reviews</p>
                  <div className="flex justify-center items-center gap-1 mt-2">
                    {renderStars(5)}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Rating Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Rating Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {stats.ratingDistribution.map(({ rating, count, percentage }) => (
                  <div key={rating} className="flex items-center gap-3">
                    <div className="flex items-center gap-1 w-20">
                      <span className="text-sm">{rating}</span>
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    </div>
                    <div className="flex-1 bg-muted rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-sm text-muted-foreground w-12 text-right">
                      {count}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Individual Reviews */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Recent Reviews</h2>
            
            <div className="space-y-4">
              {reviews.map((review) => (
                <Card key={review.id}>
                  <CardContent className="pt-6">
                    <div className="flex gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={review.reviewer_avatar} />
                        <AvatarFallback>
                          {review.reviewer_name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1 space-y-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium">{review.reviewer_name}</h3>
                              <Badge variant="secondary" className="text-xs">
                                {review.service_title}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-1 mt-1">
                              {renderStars(review.rating)}
                              <span className="text-sm text-muted-foreground ml-2">
                                {new Date(review.created_at).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric'
                                })}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <p className="text-muted-foreground leading-relaxed">
                          {review.comment}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Featured Testimonial - Show highest rated recent review */}
          {reviews.length > 0 && (() => {
            const featuredReview = reviews
              .filter(r => r.rating === 5)
              .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0]
              || reviews[0];
            
            return (
              <Card className="bg-primary/5 border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                    Featured Testimonial
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <blockquote className="text-lg italic text-muted-foreground mb-4">
                    "{featuredReview.comment || 'Great session!'}"
                  </blockquote>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={featuredReview.reviewer_avatar || ""} />
                      <AvatarFallback className="text-xs">
                        {featuredReview.reviewer_name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-sm">{featuredReview.reviewer_name}</p>
                      <p className="text-xs text-muted-foreground">{featuredReview.service_title}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })()}
        </>
      )}
    </div>
  );
};