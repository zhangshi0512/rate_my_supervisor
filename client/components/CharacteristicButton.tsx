import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface CharacteristicButtonProps {
  characteristic: string;
  isSelected: boolean;
  isPositive: boolean;
  onClick: () => void;
}

export function CharacteristicButton({
  characteristic,
  isSelected,
  isPositive,
  onClick
}: CharacteristicButtonProps) {
  return (
    <Button
      type="button"
      variant={isSelected ? "default" : "outline"}
      className={cn(
        "h-auto py-2 px-4 text-sm justify-start",
        isSelected && (isPositive ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600")
      )}
      onClick={onClick}
    >
      {characteristic}
    </Button>
  );
}