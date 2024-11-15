import { useState, useEffect } from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ReviewCard } from "@/components/ReviewCard";
import { Link, useParams } from "react-router-dom";
import {
  getSupervisor,
  getSupervisorReviews,
  updateSupervisorReview,
  deleteSupervisorReview,
  type Supervisor,
  type SupervisorReview,
} from "@/lib/api";
import { toast } from "sonner";

export default function SupervisorDetail() {
  const { id } = useParams();
  const [supervisor, setSupervisor] = useState<Supervisor | null>(null);
  const [reviews, setReviews] = useState<SupervisorReview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;

      try {
        const [supervisorData, reviewsData] = await Promise.all([
          getSupervisor(id),
          getSupervisorReviews(id),
        ]);

        setSupervisor(supervisorData);
        setReviews(reviewsData);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load supervisor details");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleEditReview = async (
    reviewId: number,
    newRating: number,
    newContent: string
  ) => {
    if (!id) return;

    try {
      console.log("Updating review:", { reviewId, newRating, newContent });

      await updateSupervisorReview(reviewId.toString(), {
        rating: newRating,
        content: newContent,
      });

      // Update the reviews list
      const updatedReviews = reviews.map((review) =>
        review.id === reviewId
          ? { ...review, rating: newRating, content: newContent }
          : review
      );
      setReviews(updatedReviews);

      toast.success("Review updated successfully");
    } catch (error) {
      console.error("Error updating review:", error);
      toast.error("Failed to update review");
    }
  };

  const handleDeleteReview = async (reviewId: number) => {
    if (!id) return;

    try {
      await deleteSupervisorReview(reviewId.toString());

      // Remove the review from the list
      setReviews(reviews.filter((review) => review.id !== reviewId));
      toast.success("Review deleted successfully");
    } catch (error) {
      console.error("Error deleting review:", error);
      toast.error("Failed to delete review");
    }
  };

  const handleHelpful = (reviewId: number) => {
    // Implement helpful functionality
    toast.success("Marked as helpful");
  };

  const handleReport = (reviewId: number) => {
    // Implement report functionality
    toast.success("Review reported");
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading supervisor details...</div>
      </div>
    );
  }

  if (!supervisor) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Supervisor not found</div>
      </div>
    );
  }

  // Ensure rating is a number and has 1 decimal place
  const displayRating =
    typeof supervisor.rating === "number"
      ? supervisor.rating.toFixed(1)
      : "0.0";

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Profile Header */}
      <Card className="mb-8">
        <CardContent className="p-8">
          <div className="flex items-start gap-8">
            <div className="w-32 h-32 bg-muted rounded-full" />
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">{supervisor.name}</h1>
              <div className="text-xl text-muted-foreground mb-3">
                Clinical Supervisor at Organization {supervisor.organization_id}
              </div>
              <div className="flex items-center gap-4 mb-4">
                <span className="text-yellow-500 text-xl">
                  ★ {displayRating}
                </span>
                <span className="text-muted-foreground">
                  ({supervisor.review_count} reviews)
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <Card>
                  <CardContent className="p-4">
                    <div className="font-medium">Experience</div>
                    <div className="text-muted-foreground">
                      {supervisor.experience} years
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="font-medium">Specialties</div>
                    <div className="text-muted-foreground">
                      {supervisor.specialties.join(", ")}
                    </div>
                  </CardContent>
                </Card>
              </div>
              <Link to={`/supervisors/${id}/review`}>
                <Button
                  variant="outline"
                  className="text-primary hover:text-primary hover:bg-primary/5"
                >
                  Write a Review
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bio Section */}
      <Card className="mb-8">
        <CardContent className="p-8">
          <h2 className="text-2xl font-semibold mb-4">About</h2>
          <p className="text-muted-foreground">{supervisor.bio}</p>
        </CardContent>
      </Card>

      {/* Reviews Section */}
      <Card>
        <CardContent className="p-8">
          <h2 className="text-2xl font-semibold mb-6">Reviews</h2>
          <div className="space-y-6">
            {reviews.length > 0 ? (
              reviews.map((review) => (
                <ReviewCard
                  key={review.id}
                  id={review.id!}
                  author={review.is_anonymous ? "Anonymous" : review.author}
                  duration={review.supervision_period}
                  rating={review.rating}
                  content={review.content}
                  helpfulCount={review.helpful_count || 0}
                  isOwner={!review.is_anonymous && review.author === "User"} // In a real app, check against logged-in user
                  onHelpful={() => handleHelpful(review.id!)}
                  onReport={() => handleReport(review.id!)}
                  onEdit={handleEditReview}
                  onDelete={handleDeleteReview}
                />
              ))
            ) : (
              <div className="text-center text-muted-foreground">
                No reviews yet. Be the first to review this supervisor!
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
