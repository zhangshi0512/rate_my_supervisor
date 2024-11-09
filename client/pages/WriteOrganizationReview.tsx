import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { createOrganizationReview } from "@/lib/api";

export default function WriteOrganizationReview() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [employmentPeriod, setEmploymentPeriod] = useState("");
  const [review, setReview] = useState("");
  const [role, setRole] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!id) {
      toast.error("Invalid organization ID");
      return;
    }

    if (rating === 0) {
      toast.error("Please provide a rating");
      return;
    }

    if (!review.trim()) {
      toast.error("Please write a review");
      return;
    }

    if (!employmentPeriod.trim()) {
      toast.error("Please specify your employment period");
      return;
    }

    if (!role) {
      toast.error("Please specify your role");
      return;
    }

    try {
      setSubmitting(true);

      await createOrganizationReview(id, {
        rating,
        content: review,
        employment_period: employmentPeriod,
        role,
        is_anonymous: isAnonymous,
        author: isAnonymous ? "Anonymous" : "User", // In a real app, this would come from auth
      });

      toast.success("Review submitted successfully!");
      navigate(`/organizations/${id}`);
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("Failed to submit review. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <Card>
        <CardContent className="p-8">
          <h1 className="text-3xl font-bold mb-6">Write Organization Review</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Rating */}
            <div className="space-y-2">
              <Label>Overall Rating</Label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className="text-2xl focus:outline-none"
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    onClick={() => setRating(star)}
                  >
                    <Star
                      className={`h-8 w-8 ${
                        star <= (hoveredRating || rating)
                          ? "fill-yellow-500 text-yellow-500"
                          : "text-muted-foreground"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Role */}
            <div className="space-y-2">
              <Label htmlFor="role">Your Role</Label>
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="intern">Intern</SelectItem>
                  <SelectItem value="associate">Associate</SelectItem>
                  <SelectItem value="supervisor">Supervisor</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Employment Period */}
            <div className="space-y-2">
              <Label htmlFor="period">Employment Period</Label>
              <Input
                id="period"
                placeholder="e.g., 6 months, 1 year"
                value={employmentPeriod}
                onChange={(e) => setEmploymentPeriod(e.target.value)}
              />
            </div>

            {/* Review Content */}
            <div className="space-y-2">
              <Label htmlFor="review">Your Review</Label>
              <Textarea
                id="review"
                placeholder="Share your experience with this organization..."
                className="min-h-[200px]"
                value={review}
                onChange={(e) => setReview(e.target.value)}
              />
            </div>

            {/* Anonymous Option */}
            <div className="flex items-center justify-between">
              <Label htmlFor="anonymous" className="cursor-pointer">
                Post Anonymously
              </Label>
              <Switch
                id="anonymous"
                checked={isAnonymous}
                onCheckedChange={setIsAnonymous}
              />
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(`/organizations/${id}`)}
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? "Submitting..." : "Submit Review"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
