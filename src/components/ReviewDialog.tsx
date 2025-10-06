import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { StarRating } from "./StarRating";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Lightbulb, Send } from "lucide-react";
import { Doc } from "@/convex/_generated/dataModel";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState } from "react";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ReviewDialogProps {
  review: Doc<"reviews"> | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ReviewDialog({ review, open, onOpenChange }: ReviewDialogProps) {
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [feedbackType, setFeedbackType] = useState<"comment" | "edit_suggestion">("comment");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const feedback = useQuery(
    api.feedback.getByReview,
    review ? { reviewId: review._id } : "skip"
  );
  const addFeedback = useMutation(api.feedback.create);

  const handleSubmitFeedback = async () => {
    if (!review || !feedbackMessage.trim()) return;

    setIsSubmitting(true);
    try {
      await addFeedback({
        reviewId: review._id,
        message: feedbackMessage,
        type: feedbackType,
      });
      toast.success("Feedback added successfully!");
      setFeedbackMessage("");
    } catch (error) {
      toast.error("Failed to add feedback");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!review) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl">{review.bookTitle}</DialogTitle>
          <DialogDescription>by {review.author}</DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="space-y-6">
            {/* Review Details */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <StarRating rating={review.rating} readonly />
                <span className="text-sm text-muted-foreground">
                  Reviewed by {review.userName}
                </span>
              </div>
              <p className="text-foreground leading-relaxed">{review.comments}</p>
            </div>

            {/* Feedback Section */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <MessageSquare className="size-5" />
                Feedback ({feedback?.length || 0})
              </h3>

              {/* Existing Feedback */}
              {feedback && feedback.length > 0 && (
                <div className="space-y-3 mb-6">
                  {feedback.map((fb) => (
                    <div
                      key={fb._id}
                      className="p-4 rounded-lg bg-muted/50 border border-border"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <span className="text-sm font-medium">{fb.userName}</span>
                        <Badge
                          variant={fb.type === "comment" ? "default" : "secondary"}
                          className="text-xs"
                        >
                          {fb.type === "comment" ? (
                            <MessageSquare className="size-3 mr-1" />
                          ) : (
                            <Lightbulb className="size-3 mr-1" />
                          )}
                          {fb.type === "comment" ? "Comment" : "Edit Suggestion"}
                        </Badge>
                      </div>
                      <p className="text-sm text-foreground/90">{fb.message}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Add Feedback Form */}
              <div className="space-y-4">
                <Tabs value={feedbackType} onValueChange={(v) => setFeedbackType(v as typeof feedbackType)}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="comment">
                      <MessageSquare className="size-4 mr-2" />
                      Comment
                    </TabsTrigger>
                    <TabsTrigger value="edit_suggestion">
                      <Lightbulb className="size-4 mr-2" />
                      Edit Suggestion
                    </TabsTrigger>
                  </TabsList>
                </Tabs>

                <Textarea
                  placeholder={
                    feedbackType === "comment"
                      ? "Share your thoughts..."
                      : "Suggest an improvement..."
                  }
                  value={feedbackMessage}
                  onChange={(e) => setFeedbackMessage(e.target.value)}
                  rows={4}
                  className="resize-none"
                />

                <Button
                  onClick={handleSubmitFeedback}
                  disabled={isSubmitting || !feedbackMessage.trim()}
                  className="w-full glow-primary"
                >
                  <Send className="size-4 mr-2" />
                  {isSubmitting ? "Sending..." : "Send Feedback"}
                </Button>
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
