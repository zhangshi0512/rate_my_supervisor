import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';

interface SupervisorCardProps {
  id: number;
  name: string;
  organization: string;
  specialties: string[];
  experience: number;
  rating: number;
  reviewCount: number;
  description?: string;
  compact?: boolean;
}

export function SupervisorCard({
  id,
  name,
  organization,
  specialties,
  experience,
  rating,
  reviewCount,
  description,
  compact = false,
}: SupervisorCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start gap-6">
          <div className={`${compact ? "w-12 h-12" : "w-16 h-16"} bg-muted rounded-full`} />
          <div className="flex-1">
            <h3 className="text-xl font-semibold mb-2">{name}</h3>
            <div className="text-muted-foreground mb-2">{organization}</div>
            {!compact && (
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                <span>{specialties.join(", ")}</span>
                <span>•</span>
                <span>{experience} years experience</span>
                <span>•</span>
                <span className="text-yellow-500">★ {rating.toFixed(1)} ({reviewCount} reviews)</span>
              </div>
            )}
            {description && (
              <p className="text-muted-foreground mb-3">{description}</p>
            )}
            <div className="flex items-center justify-between mt-4">
              <div className="text-yellow-500">★ {rating.toFixed(1)}{!compact && ` (${reviewCount} reviews)`}</div>
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