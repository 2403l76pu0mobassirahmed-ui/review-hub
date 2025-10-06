import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Navigation } from "@/components/Navigation";
import { ReviewCard } from "@/components/ReviewCard";
import { ReviewDialog } from "@/components/ReviewDialog";
import { motion } from "framer-motion";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { Loader2, BookOpen } from "lucide-react";
import { Doc } from "@/convex/_generated/dataModel";

export default function AllReviews() {
  const { isLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const reviews = useQuery(api.reviews.listAll);
  
  const [selectedReview, setSelectedReview] = useState<Doc<"reviews"> | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/auth");
    }
  }, [isLoading, isAuthenticated, navigate]);

  const handleReviewClick = (review: Doc<"reviews">) => {
    setSelectedReview(review);
    setDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <Navigation />
      
      <main className="flex-1 p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-6xl mx-auto"
        >
          <div className="mb-8">
            <h1 className="text-4xl font-bold tracking-tight mb-2">All Reviews</h1>
            <p className="text-muted-foreground">
              Browse book reviews from the community
            </p>
          </div>

          {reviews === undefined ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="size-8 animate-spin text-primary" />
            </div>
          ) : reviews.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <BookOpen className="size-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">No reviews yet</h3>
              <p className="text-muted-foreground">
                Be the first to submit a book review!
              </p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reviews.map((review) => (
                <ReviewCard
                  key={review._id}
                  review={review}
                  onClick={() => handleReviewClick(review)}
                />
              ))}
            </div>
          )}
        </motion.div>
      </main>

      <ReviewDialog
        review={selectedReview}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </div>
  );
}
