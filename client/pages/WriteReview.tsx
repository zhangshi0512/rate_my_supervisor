import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Star, ThumbsUp, ThumbsDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { CharacteristicButton } from '@/components/CharacteristicButton';
import { positiveCharacteristics, negativeCharacteristics } from '@/data/supervisorCharacteristics';

interface CharacteristicRating {
  [key: string]: boolean;
}

export default function WriteReview() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [supervisionPeriod, setSupervisionPeriod] = useState('');
  const [positiveRatings, setPositiveRatings] = useState<CharacteristicRating>({});
  const [negativeRatings, setNegativeRatings] = useState<CharacteristicRating>({});
  const [additionalComments, setAdditionalComments] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0) {
      toast.error('Please provide an overall rating');
      return;
    }

    if (!supervisionPeriod.trim()) {
      toast.error('Please specify the supervision period');
      return;
    }

    const selectedPositive = Object.entries(positiveRatings).filter(([_, value]) => value).length;
    const selectedNegative = Object.entries(negativeRatings).filter(([_, value]) => value).length;

    if (selectedPositive === 0 && selectedNegative === 0) {
      toast.error('Please select at least one characteristic');
      return;
    }

    // Here you would typically submit the review to your backend
    toast.success('Review submitted successfully!');
    navigate(`/supervisors/${id}`);
  };

  const toggleCharacteristic = (characteristic: string, isPositive: boolean) => {
    if (isPositive) {
      setPositiveRatings(prev => ({
        ...prev,
        [characteristic]: !prev[characteristic]
      }));
    } else {
      setNegativeRatings(prev => ({
        ...prev,
        [characteristic]: !prev[characteristic]
      }));
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Card>
        <CardContent className="p-8">
          <h1 className="text-3xl font-bold mb-6">Write a Review</h1>
          
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Overall Rating */}
            <div className="space-y-2">
              <Label className="text-lg font-semibold">Overall Rating</Label>
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
                          ? 'fill-yellow-500 text-yellow-500'
                          : 'text-muted-foreground'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Supervision Period */}
            <div className="space-y-2">
              <Label className="text-lg font-semibold" htmlFor="period">
                Supervision Period
              </Label>
              <Input
                id="period"
                placeholder="e.g., 6 months, 1 year"
                value={supervisionPeriod}
                onChange={(e) => setSupervisionPeriod(e.target.value)}
              />
            </div>

            {/* Positive Characteristics */}
            <div className="space-y-4">
              <Label className="text-lg font-semibold flex items-center gap-2">
                <ThumbsUp className="h-5 w-5 text-green-500" />
                Positive Characteristics
              </Label>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {positiveCharacteristics.map((characteristic) => (
                  <CharacteristicButton
                    key={characteristic}
                    characteristic={characteristic}
                    isSelected={!!positiveRatings[characteristic]}
                    isPositive={true}
                    onClick={() => toggleCharacteristic(characteristic, true)}
                  />
                ))}
              </div>
            </div>

            {/* Negative Characteristics */}
            <div className="space-y-4">
              <Label className="text-lg font-semibold flex items-center gap-2">
                <ThumbsDown className="h-5 w-5 text-red-500" />
                Negative Characteristics
              </Label>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {negativeCharacteristics.map((characteristic) => (
                  <CharacteristicButton
                    key={characteristic}
                    characteristic={characteristic}
                    isSelected={!!negativeRatings[characteristic]}
                    isPositive={false}
                    onClick={() => toggleCharacteristic(characteristic, false)}
                  />
                ))}
              </div>
            </div>

            {/* Additional Comments (Optional) */}
            <div className="space-y-2">
              <Label className="text-lg font-semibold" htmlFor="comments">
                Additional Comments (Optional)
              </Label>
              <textarea
                id="comments"
                className="min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                placeholder="Add any additional comments about your experience..."
                value={additionalComments}
                onChange={(e) => setAdditionalComments(e.target.value)}
              />
            </div>

            {/* Anonymous Option */}
            <div className="flex items-center justify-between">
              <Label htmlFor="anonymous" className="cursor-pointer text-lg font-semibold">
                Post Anonymously
              </Label>
              <Switch
                id="anonymous"
                checked={isAnonymous}
                onCheckedChange={setIsAnonymous}
              />
            </div>

            <Separator />

            {/* Submit Buttons */}
            <div className="flex gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(`/supervisors/${id}`)}
              >
                Cancel
              </Button>
              <Button type="submit">Submit Review</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}