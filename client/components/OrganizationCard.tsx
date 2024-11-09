import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";

interface OrganizationCardProps {
  id: number;
  name: string;
  type: string;
  supervisor_count: number;
  rating: number;
}

export function OrganizationCard({
  id,
  name,
  type,
  supervisor_count,
  rating,
}: OrganizationCardProps) {
  // Ensure rating is a number and has 1 decimal place
  const displayRating = typeof rating === "number" ? rating.toFixed(1) : "0.0";

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start gap-6">
          <div className="w-20 h-20 bg-muted rounded-md" />
          <div className="flex-1">
            <h3 className="text-xl font-semibold mb-2">{name}</h3>
            <div className="text-muted-foreground mb-2">{type}</div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
              <span>{supervisor_count} Supervisors</span>
              <span>•</span>
              <span className="text-yellow-500">★ {displayRating} avg</span>
            </div>
            <div className="mt-4">
              <Link to={`/organizations/${id}`}>
                <Button
                  variant="outline"
                  className="text-primary hover:text-primary hover:bg-primary/5"
                >
                  View Details →
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
