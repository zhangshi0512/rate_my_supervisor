import { useState } from "react";
import { ThumbsUp, Flag, Pencil, Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Star } from "lucide-react";

interface ReviewCardProps {
  id: number;
  author: string;
  duration: string;
  rating: number;
  content: string;
  helpfulCount: number;
  isOwner?: boolean;
  onHelpful: () => void;
  onReport: () => void;
  onEdit?: (id: number, newRating: number, newContent: string) => Promise<void>;
  onDelete?: (id: number) => Promise<void>;
}

export function ReviewCard({
  id,
  author,
  duration,
  rating,
  content,
  helpfulCount,
  isOwner = false,
  onHelpful,
  onReport,
  onEdit,
  onDelete,
}: ReviewCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editedContent, setEditedContent] = useState(content);
  const [editedRating, setEditedRating] = useState(rating);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDelete = async () => {
    if (!onDelete) return;

    try {
      setIsSubmitting(true);
      await onDelete(id);
      setShowDeleteDialog(false);
    } catch (error) {
      console.error("Error deleting review:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = async () => {
    if (!onEdit) return;

    try {
      setIsSubmitting(true);
      console.log("Editing review:", { id, editedRating, editedContent });
      await onEdit(id, editedRating, editedContent);
      setShowEditDialog(false);
    } catch (error) {
      console.error("Error updating review:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="font-medium mb-1">{author}</div>
          <div className="text-sm text-muted-foreground">{duration}</div>
        </div>
        <div className="text-yellow-500">★ {rating.toFixed(1)}</div>
      </div>

      <p className="text-muted-foreground mb-4">{content}</p>

      <div className="flex items-center justify-between">
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

        {isOwner && (
          <div className="flex items-center gap-2">
            <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Pencil className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit Review</DialogTitle>
                  <DialogDescription>
                    Make changes to your review below. Click save when you're
                    done.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Rating</Label>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          className="text-2xl focus:outline-none"
                          onMouseEnter={() => setHoveredRating(star)}
                          onMouseLeave={() => setHoveredRating(0)}
                          onClick={() => setEditedRating(star)}
                        >
                          <Star
                            className={`h-6 w-6 ${
                              star <= (hoveredRating || editedRating)
                                ? "fill-yellow-500 text-yellow-500"
                                : "text-muted-foreground"
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Review</Label>
                    <Textarea
                      value={editedContent}
                      onChange={(e) => setEditedContent(e.target.value)}
                      rows={4}
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setShowEditDialog(false)}
                      disabled={isSubmitting}
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleEdit} disabled={isSubmitting}>
                      {isSubmitting ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <AlertDialog
              open={showDeleteDialog}
              onOpenChange={setShowDeleteDialog}
            >
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowDeleteDialog(true)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Review</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete this review? This action
                    cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel disabled={isSubmitting}>
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    disabled={isSubmitting}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    {isSubmitting ? "Deleting..." : "Delete"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}
      </div>

      <Separator className="my-6" />
    </div>
  );
}
