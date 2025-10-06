import { motion } from "framer-motion";
import { BookOpen, MessageSquare, Users, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useNavigate } from "react-router";

export default function Landing() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate("/dashboard");
    } else {
      navigate("/auth");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="flex-1 flex flex-col items-center justify-center px-4 py-20 relative overflow-hidden"
      >
        {/* Background gradient effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10 pointer-events-none" />
        
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mb-8"
          >
            <img
              src="./logo.svg"
              alt="Review Hub"
              width={80}
              height={80}
              className="mx-auto mb-6 glow-primary rounded-lg"
            />
          </motion.div>

          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent"
          >
            Review Hub
          </motion.h1>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-2xl mx-auto"
          >
            Share your book reviews, get valuable feedback, and connect with a community of passionate readers
          </motion.p>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <Button
              size="lg"
              onClick={handleGetStarted}
              className="glow-primary text-lg px-8 py-6 cursor-pointer"
            >
              {isAuthenticated ? "Go to Dashboard" : "Get Started"}
              <ArrowRight className="ml-2 size-5" />
            </Button>
          </motion.div>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.8 }}
        className="py-20 px-4 border-t border-border"
      >
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            Why Review Hub?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              className="p-6 rounded-xl border border-border bg-card/50 backdrop-blur glow-primary"
            >
              <div className="size-12 rounded-lg bg-primary/20 flex items-center justify-center mb-4">
                <BookOpen className="size-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Submit Reviews</h3>
              <p className="text-muted-foreground">
                Share your thoughts on books you've read with detailed reviews and star ratings
              </p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              className="p-6 rounded-xl border border-border bg-card/50 backdrop-blur glow-secondary"
            >
              <div className="size-12 rounded-lg bg-secondary/20 flex items-center justify-center mb-4">
                <MessageSquare className="size-6 text-secondary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Get Feedback</h3>
              <p className="text-muted-foreground">
                Receive constructive comments and edit suggestions from fellow readers
              </p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              className="p-6 rounded-xl border border-border bg-card/50 backdrop-blur glow-accent"
            >
              <div className="size-12 rounded-lg bg-accent/20 flex items-center justify-center mb-4">
                <Users className="size-6 text-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Community Driven</h3>
              <p className="text-muted-foreground">
                Connect with a vibrant community of book lovers and improve your reviews together
              </p>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-border text-center text-sm text-muted-foreground">
        <p>
          Powered by{" "}
          <a
            href="https://vly.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            vly.ai
          </a>
        </p>
      </footer>
    </div>
  );
}