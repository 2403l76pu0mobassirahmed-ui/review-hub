import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, BookOpen, Lightbulb } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

export default function Dashboard() {
  const { isLoading, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const myReviews = useQuery(api.reviews.myReviews);
  const myReviewsFeedback = useQuery(api.feedback.getMyReviewsFeedback);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/auth");
    }
  }, [isLoading, isAuthenticated, navigate]);

  if (isLoading || !user) {
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
          className="max-w-6xl mx-auto space-y-8"
        >
          {/* Header */}
          <div>
            <h1 className="text-4xl font-bold tracking-tight mb-2">
              Welcome back, {user.name || user.email || "Reviewer"}!
            </h1>
            <p className="text-muted-foreground">
              Here's an overview of your review activity
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="glow-primary">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="size-5 text-primary" />
                    My Reviews
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold">{myReviews?.length || 0}</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Total reviews submitted
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="glow-secondary">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="size-5 text-secondary" />
                    Feedback Received
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold">{myReviewsFeedback?.length || 0}</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Comments and suggestions
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Recent Feedback */}
          <div>
            <h2 className="text-2xl font-bold tracking-tight mb-4">Recent Feedback</h2>
            {myReviewsFeedback && myReviewsFeedback.length > 0 ? (
              <div className="space-y-4">
                {myReviewsFeedback.slice(0, 5).map((fb) => (
                  <motion.div
                    key={fb._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ scale: 1.01 }}
                  >
                    <Card className="hover:border-primary/50 transition-all">
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <p className="font-semibold">{fb.reviewTitle}</p>
                            <p className="text-sm text-muted-foreground">
                              Feedback from {fb.userName}
                            </p>
                          </div>
                          <Badge
                            variant={fb.type === "comment" ? "default" : "secondary"}
                            className="flex items-center gap-1"
                          >
                            {fb.type === "comment" ? (
                              <MessageSquare className="size-3" />
                            ) : (
                              <Lightbulb className="size-3" />
                            )}
                            {fb.type === "comment" ? "Comment" : "Edit Suggestion"}
                          </Badge>
                        </div>
                        <p className="text-sm text-foreground/90">{fb.message}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="pt-6 text-center py-12">
                  <MessageSquare className="size-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">
                    No feedback yet. Keep reviewing books!
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </motion.div>
      </main>
    </div>
  );
}
