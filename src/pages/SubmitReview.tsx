import { useAuth } from "@/hooks/use-auth";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { StarRating } from "@/components/StarRating";
import { motion } from "framer-motion";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader2, Send } from "lucide-react";

export default function SubmitReview() {
  const { isLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const createReview = useMutation(api.reviews.create);

  const [bookTitle, setBookTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [rating, setRating] = useState(0);
  const [comments, setComments] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/auth");
    }
  }, [isLoading, isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!bookTitle.trim() || !author.trim() || rating === 0 || !comments.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsSubmitting(true);
    try {
      await createReview({
        bookTitle: bookTitle.trim(),
        author: author.trim(),
        rating,
        comments: comments.trim(),
      });
      
      toast.success("Review submitted successfully!");
      navigate("/reviews");
    } catch (error) {
      toast.error("Failed to submit review");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
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
          className="max-w-3xl mx-auto"
        >
          <div className="mb-8">
            <h1 className="text-4xl font-bold tracking-tight mb-2">Submit a Review</h1>
            <p className="text-muted-foreground">
              Share your thoughts on a book you've read
            </p>
          </div>

          <Card className="glow-primary">
            <CardHeader>
              <CardTitle>Book Review</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="bookTitle">Book Title *</Label>
                  <Input
                    id="bookTitle"
                    placeholder="Enter the book title"
                    value={bookTitle}
                    onChange={(e) => setBookTitle(e.target.value)}
                    disabled={isSubmitting}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="author">Author *</Label>
                  <Input
                    id="author"
                    placeholder="Enter the author's name"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    disabled={isSubmitting}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Rating *</Label>
                  <div className="flex items-center gap-4">
                    <StarRating
                      rating={rating}
                      onRatingChange={setRating}
                      size="lg"
                    />
                    {rating > 0 && (
                      <span className="text-sm text-muted-foreground">
                        {rating} out of 5 stars
                      </span>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="comments">Your Review *</Label>
                  <Textarea
                    id="comments"
                    placeholder="Share your thoughts about this book..."
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    disabled={isSubmitting}
                    rows={8}
                    className="resize-none"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full glow-primary"
                  size="lg"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="size-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="size-4 mr-2" />
                      Submit Review
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
}
