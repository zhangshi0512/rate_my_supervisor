import { useState, useEffect } from "react";
import { Star, Flag, ThumbsUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Link, useParams } from "react-router-dom";
import { getSupervisor, getSupervisorReviews, type Supervisor, type SupervisorReview } from "@/lib/api";
import { toast } from "sonner";

export default function SupervisorDetail() {
  const { id } = useParams();
  const [supervisor, setSupervisor] = useState<Supervisor | null>(null);
  const [reviews, setReviews] = useState<SupervisorReview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSupervisor = async () => {
      if (!id) return;

      try {
        const data = await getSupervisor(id);
        setSupervisor(data);
      } catch (error) {
        toast.error("Failed to load supervisor details");
        console.error("Error fetching supervisor:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchReviews = async () => {
      if (!id) return;

      try {
        const reviews = await getSupervisorReviews(id);
        setReviews(reviews);
      } catch (error) {
        toast.error("Failed to load supervisor reviews");
        console.error("Error fetching supervisor:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSupervisor();
    fetchReviews();
  }, [id]);

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
            {reviews.map((review) => (
              <div key={review.id}>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="font-medium mb-1">
                      {review.is_anonymous ? "Anonymous" : review.author}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Supervised for {review.supervision_period}
                    </div>
                  </div>
                  <div className="text-yellow-500">★ {review.rating}</div>
                </div>
                <p className="text-muted-foreground mb-4">
                  {review.content}
                </p>
                <div className="flex items-center gap-4">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-primary hover:text-primary hover:bg-primary/5"
                  >
                    <ThumbsUp className="h-4 w-4 mr-2" />
                    Helpful
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-primary hover:text-primary hover:bg-primary/5"
                  >
                    <Flag className="h-4 w-4 mr-2" />
                    Report
                  </Button>
                </div>
                <Separator className="my-6" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
