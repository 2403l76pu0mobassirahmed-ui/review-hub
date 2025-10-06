import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StarRating } from "./StarRating";
import { Badge } from "@/components/ui/badge";
import { MessageSquare } from "lucide-react";
import { motion } from "framer-motion";
import { Doc } from "@/convex/_generated/dataModel";

interface ReviewCardProps {
  review: Doc<"reviews">;
  feedbackCount?: number;
  onClick?: () => void;
}

export function ReviewCard({ review, feedbackCount = 0, onClick }: ReviewCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
      className="cursor-pointer"
      onClick={onClick}
    >
      <Card className="relative overflow-hidden border-border hover:border-primary/50 transition-all glow-primary">
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <CardTitle className="text-lg mb-2">{review.bookTitle}</CardTitle>
              <p className="text-sm text-muted-foreground">by {review.author}</p>
            </div>
            {feedbackCount > 0 && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <MessageSquare className="size-3" />
                {feedbackCount}
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-3">
            <StarRating rating={review.rating} readonly size="sm" />
            <span className="text-xs text-muted-foreground">by {review.userName}</span>
          </div>
          <p className="text-sm text-foreground/80 line-clamp-3">{review.comments}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
}
