import { ThumbsUp, Flag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

interface ReviewCardProps {
  author: string;
  duration: string;
  rating: number;
  content: string;
  helpfulCount: number;
  onHelpful: () => void;
  onReport: () => void;
}

export function ReviewCard({
  author,
  duration,
  rating,
  content,
  helpfulCount,
  onHelpful,
  onReport,
}: ReviewCardProps) {
  return (
    <div>
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="font-medium mb-1">{author}</div>
          <div className="text-sm text-muted-foreground">
            Supervised for {duration}
          </div>
        </div>
        <div className="text-yellow-500">★ {rating.toFixed(1)}</div>
      </div>
      <p className="text-muted-foreground mb-4">{content}</p>
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={onHelpful}>
          <ThumbsUp className="h-4 w-4 mr-2" />
          Helpful ({helpfulCount})
        </Button>
        <Button variant="ghost" size="sm" onClick={onReport}>
          <Flag className="h-4 w-4 mr-2" />
          Report
        </Button>
      </div>
      <Separator className="my-6" />
    </div>
  );
}