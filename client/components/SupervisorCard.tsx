import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";

interface SupervisorCardProps {
  id: number;
  name: string;
  organization_id: number;
  specialties: string[];
  experience: number;
  bio?: string;
  rating: number;
  review_count: number;
  compact?: boolean;
}

export function SupervisorCard({
  id,
  name,
  organization_id,
  specialties,
  experience,
  rating,
  review_count,
  bio,
  compact = false,
}: SupervisorCardProps) {
  // Ensure rating is a number and has 1 decimal place
  const displayRating = typeof rating === "number" ? rating.toFixed(1) : "0.0";

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start gap-6">
          <div
            className={`${
              compact ? "w-12 h-12" : "w-16 h-16"
            } bg-muted rounded-full`}
          />
          <div className="flex-1">
            <h3 className="text-xl font-semibold mb-2">{name}</h3>
            <div className="text-muted-foreground mb-2">
              Organization {organization_id}
            </div>
            {!compact && (
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                <span>{specialties.join(", ")}</span>
                <span>•</span>
                <span>{experience} years experience</span>
                <span>•</span>
                <span className="text-yellow-500">
                  ★ {displayRating} ({review_count} reviews)
                </span>
              </div>
            )}
            {bio && !compact && (
              <p className="text-muted-foreground mb-3">{bio}</p>
            )}
            <div className="flex items-center justify-between mt-4">
              <div className="text-yellow-500">
                ★ {displayRating}
                {!compact && ` (${review_count} reviews)`}
              </div>
              <Link to={`/supervisors/${id}`}>
                <Button
                  variant="outline"
                  className="text-primary hover:text-primary hover:bg-primary/5"
                >
                  View Details {compact && "→"}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
